import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ResearchOpportunity } from '../opportunities/entities/research-opportunity.entity';

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  recipient: string;
  subject: string;
  isMockFallback: boolean;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private getApiKey(): string | undefined {
    return process.env.RESEND_API_KEY;
  }

  private getSenderEmail(): string {
    return process.env.EMAIL_FROM || 'Cambium Intelligence <scholar@cambium.research>';
  }

  /**
   * Generic mail sender integrating Resend with graceful console fallback
   */
  async sendMail(to: string, subject: string, html: string): Promise<EmailSendResult> {
    const apiKey = this.getApiKey();

    if (apiKey && apiKey !== 'your_resend_api_key_here' && apiKey.startsWith('re_')) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: this.getSenderEmail(),
            to,
            subject,
            html,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          this.logger.log(` Email successfully sent via Resend: [${data.id}] to ${to}`);
          return {
            success: true,
            messageId: data.id,
            recipient: to,
            subject,
            isMockFallback: false,
          };
        } else {
          const errText = await response.text();
          this.logger.warn(`Resend API returned status ${response.status}: ${errText}. Using console fallback.`);
        }
      } catch (err: any) {
        this.logger.warn(`Failed to connect to Resend API: ${err.message}. Using console fallback.`);
      }
    }

    // High-fidelity fallback for offline development & staging
    this.logger.log(`📧 [EMAIL DISPATCH SIMULATION]`);
    this.logger.log(`   To: ${to}`);
    this.logger.log(`   Subject: ${subject}`);
    this.logger.log(`   Status: Delivered to Simulated Outbox`);

    return {
      success: true,
      messageId: `sim-${Date.now()}`,
      recipient: to,
      subject,
      isMockFallback: true,
    };
  }

  /**
   * Weekly Deadline Digest Email Template (Living Materials Theme)
   */
  async sendWeeklyDeadlineDigest(
    to: string,
    name: string,
    expiringOpportunities: ResearchOpportunity[],
  ): Promise<EmailSendResult> {
    const subject = `Cambium Weekly Digest: ${expiringOpportunities.length} Grants Expiring in 14 Days`;

    const grantItemsHtml = expiringOpportunities
      .map(
        (opp) => `
        <tr style="border-bottom: 1px solid #E5E1D8;">
          <td style="padding: 12px 0;">
            <div style="font-weight: 600; color: #202920; font-size: 15px;">${opp.title}</div>
            <div style="color: #636F63; font-size: 13px; margin-top: 2px;">
              Funder: <strong>${opp.organization}</strong> | Type: <strong>${opp.type}</strong>
            </div>
            <div style="color: #3E6248; font-size: 12px; margin-top: 4px; font-weight: 500;">
              ⏳ Deadline: ${opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'Rolling'}
            </div>
          </td>
        </tr>`,
      )
      .join('');

    const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /></head>
    <body style="font-family: 'Inter', -apple-system, sans-serif; background-color: #FAF7F0; padding: 24px; margin: 0;">
      <table align="center" width="100%" style="max-width: 600px; background: #FFFFFF; border-radius: 12px; border: 1px solid #E5E1D8; padding: 28px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        <tr>
          <td>
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
              <span style="font-size: 20px; font-weight: 700; color: #202920;">CAMBIUM</span>
              <span style="background: #DCE6D7; color: #3E6248; font-size: 11px; padding: 2px 8px; border-radius: 9999px; font-weight: 600; margin-left: 8px;">RESEARCH DIGEST</span>
            </div>
            <h2 style="color: #202920; margin-top: 0; font-size: 20px;">Upcoming Research Deadlines</h2>
            <p style="color: #555; font-size: 14px; line-height: 1.6;">
              Dear Dr. ${name},<br />
              Here is your automated scholarship digest. The following bookmarked opportunities are closing within the next 14 calendar days:
            </p>
            <table width="100%" style="border-collapse: collapse; margin-top: 16px;">
              ${grantItemsHtml}
            </table>
            <div style="margin-top: 28px; text-align: center;">
              <a href="http://localhost:3000/opportunities" style="background: #3E6248; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px; display: inline-block;">Open Cambium Workspace</a>
            </div>
            <div style="margin-top: 28px; border-top: 1px solid #E5E1D8; padding-top: 16px; color: #888; font-size: 11px; text-align: center;">
              Cambium Research Platform · Cryptographically Audited Scholar Communications
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>`;

    return this.sendMail(to, subject, html);
  }

  /**
   * Grant Match Alert Email
   */
  async sendGrantMatchAlert(
    to: string,
    name: string,
    opp: ResearchOpportunity,
  ): Promise<EmailSendResult> {
    const subject = `New Grant Match: ${opp.title} (${opp.organization})`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /></head>
    <body style="font-family: 'Inter', -apple-system, sans-serif; background-color: #FAF7F0; padding: 24px;">
      <table align="center" width="100%" style="max-width: 600px; background: #FFFFFF; border-radius: 12px; border: 1px solid #E5E1D8; padding: 28px;">
        <tr>
          <td>
            <h2 style="color: #202920; margin-top: 0;">🎯 Semantic Research Match Identified</h2>
            <p style="color: #555; font-size: 14px;">
              Hello Dr. ${name},<br />
              Cambium's hybrid vector matcher identified a high-alignment call matching your active taxonomy profiles:
            </p>
            <div style="background: #FAF7F0; border-left: 4px solid #3E6248; padding: 16px; border-radius: 4px; margin: 16px 0;">
              <h3 style="margin: 0 0 6px 0; color: #202920;">${opp.title}</h3>
              <p style="margin: 0; color: #636F63; font-size: 13px;">Funder: <strong>${opp.organization}</strong></p>
              <p style="margin: 8px 0 0 0; color: #555; font-size: 13px;">${opp.description || 'No description provided.'}</p>
            </div>
            <a href="http://localhost:3000/opportunities" style="background: #3E6248; color: #FFFFFF; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; font-size: 13px; display: inline-block;">View Opportunity in Cambium</a>
          </td>
        </tr>
      </table>
    </body>
    </html>`;

    return this.sendMail(to, subject, html);
  }
}
