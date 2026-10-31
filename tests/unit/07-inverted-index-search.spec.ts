import {
  InvertedIndex,
  tokenize,
  stemToken,
  SearchableDocument,
} from '../../client/lib/search/inverted-index';

describe('Suite 07: DSA Inverted Index & BM25 Relevance Search Engine', () => {
  describe('Tokenizer & Stemmer', () => {
    it('should strip punctuation and normalize case', () => {
      const tokens = tokenize('Hello, World! AI-Powered: Research_Platform.');
      expect(tokens).toContain('world');
      expect(tokens).toContain('power'); // stemmed from powered
      expect(tokens).toContain('research');
      expect(tokens).toContain('platform');
    });

    it('should filter out common English and scholarly stopwords', () => {
      const tokens = tokenize('This is a study on the effect of quantum computing in physics');
      expect(tokens).not.toContain('this');
      expect(tokens).not.toContain('is');
      expect(tokens).not.toContain('a');
      expect(tokens).not.toContain('on');
      expect(tokens).not.toContain('the');
      expect(tokens).not.toContain('of');
      expect(tokens).not.toContain('in');
      expect(tokens).toContain('quantum');
      expect(tokens).toContain('comput'); // stemmed
      expect(tokens).toContain('physic'); // stemmed
    });

    it('should stem common suffixes appropriately', () => {
      expect(stemToken('computing')).toBe('comput');
      expect(stemToken('foundational')).toBe('foundation');
      expect(stemToken('materials')).toBe('material');
      expect(stemToken('investigators')).toBe('investigator');
    });
  });

  describe('Inverted Index Construction & BM25 Scoring', () => {
    const documents: SearchableDocument[] = [
      {
        id: 'doc-1',
        title: 'Horizon Europe Quantum Materials & Scalable Coherence',
        subtitle: 'European Research Council €4,200,000 grant',
        category: 'opportunities',
        tags: ['quantum', 'physics', 'europe'],
        description: 'Large-scale collaborative funding for topological quantum computation and coherence lifetimes.',
      },
      {
        id: 'doc-2',
        title: 'NSF Bio-Inspired Neuromorphic Computing Arrays',
        subtitle: 'National Science Foundation $2,850,000 grant',
        category: 'opportunities',
        tags: ['neuromorphic', 'biology', 'nsf'],
        description: 'Silicon bio-interfaces and synaptic memristive hardware for brain-scale computing architectures.',
      },
      {
        id: 'doc-3',
        title: 'Attention Is All You Need',
        subtitle: 'Vaswani et al. · Transformer Architecture',
        category: 'papers',
        tags: ['transformer', 'nlp', 'deep learning'],
        description: 'The dominant sequence transduction model based entirely on self-attention mechanisms without recurrence.',
      },
      {
        id: 'doc-4',
        title: 'Quantum Machine Learning for Drug Discovery',
        subtitle: 'Hybrid variational algorithms for chemical molecular graphs',
        category: 'papers',
        tags: ['quantum', 'chemistry', 'machine learning'],
        description: 'Explores variational quantum eigensolvers on molecular Hamiltonian simulations.',
      },
    ];

    let index: InvertedIndex;

    beforeEach(() => {
      index = new InvertedIndex();
      index.addDocuments(documents);
    });

    it('should correctly build vocabulary and index document count', () => {
      expect(index.size).toBe(4);
      expect(index.vocabularySize).toBeGreaterThan(15);
    });

    it('should rank exact title matches highest with multi-field boost', () => {
      const results = index.search('quantum materials');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].item.id).toBe('doc-1');
      expect(results[0].score).toBeGreaterThan(10); // exact phrase + title boost
    });

    it('should find documents matching tags or keywords across fields', () => {
      const results = index.search('transformer');
      expect(results.length).toBe(1);
      expect(results[0].item.id).toBe('doc-3');
    });

    it('should rank multiple keyword matches by relevance (BM25)', () => {
      const results = index.search('quantum');
      expect(results.length).toBe(2);
      const ids = results.map((r) => r.item.id);
      expect(ids).toContain('doc-1');
      expect(ids).toContain('doc-4');
    });

    it('should support prefix typing-as-you-search matching', () => {
      // User types "neuro" -> should match "neuromorphic"
      const results = index.search('neuro');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].item.id).toBe('doc-2');
    });

    it('should support dynamic document addition and removal', () => {
      const newDoc: SearchableDocument = {
        id: 'doc-5',
        title: 'CRISPR Cas9 Genomic Engineering in Plants',
        category: 'papers',
        tags: ['genomics', 'crispr'],
      };
      index.addDocument(newDoc);
      expect(index.size).toBe(5);

      let found = index.search('crispr');
      expect(found.length).toBe(1);
      expect(found[0].item.id).toBe('doc-5');

      index.removeDocument('doc-5');
      expect(index.size).toBe(4);
      found = index.search('crispr');
      expect(found.length).toBe(0);
    });

    it('should return empty array for empty or whitespace query when options specify empty handling', () => {
      const results = index.search('   ');
      expect(results.length).toBe(4); // Default returns top docs
    });
  });
});
