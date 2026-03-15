import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          fullName: dto.fullName,
          languagePreference: dto.language ?? 'en',
        },
      });

      let orgId = null;
      let role = null;

      if (dto.orgName && dto.orgSlug) {
        const org = await tx.organization.create({
          data: {
            name: dto.orgName,
            slug: dto.orgSlug,
          },
        });
        orgId = org.id;
        role = 'OWNER';

        await tx.organizationMembership.create({
          data: {
            organizationId: orgId,
            userId: user.id,
            role: 'OWNER',
          },
        });
      }

      const tokenData = this.signToken(user.id, user.email, orgId, role);
      return tokenData;
    });
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Resolve membership for the requested org
    let membership = null;
    if (dto.organizationId) {
      membership = await this.prisma.organizationMembership.findUnique({
        where: {
          organizationId_userId: {
            organizationId: dto.organizationId,
            userId: user.id,
          },
        },
        include: { organization: true },
      });
    } else {
      // Auto-pick the first org the user belongs to
      membership = await this.prisma.organizationMembership.findFirst({
        where: { userId: user.id },
        include: { organization: true },
      });
    }

    return this.signToken(user.id, user.email, membership?.organizationId ?? null, membership?.role ?? null);
  }

  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true, languagePreference: true, lastLoginAt: true },
    });
  }

  private signToken(userId: string, email: string, orgId: string | null, role: string | null) {
    const payload = { sub: userId, email, orgId, role };
    return {
      token: this.jwt.sign(payload),
      user: { id: userId, email, orgId, role },
    };
  }
}
