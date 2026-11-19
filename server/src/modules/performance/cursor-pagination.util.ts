import { SelectQueryBuilder } from 'typeorm';

export interface CursorPaginationOptions {
  cursor?: string;
  limit?: number;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
  idField?: string;
}

export interface CursorPaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
}

export interface DecodedCursor {
  sortVal: any;
  idVal: any;
}

export class CursorPaginationUtil {
  /**
   * Encode cursor payload into URL-safe base64 string
   */
  static encodeCursor(sortVal: any, idVal: any): string {
    const raw = JSON.stringify({ s: sortVal, i: idVal });
    return Buffer.from(raw, 'utf-8').toString('base64url');
  }

  /**
   * Decode URL-safe base64 string back into cursor payload
   */
  static decodeCursor(cursor: string): DecodedCursor | null {
    try {
      const json = Buffer.from(cursor, 'base64url').toString('utf-8');
      const parsed = JSON.parse(json);
      if (parsed && 's' in parsed && 'i' in parsed) {
        return { sortVal: parsed.s, idVal: parsed.i };
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Apply deterministic keyset pagination to a TypeORM SelectQueryBuilder
   */
  static async paginate<T extends Record<string, any>>(
    qb: SelectQueryBuilder<T>,
    options: CursorPaginationOptions = {},
  ): Promise<CursorPaginatedResult<T>> {
    const limit = Math.min(Math.max(options.limit || 20, 1), 100);
    const sortField = options.sortField || 'createdAt';
    const sortOrder = options.sortOrder || 'DESC';
    const idField = options.idField || 'id';
    const alias = qb.alias;

    const fullSortField = `${alias}.${sortField}`;
    const fullIdField = `${alias}.${idField}`;

    // Apply primary and tie-breaker sorting
    qb.orderBy(fullSortField, sortOrder);
    qb.addOrderBy(fullIdField, sortOrder);

    // If cursor provided, apply keyset seek filter
    if (options.cursor) {
      const decoded = this.decodeCursor(options.cursor);
      if (decoded) {
        const op = sortOrder === 'DESC' ? '<' : '>';
        qb.andWhere(
          `(${fullSortField} ${op} :cursorSort OR (${fullSortField} = :cursorSort AND ${fullIdField} ${op} :cursorId))`,
          {
            cursorSort: decoded.sortVal,
            cursorId: decoded.idVal,
          },
        );
      }
    }

    // Fetch limit + 1 to determine hasMore without issuing a separate COUNT(*) query
    qb.take(limit + 1);

    const items = await qb.getMany();
    const hasMore = items.length > limit;
    const paginatedItems = hasMore ? items.slice(0, limit) : items;

    let nextCursor: string | null = null;
    if (hasMore && paginatedItems.length > 0) {
      const lastItem = paginatedItems[paginatedItems.length - 1];
      const sortVal = lastItem[sortField];
      const idVal = lastItem[idField];
      nextCursor = this.encodeCursor(sortVal, idVal);
    }

    return {
      items: paginatedItems,
      nextCursor,
      hasMore,
      limit,
    };
  }
}
