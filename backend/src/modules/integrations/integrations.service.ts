import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async sendWhatsApp(to: string, templateName: string, variables: any, orgId: string) {
    const token = this.config.get('WHATSAPP_API_TOKEN');
    const phoneId = this.config.get('WHATSAPP_PHONE_NUMBER_ID');

    console.log(`[WhatsApp] Sending ${templateName} to ${to} (Org: ${orgId})`);

    if (!token || !phoneId) {
      console.warn('[WhatsApp] API not configured, skipping live call');
      return { status: 'SIMULATED', messageId: `msg_${Date.now()}` };
    }

    try {
      const response = await axios.post(
        `https://graph.facebook.com/v17.0/${phoneId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'template',
          template: {
            name: templateName,
            language: { code: variables.language || 'en' },
            components: variables.components || [],
          },
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return { status: 'SENT', messageId: response.data.messages[0].id };
    } catch (error) {
      console.error('[WhatsApp] Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async sendEmail(to: string, subject: string, html: string, orgId: string) {
    const apiKey = this.config.get('RESEND_API_KEY');
    const from = this.config.get('EMAIL_FROM', 'noreply@ori-cruit.com');

    console.log(`[Email] Sending "${subject}" to ${to} (Org: ${orgId})`);

    if (!apiKey) {
      console.warn('[Email] Resend API key not configured, skipping live call');
      return { status: 'SIMULATED', messageId: `email_${Date.now()}` };
    }

    try {
      const response = await axios.post(
        'https://api.resend.com/emails',
        { from, to, subject, html },
        { headers: { Authorization: `Bearer ${apiKey}` } },
      );
      return { status: 'SENT', messageId: response.data.id };
    } catch (error) {
      console.error('[Email] Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async syncToHRappka(candidateId: string, orgId: string) {
    const enabled = this.config.get('HRAPPKA_ENABLED') === 'true';
    if (!enabled) return { status: 'DISABLED' };

    console.log(`[HRappka] Syncing candidate ${candidateId} (Org: ${orgId})`);
    // HRappka sync logic would go here
    return { status: 'SYNCED' };
  }
}
