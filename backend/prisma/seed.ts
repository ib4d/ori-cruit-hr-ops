import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Ori-Cruit database...');

  // ─── Organization: Folga ─────────────────────────────────
  const folga = await prisma.organization.upsert({
    where: { slug: 'folga' },
    update: {},
    create: {
      name: 'Folga Recruitment Agency',
      slug: 'folga',
      primaryDomain: 'folga.ori-cruit.com',
      primaryColor: '#00D4AA',
      secondaryColor: '#C9A84C',
      localeDefault: 'pl',
      allowedLocales: ['pl', 'es', 'en'],
    },
  });
  console.log('✅ Organization: Folga', folga.id);

  // ─── Admin User ───────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: 'admin@folga.pl' },
    update: {},
    create: {
      email: 'admin@folga.pl',
      passwordHash: await bcrypt.hash('FolgaAdmin2025!', 12),
      fullName: 'Admin Folga',
      languagePreference: 'pl',
    },
  });
  await prisma.organizationMembership.upsert({
    where: { organizationId_userId: { organizationId: folga.id, userId: admin.id } },
    update: {},
    create: { organizationId: folga.id, userId: admin.id, role: 'OWNER' },
  });
  console.log('✅ Admin user: admin@folga.pl / FolgaAdmin2025!');

  // ─── Recruiter User ───────────────────────────────────────
  const recruiter = await prisma.user.upsert({
    where: { email: 'recruiter@folga.pl' },
    update: {},
    create: {
      email: 'recruiter@folga.pl',
      passwordHash: await bcrypt.hash('Recruiter2025!', 12),
      fullName: 'Maria Kowalska',
      languagePreference: 'pl',
    },
  });
  await prisma.organizationMembership.upsert({
    where: { organizationId_userId: { organizationId: folga.id, userId: recruiter.id } },
    update: {},
    create: { organizationId: folga.id, userId: recruiter.id, role: 'RECRUITER' },
  });
  console.log('✅ Recruiter: recruiter@folga.pl / Recruiter2025!');

  // ─── Project ──────────────────────────────────────────────
  const project = await prisma.project.upsert({
    where: { id: 'proj-folga-warszawa-2025' },
    update: {},
    create: {
      id: 'proj-folga-warszawa-2025',
      organizationId: folga.id,
      name: 'Warszawa Manufacturing Q1 2025',
      description: 'Production workers for Warszawa industrial park',
      location: 'Warszawa, PL',
      startDate: new Date('2025-02-01'),
    },
  });
  console.log('✅ Project:', project.name);

  // ─── Message Templates ────────────────────────────────────
  const templates = [
    {
      code: 'FIRST_CONTACT',
      locale: 'es',
      channel: 'whatsapp',
      body: 'Hola {{candidate_first_name}}, soy {{recruiter_name}} de {{org_name}}. Te contacto porque tenemos una oportunidad de trabajo en Polonia que podría interesarte. ¿Tienes un momento para hablar?',
    },
    {
      code: 'FIRST_CONTACT',
      locale: 'en',
      channel: 'whatsapp',
      body: 'Hi {{candidate_first_name}}, I\'m {{recruiter_name}} from {{org_name}}. I\'m reaching out because we have a work opportunity in Poland that might interest you. Do you have a moment to talk?',
    },
    {
      code: 'DOCS_RECEIVED',
      locale: 'es',
      channel: 'whatsapp',
      body: 'Hola {{candidate_first_name}}, hemos recibido tus documentos correctamente. Nuestro equipo legal los revisará en los próximos 2-3 días hábiles. Te avisaremos por este mismo canal. ¡Gracias!',
    },
    {
      code: 'ARRIVAL_INSTRUCTIONS',
      locale: 'es',
      channel: 'whatsapp',
      body: `Hola {{candidate_first_name}}, ¡ya falta poco! Aquí están las instrucciones de llegada:\n\n📍 Dirección: {{project_address}}\n📅 Fecha de inicio: {{start_date}}\n🕐 Hora de presentación: {{start_time}}\n\nDocumentos que debes traer: pasaporte original y permiso de trabajo.\n\n¿Tienes alguna pregunta?`,
    },
    {
      code: 'PAYMENT_REMINDER',
      locale: 'es',
      channel: 'whatsapp',
      body: 'Hola {{candidate_first_name}}, te recordamos que el pago de la tasa de legalización (800 PLN) está pendiente. Puedes realizarlo mediante transferencia a: {{bank_account}}. Referencia: {{candidate_id}}',
    },
  ];

  for (const tpl of templates) {
    await prisma.messageTemplate.upsert({
      where: {
        organizationId_code_locale_channel: {
          organizationId: folga.id,
          code: tpl.code,
          locale: tpl.locale,
          channel: tpl.channel,
        },
      },
      update: {},
      create: {
        organizationId: folga.id,
        ...tpl,
        variables: tpl.body.match(/\{\{([^}]+)\}\}/g)?.map(v => v.slice(2, -2)) ?? [],
      },
    });
  }
  console.log(`✅ ${templates.length} message templates seeded`);

  // ─── Sample Candidates ────────────────────────────────────
  const candidates = [
    { firstName: 'Carlos', lastName: 'Rivera', phone: '+573001234567', countryOfOrigin: 'CO', nationality: 'Colombian', whatsappNumber: '+573001234567', status: 'LEGAL_REVIEW' as any, source: 'WhatsApp' },
    { firstName: 'Ana', lastName: 'Martínez', phone: '+521234567890', countryOfOrigin: 'MX', nationality: 'Mexican', whatsappNumber: '+521234567890', status: 'DOCS_PENDING' as any, source: 'Web Form' },
    { firstName: 'Diego', lastName: 'Santos', phone: '+5511987654321', countryOfOrigin: 'BR', nationality: 'Brazilian', whatsappNumber: '+5511987654321', status: 'ASSIGNED' as any, source: 'HRappka' },
  ];

  for (const c of candidates) {
    await prisma.candidate.create({
      data: { ...c, organizationId: folga.id },
    });
  }
  console.log(`✅ ${candidates.length} sample candidates created`);

  // ─── Retention Policies ───────────────────────────────────
  await prisma.retentionPolicy.createMany({
    data: [
      { organizationId: folga.id, outcomeType: 'PLACED', retentionDays: 1825, action: 'ANONYMISE' }, // 5 years
      { organizationId: folga.id, outcomeType: 'REJECTED', retentionDays: 180, action: 'ANONYMISE' },
      { organizationId: folga.id, outcomeType: 'ABANDONED', retentionDays: 90, action: 'DELETE' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ GDPR retention policies seeded');

  console.log('\n🎉 Seed complete! Ori-Cruit is ready.');
  console.log('   org: Folga | admin: admin@folga.pl | pw: FolgaAdmin2025!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
