import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private readonly uploadDir: string;

  constructor(private config: ConfigService) {
    this.uploadDir = this.config.get<string>('STORAGE_PATH', path.join(process.cwd(), 'uploads'));
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'documents'): Promise<string> {
    try {
      const ext = path.extname(file.originalname);
      const fileName = `${uuidv4()}${ext}`;
      const targetFolder = path.join(this.uploadDir, folder);
      
      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
      }

      const filePath = path.join(targetFolder, fileName);
      fs.writeFileSync(filePath, file.buffer);

      // Return a relative path or URL
      return `/${folder}/${fileName}`;
    } catch (error) {
      console.error('File upload error:', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const filePath = path.join(this.uploadDir, fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('File deletion error:', error);
    }
  }
}
