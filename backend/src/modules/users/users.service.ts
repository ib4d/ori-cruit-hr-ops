import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, fullName: true, languagePreference: true, lastLoginAt: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: { id: true, email: true, fullName: true, languagePreference: true },
    });
  }

  async findByOrg(orgId: string) {
    return this.prisma.organizationMembership.findMany({
      where: { organizationId: orgId },
      include: {
        user: {
          select: { id: true, email: true, fullName: true, lastLoginAt: true },
        },
      },
    });
  }
}
