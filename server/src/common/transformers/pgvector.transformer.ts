import { ValueTransformer } from 'typeorm';

/**
 * Value transformer to handle PostgreSQL pgvector columns in TypeORM.
 * Serializes Array<number> -> '[0.123, -0.456, ...]'
 * Deserializes string | number[] -> Array<number>
 */
export const pgvectorTransformer: ValueTransformer = {
  to: (value: number[] | null | undefined): string | null => {
    if (!value || !Array.isArray(value) || value.length === 0) {
      return null;
    }
    return `[${value.join(',')}]`;
  },
  from: (value: string | number[] | null | undefined): number[] | null => {
    if (!value) return null;
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      const cleaned = trimmed.replace(/^\[|\]$/g, '');
      if (!cleaned.trim()) return [];
      return cleaned.split(',').map((item) => parseFloat(item.trim()));
    }
    return null;
  },
};
