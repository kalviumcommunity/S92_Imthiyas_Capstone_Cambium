/**
 * Cambium Enterprise Formatters & Scholarship Utilities
 * Standardized utility functions for currency, deadlines, dates, and scholar slugs.
 */

export type DeadlineUrgency = 'expired' | 'critical' | 'urgent' | 'approaching' | 'healthy';

/**
 * Formats grant funding amounts with currency code and locale options.
 * Handles millions/billions shorthand (e.g. $2.5M, €500K) or exact numbers.
 */
export function formatGrantAmount(
  amount: number,
  currency = 'USD',
  compact = false
): string {
  if (isNaN(amount) || amount < 0) {
    return 'Undisclosed';
  }

  if (compact) {
    if (amount >= 1_000_000_000) {
      return `${currency === 'USD' ? '$' : currency + ' '}${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
    }
    if (amount >= 1_000_000) {
      return `${currency === 'USD' ? '$' : currency + ' '}${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    }
    if (amount >= 1_000) {
      return `${currency === 'USD' ? '$' : currency + ' '}${(amount / 1_000).toFixed(0)}K`;
    }
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Evaluates deadline urgency relative to a reference timestamp (default: now).
 * Returns:
 * - 'expired': <= 0 days remaining
 * - 'critical': 1-3 days remaining
 * - 'urgent': 4-7 days remaining
 * - 'approaching': 8-21 days remaining
 * - 'healthy': > 21 days remaining
 */
export function getDeadlineUrgency(
  deadlineDate: string | Date,
  referenceDate: string | Date = new Date()
): { urgency: DeadlineUrgency; daysRemaining: number } {
  const target = new Date(deadlineDate).getTime();
  const ref = new Date(referenceDate).getTime();

  if (isNaN(target)) {
    throw new Error('Invalid deadline date provided');
  }

  const diffMs = target - ref;
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysRemaining <= 0) {
    return { urgency: 'expired', daysRemaining };
  }
  if (daysRemaining <= 3) {
    return { urgency: 'critical', daysRemaining };
  }
  if (daysRemaining <= 7) {
    return { urgency: 'urgent', daysRemaining };
  }
  if (daysRemaining <= 21) {
    return { urgency: 'approaching', daysRemaining };
  }
  return { urgency: 'healthy', daysRemaining };
}

/**
 * Generates an SEO-safe slug for scholar profiles or opportunity titles.
 * Converts to lowercase, strips diacritics, replaces non-alphanumeric chars with hyphens,
 * collapses multiple hyphens, and trims edges.
 */
export function generateSlug(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .normalize('NFD') // decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // remove diacritical marks
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumerics with '-'
    .replace(/^-+|-+$/g, ''); // strip leading/trailing hyphens
}

/**
 * Computes estimated reading time in minutes for research papers or abstracts.
 * Based on average academic reading speed of 200 words per minute.
 */
export function estimateReadingTime(text: string, wordsPerMinute = 200): number {
  if (!text || !text.trim()) return 0;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
