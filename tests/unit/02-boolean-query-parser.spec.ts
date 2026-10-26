import {
  tokenize,
  validateQuerySyntax,
  parseQuery,
  compileToParameterizedSql,
  compileToTsQuery,
} from '../../client/lib/query-parser';

describe('Suite 02: Boolean AST Query Parser & SQL / Full-Text Compiler', () => {
  describe('Lexer & Tokenizer', () => {
    it('should tokenize simple search terms and boolean operators', () => {
      const tokens = tokenize('cancer AND CRISPR');
      expect(tokens).toEqual([
        { type: 'TERM', value: 'cancer' },
        { type: 'AND', value: 'AND' },
        { type: 'TERM', value: 'CRISPR' },
      ]);
    });

    it('should support quoted exact phrases', () => {
      const tokens = tokenize('"quantum computing" OR "gene editing"');
      expect(tokens).toEqual([
        { type: 'TERM', value: 'quantum computing' },
        { type: 'OR', value: 'OR' },
        { type: 'TERM', value: 'gene editing' },
      ]);
    });

    it('should tokenize parentheses correctly', () => {
      const tokens = tokenize('(genomics OR proteomics) AND NOT bacteria');
      expect(tokens).toEqual([
        { type: 'LPAREN', value: '(' },
        { type: 'TERM', value: 'genomics' },
        { type: 'OR', value: 'OR' },
        { type: 'TERM', value: 'proteomics' },
        { type: 'RPAREN', value: ')' },
        { type: 'AND', value: 'AND' },
        { type: 'NOT', value: 'NOT' },
        { type: 'TERM', value: 'bacteria' },
      ]);
    });
  });

  describe('Syntax Validator', () => {
    it('should pass valid boolean queries', () => {
      expect(validateQuerySyntax('quantum AND microfluidics').isValid).toBe(true);
      expect(validateQuerySyntax('(AI OR "Machine Learning") AND healthcare').isValid).toBe(true);
      expect(validateQuerySyntax('biomarker').isValid).toBe(true);
      expect(validateQuerySyntax('   ').isValid).toBe(true);
    });

    it('should detect unbalanced parentheses', () => {
      const res1 = validateQuerySyntax('(cancer AND CRISPR');
      expect(res1.isValid).toBe(false);
      expect(res1.error).toContain('Unbalanced parentheses');

      const res2 = validateQuerySyntax('cancer AND CRISPR)');
      expect(res2.isValid).toBe(false);
      expect(res2.error).toContain('Unexpected closing parenthesis');
    });

    it('should reject trailing or consecutive boolean operators', () => {
      const res1 = validateQuerySyntax('cancer AND');
      expect(res1.isValid).toBe(false);
      expect(res1.error).toContain('Query cannot start or end with a boolean operator');

      const res2 = validateQuerySyntax('cancer AND OR CRISPR');
      expect(res2.isValid).toBe(false);
      expect(res2.error).toContain('Consecutive binary operators are not allowed');
    });
  });

  describe('AST Parser & SQL Compiler', () => {
    it('should parse simple binary expression and compile to parameterized SQL', () => {
      const ast = parseQuery('crispr AND oncology');
      expect(ast).not.toBeNull();

      const { whereClause, params } = compileToParameterizedSql(ast, 'title');
      expect(whereClause).toBe('(LOWER(title) LIKE $1 AND LOWER(title) LIKE $2)');
      expect(params).toEqual(['%crispr%', '%oncology%']);
    });

    it('should compile complex nested query with NOT to parameterized SQL', () => {
      const ast = parseQuery('(neural OR quantum) AND NOT classical');
      expect(ast).not.toBeNull();

      const { whereClause, params } = compileToParameterizedSql(ast, 'abstract');
      expect(whereClause).toBe('((LOWER(abstract) LIKE $1 OR LOWER(abstract) LIKE $2) AND (NOT LOWER(abstract) LIKE $3))');
      expect(params).toEqual(['%neural%', '%quantum%', '%classical%']);
    });

    it('should compile to PostgreSQL tsquery string format', () => {
      const ast = parseQuery('(crispr OR genomics) AND NOT murine');
      const tsQuery = compileToTsQuery(ast);
      expect(tsQuery).toBe('(crispr | genomics) & !murine');
    });

    it('should return empty clauses for empty queries', () => {
      const ast = parseQuery('');
      expect(ast).toBeNull();

      const sql = compileToParameterizedSql(ast);
      expect(sql.whereClause).toBe('1=1');
      expect(sql.params).toEqual([]);

      const tsQuery = compileToTsQuery(ast);
      expect(tsQuery).toBe('');
    });
  });
});
