/**
 * Cambium Enterprise Research OS — Boolean Query AST Parser & Compiler
 * Parses multi-facet Boolean rules and raw string queries into structured SQL and tsquery expressions.
 */

export interface QueryRule {
  field: 'title' | 'description' | 'funder' | 'category' | 'year';
  operator: 'contains' | 'exact' | 'excludes' | 'greater_than' | 'less_than';
  value: string;
  connector?: 'AND' | 'OR' | 'NOT';
}

export interface CompiledQuery {
  raw: string;
  sqlWhere: string;
  tsquery: string;
  paramCount: number;
}

export type TokenType = 'TERM' | 'AND' | 'OR' | 'NOT' | 'LPAREN' | 'RPAREN';

export interface Token {
  type: TokenType;
  value: string;
}

export interface AstNode {
  type: 'TERM' | 'AND' | 'OR' | 'NOT';
  value?: string;
  left?: AstNode;
  right?: AstNode;
  operand?: AstNode;
}

/**
 * Tokenizes a raw query string into tokens
 */
export function tokenize(query: string): Token[] {
  const tokens: Token[] = [];
  const regex = /"([^"]+)"|(\()|(\))|\b(AND|OR|NOT)\b|([^\s()]+)/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(query)) !== null) {
    if (match[1] !== undefined) {
      tokens.push({ type: 'TERM', value: match[1] });
    } else if (match[2] !== undefined) {
      tokens.push({ type: 'LPAREN', value: '(' });
    } else if (match[3] !== undefined) {
      tokens.push({ type: 'RPAREN', value: ')' });
    } else if (match[4] !== undefined) {
      const upper = match[4].toUpperCase() as 'AND' | 'OR' | 'NOT';
      tokens.push({ type: upper, value: upper });
    } else if (match[5] !== undefined) {
      tokens.push({ type: 'TERM', value: match[5] });
    }
  }

  return tokens;
}

/**
 * Validates syntax of a raw query string
 */
export function validateQuerySyntax(query: string): { isValid: boolean; error?: string } {
  if (!query || !query.trim()) {
    return { isValid: true };
  }

  const tokens = tokenize(query);
  let openParens = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const prev = i > 0 ? tokens[i - 1] : null;

    if (token.type === 'LPAREN') {
      openParens++;
    } else if (token.type === 'RPAREN') {
      openParens--;
      if (openParens < 0) {
        return { isValid: false, error: 'Unexpected closing parenthesis' };
      }
    } else if (token.type === 'AND' || token.type === 'OR') {
      if (i === 0 || i === tokens.length - 1) {
        return { isValid: false, error: 'Query cannot start or end with a boolean operator' };
      }
      if (prev && (prev.type === 'AND' || prev.type === 'OR')) {
        return { isValid: false, error: 'Consecutive binary operators are not allowed' };
      }
    }
  }

  if (openParens > 0) {
    return { isValid: false, error: 'Unbalanced parentheses: missing closing parenthesis' };
  }

  const last = tokens[tokens.length - 1];
  if (last && (last.type === 'AND' || last.type === 'OR' || last.type === 'NOT')) {
    return { isValid: false, error: 'Query cannot end with a boolean operator' };
  }

  return { isValid: true };
}

/**
 * Parses tokens into an Abstract Syntax Tree (AST) using recursive descent
 */
export function parseQuery(query: string): AstNode | null {
  if (!query || !query.trim()) {
    return null;
  }

  const tokens = tokenize(query);
  if (tokens.length === 0) return null;

  let current = 0;

  function peek(): Token | undefined {
    return tokens[current];
  }

  function consume(expectedType?: TokenType): Token {
    const token = tokens[current++];
    if (expectedType && token.type !== expectedType) {
      throw new Error(`Expected token ${expectedType} but found ${token?.type}`);
    }
    return token;
  }

  function parsePrimary(): AstNode {
    const token = peek();
    if (!token) throw new Error('Unexpected end of input');

    if (token.type === 'LPAREN') {
      consume('LPAREN');
      const expr = parseExpression();
      consume('RPAREN');
      return expr;
    }

    if (token.type === 'NOT') {
      consume('NOT');
      const operand = parsePrimary();
      return { type: 'NOT', operand };
    }

    if (token.type === 'TERM') {
      consume('TERM');
      return { type: 'TERM', value: token.value };
    }

    throw new Error(`Unexpected token: ${token.value}`);
  }

  function parseAnd(): AstNode {
    let left = parsePrimary();

    while (peek()?.type === 'AND') {
      consume('AND');
      const right = parsePrimary();
      left = { type: 'AND', left, right };
    }

    return left;
  }

  function parseExpression(): AstNode {
    let left = parseAnd();

    while (peek()?.type === 'OR') {
      consume('OR');
      const right = parseAnd();
      left = { type: 'OR', left, right };
    }

    return left;
  }

  return parseExpression();
}

