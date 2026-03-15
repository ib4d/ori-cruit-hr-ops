import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { StorageService } from '../../common/storage/storage.service';
import { CreateCandidateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class CandidateDocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async create(dto: CreateCandidateDocumentDto, file: Express.Multer.File, orgId: string) {
    // Verify candidate belongs to the org
    const candidate = await this.prisma.candidate.findFirst({
      where: { id: dto.candidateId, organizationId: orgId },
    });
    if (!candidate) throw new ForbiddenException('Candidate not found or access denied');

    const fileUrl = await this.storage.uploadFile(file, `candidates/${dto.candidateId}`);

    const document = await this.prisma.candidateDocument.create({
      data: {
        candidateId: dto.candidateId,
        organizationId: orgId,
        type: dto.type,
        fileName: file.originalname,
        fileUrl,
        fileSize: file.size,
        mimeType: file.mimetype,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        notes: dto.notes,
      },
    });

    return document;
  }

  async findByCandidate(candidateId: string, orgId: string) {
    return this.prisma.candidateDocument.findMany({
      where: { candidateId, organizationId: orgId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async remove(id: string, orgId: string) {
    const doc = await this.prisma.candidateDocument.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!doc) throw new NotFoundException('Document not found');

    await this.storage.deleteFile(doc.fileUrl);
    return this.prisma.candidateDocument.delete({ where: { id } });
  }
}
