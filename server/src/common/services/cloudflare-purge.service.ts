import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CloudflarePurgeService {
  private readonly logger = new Logger(CloudflarePurgeService.name);
  private readonly zoneId = process.env.CLOUDFLARE_ZONE_ID;
  private readonly apiToken = process.env.CLOUDFLARE_API_TOKEN;

  /**
   * Purge Cloudflare Edge Cache by Cache-Tags (Enterprise feature)
   */
  async purgeTags(tags: string[]): Promise<boolean> {
    if (!this.zoneId || !this.apiToken) {
      this.logger.debug(
        `[Local/Dev Mode] Simulated Cloudflare Edge Cache purge for tags: [${tags.join(', ')}]`,
      );
      return true;
    }

    try {
      const url = `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/purge_cache`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.warn(`Cloudflare tag purge failed (${response.status}): ${errorText}`);
        return false;
      }

      this.logger.log(` Successfully purged Cloudflare Edge Cache for tags: [${tags.join(', ')}]`);
      return true;
    } catch (err: any) {
      this.logger.error(`Error requesting Cloudflare cache purge: ${err?.message || err}`);
      return false;
    }
  }

  /**
   * Purge Cloudflare Edge Cache by specific URLs
   */
  async purgeUrls(urls: string[]): Promise<boolean> {
    if (!this.zoneId || !this.apiToken) {
      this.logger.debug(
        `[Local/Dev Mode] Simulated Cloudflare Edge Cache purge for URLs: [${urls.join(', ')}]`,
      );
      return true;
    }

    try {
      const url = `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/purge_cache`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: urls }),
      });

      return response.ok;
    } catch (err: any) {
      this.logger.error(`Error requesting Cloudflare URL purge: ${err?.message || err}`);
      return false;
    }
  }
}
