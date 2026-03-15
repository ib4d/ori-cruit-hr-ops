import * as cron from 'node-cron';
import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: '../backend/.env' });

const prisma = new PrismaClient();

console.log('🔧 Ori-Cruit Workers starting...');

/**
 * Job: Follow-up sender
 * Runs every hour — finds due follow-ups and marks them for dispatch.
 */
cron.schedule('0 * * * *', async () => {
  console.log('[WORKER] Checking due follow-ups...');
  const dueFollowUps = await prisma.followUp.findMany({
    where: {
      scheduledAt: { lte: new Date() },
      status: 'PENDING',
    },
    include: { candidate: true },
  });

  for (const fu of dueFollowUps) {
    console.log(`[WORKER] Follow-up due: ${fu.id} for candidate ${fu.candidateId} via ${fu.channel}`);
    // Dispatching logic...
    
    await prisma.followUp.update({
      where: { id: fu.id },
      data: { 
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });
    await prisma.candidateEvent.create({
      data: {
        candidateId: fu.candidateId,
        organizationId: fu.organizationId,
        type: 'FOLLOW_UP_SENT',
        payload: { followUpId: fu.id, type: fu.type, channel: fu.channel },
      },
    });
  }
  console.log(`[WORKER] Processed ${dueFollowUps.length} follow-ups`);
});

/**
 * Job: GDPR Retention Enforcer
 * Runs daily at 03:00 UTC — anonymises/deletes candidates past their retention window.
 */
cron.schedule('0 3 * * *', async () => {
  console.log('[WORKER] Running GDPR retention check...');
  const policies = await prisma.retentionPolicy.findMany({
    include: { organization: true },
  });

  let processed = 0;
  for (const policy of policies) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - policy.retentionDays);

    const statusMap: Record<string, string[]> = {
      PLACED: ['CLOSED_SUCCESS'],
      REJECTED: ['LEGAL_REJECTED', 'CLOSED_ABANDONED'],
      ABANDONED: ['CLOSED_ABANDONED'],
    };

    const statuses = statusMap[policy.outcomeType] ?? [];
    if (!statuses.length) continue;

    const candidates = await prisma.candidate.findMany({
      where: {
        organizationId: policy.organizationId,
        status: { in: statuses as any[] },
        updatedAt: { lt: cutoff },
        firstName: { not: 'ANONYMISED' },
      },
    });

    for (const c of candidates) {
      if (policy.action === 'ANONYMISE') {
        await prisma.candidate.update({
          where: { id: c.id },
          data: { firstName: 'ANONYMISED', lastName: 'ANONYMISED', email: null, phone: null, whatsappNumber: null, notes: null },
        });
      } else {
        await prisma.candidate.delete({ where: { id: c.id } });
      }
      processed++;
    }
  }
  console.log(`[WORKER] GDPR retention: ${processed} candidates processed`);
});

console.log('✅ Workers running. Jobs: follow-ups (hourly), GDPR retention (daily 03:00 UTC)');

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
