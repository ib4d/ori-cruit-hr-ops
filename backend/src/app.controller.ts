import { Controller, Get, Logger } from '@nestjs/common';
import { PrismaService } from './common/prisma/prisma.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getHello(): string {
    return 'Welcome to Ori-Cruit API. Status: Running. Environment: Development.';
  }

  @Get('health')
  async getHealth() {
    let dbStatus = 'ok';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      dbStatus = 'disconnected';
      this.logger.error('Health check failed: Database disconnected', error);
    }
    
    return { 
      status: dbStatus === 'ok' ? 'ok' : 'error',
      database: dbStatus,
      timestamp: new Date().toISOString() 
    };
  }
}
