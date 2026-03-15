import { Controller, Get, Post, Delete, Param, Body, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { CandidateDocumentsService } from './candidate-documents.service';
import { CreateCandidateDocumentDto } from './dto/create-document.dto';
import { CurrentOrg } from '../../common/decorators/auth.decorators';

@Controller('candidate-documents')
@UseGuards(AuthGuard('jwt'))
export class CandidateDocumentsController {
  constructor(private readonly service: CandidateDocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateCandidateDocumentDto,
    @CurrentOrg() org: any,
  ) {
    if (!file) throw new BadRequestException('File is required');
    return this.service.create(dto, file, org.id);
  }

  @Get('candidate/:id')
  findByCandidate(@Param('id') candidateId: string, @CurrentOrg() org: any) {
    return this.service.findByCandidate(candidateId, org.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentOrg() org: any) {
    return this.service.remove(id, org.id);
  }
}
