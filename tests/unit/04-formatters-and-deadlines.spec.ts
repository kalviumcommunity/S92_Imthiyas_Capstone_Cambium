import {
  formatGrantAmount,
  getDeadlineUrgency,
  generateSlug,
  estimateReadingTime,
} from '../../client/lib/formatters';

describe('Suite 04: Enterprise Formatters & Opportunity Intelligence Utilities', () => {
  describe('Grant Amount Formatting', () => {
    it('should format standard amounts with USD currency symbol and thousands separators', () => {
      const formatted = formatGrantAmount(750000, 'USD', false);
      expect(formatted).toBe('$750,000');
    });

    it('should support European Euro formatting', () => {
      const formatted = formatGrantAmount(1200000, 'EUR', false);
      expect(formatted).toContain('1,200,000');
    });

    it('should handle compact abbreviation for Millions, Billions, and Thousands', () => {
      expect(formatGrantAmount(2500000, 'USD', true)).toBe('$2.5M');
      expect(formatGrantAmount(1200000000, 'USD', true)).toBe('$1.2B');
      expect(formatGrantAmount(450000, 'USD', true)).toBe('$450K');
      expect(formatGrantAmount(500000, 'EUR', true)).toBe('EUR 500K');
    });

    it('should return "Undisclosed" for negative amounts, NaN, or unspecified budgets', () => {
      expect(formatGrantAmount(-100)).toBe('Undisclosed');
      expect(formatGrantAmount(NaN)).toBe('Undisclosed');
    });
  });

  describe('Deadline Urgency Calculator', () => {
    const fixedNow = new Date('2026-10-26T00:00:00Z');

    it('should classify <= 0 days as "expired"', () => {
      const pastDate = '2026-10-25T00:00:00Z';
      const result = getDeadlineUrgency(pastDate, fixedNow);
      expect(result.urgency).toBe('expired');
      expect(result.daysRemaining).toBeLessThanOrEqual(0);
    });

    it('should classify 1-3 days as "critical"', () => {
      const twoDaysAway = '2026-10-28T00:00:00Z';
      const result = getDeadlineUrgency(twoDaysAway, fixedNow);
      expect(result.urgency).toBe('critical');
      expect(result.daysRemaining).toBe(2);
    });

    it('should classify 4-7 days as "urgent"', () => {
      const fiveDaysAway = '2026-10-31T00:00:00Z';
      const result = getDeadlineUrgency(fiveDaysAway, fixedNow);
      expect(result.urgency).toBe('urgent');
      expect(result.daysRemaining).toBe(5);
    });

    it('should classify 8-21 days as "approaching"', () => {
      const fourteenDaysAway = '2026-11-09T00:00:00Z';
      const result = getDeadlineUrgency(fourteenDaysAway, fixedNow);
      expect(result.urgency).toBe('approaching');
      expect(result.daysRemaining).toBe(14);
    });

    it('should classify > 21 days as "healthy"', () => {
      const fortyDaysAway = '2026-12-05T00:00:00Z';
      const result = getDeadlineUrgency(fortyDaysAway, fixedNow);
      expect(result.urgency).toBe('healthy');
      expect(result.daysRemaining).toBe(40);
    });

    it('should throw an error for unparseable date strings', () => {
      expect(() => getDeadlineUrgency('invalid-date', fixedNow)).toThrow(
        'Invalid deadline date provided'
      );
    });
  });

  describe('Scholar Slug & URL Sanitization', () => {
    it('should strip accented diacritical marks and create clean lowercase slugs', () => {
      const name = 'Dr. Éléonore C. Müller-Kröger';
      const slug = generateSlug(name);
      expect(slug).toBe('dr-eleonore-c-muller-kroger');
    });

    it('should collapse multiple hyphens and trim edges', () => {
      const title = '   --- DARPA: Next-Gen   Living Materials (2026) ---   ';
      const slug = generateSlug(title);
      expect(slug).toBe('darpa-next-gen-living-materials-2026');
    });

    it('should return an empty string for non-string or falsy input', () => {
      expect(generateSlug('')).toBe('');
      expect(generateSlug(null as unknown as string)).toBe('');
    });
  });

  describe('Academic Reading Time Estimator', () => {
    it('should return 1 minute for short abstracts under 200 words', () => {
      const shortAbstract = 'We present Cambium, an intelligent scholarship and grant matching engine.';
      expect(estimateReadingTime(shortAbstract)).toBe(1);
    });

    it('should estimate reading time based on 200 words per minute', () => {
      const words = Array(500).fill('research').join(' ');
      expect(estimateReadingTime(words, 200)).toBe(3); // 500 / 200 = 2.5 -> ceil = 3
    });

    it('should return 0 for empty or whitespace-only text', () => {
      expect(estimateReadingTime('')).toBe(0);
      expect(estimateReadingTime('   ')).toBe(0);
    });
  });
});