/**
 * Compiles AST into parameterized SQL WHERE clause
 */
export function compileToParameterizedSql(
  ast: AstNode | null,
  field = 'title'
): { whereClause: string; params: string[] } {
  if (!ast) {
    return { whereClause: '1=1', params: [] };
  }

  const params: string[] = [];

  function compileNode(node: AstNode): string {
    if (node.type === 'TERM') {
      params.push(`%${node.value}%`);
      const paramIndex = `$${params.length}`;
      return `LOWER(${field}) LIKE ${paramIndex}`;
    }

    if (node.type === 'NOT') {
      const inner = compileNode(node.operand!);
      return `(NOT ${inner})`;
    }

    if (node.type === 'AND') {
      const left = compileNode(node.left!);
      const right = compileNode(node.right!);
      return `(${left} AND ${right})`;
    }

    if (node.type === 'OR') {
      const left = compileNode(node.left!);
      const right = compileNode(node.right!);
      return `(${left} OR ${right})`;
    }

    throw new Error(`Unknown node type: ${node.type}`);
  }

  const whereClause = compileNode(ast);
  return { whereClause, params };
}

/**
 * Compiles AST or raw string into PostgreSQL tsquery format
 */
export function compileToTsQuery(input: AstNode | string | null): string {
  if (!input) return '';

  let node: AstNode | null = null;
  if (typeof input === 'string') {
    if (!input.trim()) return '';
    try {
      node = parseQuery(input);
    } catch {
      return input
        .trim()
        .split(/\s+/)
        .map((w) => w.replace(/[^a-zA-Z0-9]/g, ''))
        .filter(Boolean)
        .join(' & ');
    }
  } else {
    node = input;
  }

  if (!node) return '';

  function compile(n: AstNode): string {
    if (n.type === 'TERM') {
      return n.value!.replace(/[^a-zA-Z0-9_-]/g, '');
    }
    if (n.type === 'NOT') {
      return `!${compile(n.operand!)}`;
    }
    if (n.type === 'AND') {
      return `${compile(n.left!)} & ${compile(n.right!)}`;
    }
    if (n.type === 'OR') {
      return `(${compile(n.left!)} | ${compile(n.right!)})`;
    }
    return '';
  }

  return compile(node);
}

/**
 * Validates a list of query rules for syntax and empty values
 */
export function validateRules(rules: QueryRule[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!rules || rules.length === 0) {
    errors.push('Rules array cannot be empty');
    return { valid: false, errors };
  }

  rules.forEach((rule, idx) => {
    if (!rule.value || rule.value.trim() === '') {
      errors.push(`Rule at index ${idx} has empty search value`);
    }
    if (!['title', 'description', 'funder', 'category', 'year'].includes(rule.field)) {
      errors.push(`Invalid field "${rule.field}" at index ${idx}`);
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Compiles Boolean rules into parameterized SQL WHERE clauses
 */
export function compileToSql(rules: QueryRule[]): { sql: string; params: any[] } {
  const validation = validateRules(rules);
  if (!validation.valid) {
    throw new Error(`Query validation failed: ${validation.errors.join(', ')}`);
  }

  const clauses: string[] = [];
  const params: any[] = [];
  let paramIdx = 1;

  rules.forEach((rule, index) => {
    let clause = '';
    const paramName = `$${paramIdx++}`;

    switch (rule.operator) {
      case 'contains':
        clause = `${rule.field} ILIKE ${paramName}`;
        params.push(`%${rule.value}%`);
        break;
      case 'exact':
        clause = `${rule.field} = ${paramName}`;
        params.push(rule.value);
        break;
      case 'excludes':
        clause = `${rule.field} NOT ILIKE ${paramName}`;
        params.push(`%${rule.value}%`);
        break;
      case 'greater_than':
        clause = `${rule.field} > ${paramName}`;
        params.push(rule.value);
        break;
      case 'less_than':
        clause = `${rule.field} < ${paramName}`;
        params.push(rule.value);
        break;
      default:
        throw new Error(`Unsupported operator: ${rule.operator}`);
    }

    if (index > 0 && rule.connector) {
      clauses.push(rule.connector);
    } else if (index > 0) {
      clauses.push('AND');
    }

    clauses.push(clause);
  });

  return { sql: clauses.join(' '), params };
}
