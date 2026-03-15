import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { PrismaModule } from './common/prisma/prisma.module';
import { StorageModule } from './common/storage/storage.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { UsersModule } from './modules/users/users.module';
import { CandidatesModule } from './modules/candidates/candidates.module';
import { CandidateDocumentsModule } from './modules/candidate-documents/candidate-documents.module';
import { LegalReviewsModule } from './modules/legal-reviews/legal-reviews.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { FollowUpsModule } from './modules/follow-ups/follow-ups.module';
import { ConsentsModule } from './modules/consents/consents.module';
import { MessageTemplatesModule } from './modules/message-templates/message-templates.module';
import { MessagesModule } from './modules/messages/messages.module';
import { CandidateEventsModule } from './modules/candidate-events/candidate-events.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { ComplianceModule } from './modules/compliance/compliance.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    StorageModule,
    AuthModule,
    OrganizationsModule,
    UsersModule,
    CandidatesModule,
    CandidateDocumentsModule,
    LegalReviewsModule,
    ProjectsModule,
    AssignmentsModule,
    PaymentsModule,
    FollowUpsModule,
    ConsentsModule,
    MessageTemplatesModule,
    MessagesModule,
    CandidateEventsModule,
    AuditLogModule,
    IntegrationsModule,
    ComplianceModule,
    DashboardModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
