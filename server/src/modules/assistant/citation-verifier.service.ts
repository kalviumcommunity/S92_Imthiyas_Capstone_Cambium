import { Injectable } from '@nestjs/common';

export interface AuthorizedEvidenceSource {
  sourceId: string;
  title: string;
  funder?: string;
  provenance?: string;
  url?: string;
  section?: string;
  page?: number;
  excerpt?: string;
  rrfScore?: number;
  sourceType: 'opportunity' | 'document_chunk' | 'user_snippet';
}

export interface VerifiedCitation {
  sourceId: string;
  title: string;
  funder: string;
  sourceType: 'opportunity' | 'document_chunk' | 'user_snippet';
  relevance: string;
  section?: string;
  page?: number;
  verified: true;
}

export interface CitationVerificationResult {
  cleanedText: string;
  verifiedCitations: VerifiedCitation[];
  referencedSourceIds: string[];
  unverifiedClaimsRemoved: number;
}

const SRC_TAG_REGEX = /\[src:([a-zA-Z0-9_.:-]+)\]/g;
const DOI_REGEX = /\b10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+\b/g;

@Injectable()
export class CitationVerifierService {
  /**
   * Verifies every cited [src:<id>] marker and DOI reference strictly against the
   * authorized evidence allowlist retrieved during this request turn.
   * Unverified markers and hallucinated DOIs are stripped/redacted deterministically.
   */
  verifyCitations(
    replyText: string,
    authorizedSources: AuthorizedEvidenceSource[],
  ): CitationVerificationResult {
    const sourceMap = new Map<string, AuthorizedEvidenceSource>();
    for (const src of authorizedSources) {
      if (src.sourceId) {
        sourceMap.set(src.sourceId, src);
      }
    }

    const corpusText = authorizedSources
      .map((s) => `${s.title || ''} ${s.url || ''} ${s.excerpt || ''}`.toLowerCase())
      .join('\n');

    let unverifiedClaimsRemoved = 0;
    const referencedSet = new Set<string>();

    let cleanedText = (replyText || '').replace(SRC_TAG_REGEX, (fullMatch, id: string) => {
      if (sourceMap.has(id)) {
        referencedSet.add(id);
        return fullMatch;
      }
      unverifiedClaimsRemoved += 1;
      return '[unverified citation removed]';
    });

    cleanedText = cleanedText.replace(DOI_REGEX, (doiMatch) => {
      if (corpusText.includes(doiMatch.toLowerCase())) {
        return doiMatch;
      }
      unverifiedClaimsRemoved += 1;
      return '[unverified DOI removed]';
    });

    const selectedSources: AuthorizedEvidenceSource[] = [];
    if (referencedSet.size > 0) {
      for (const id of referencedSet) {
        const matched = sourceMap.get(id);
        if (matched) selectedSources.push(matched);
      }
    } else {
      for (const src of authorizedSources) {
        selectedSources.push(src);
      }
    }

    const verifiedCitations: VerifiedCitation[] = selectedSources.map((src) => ({
      sourceId: src.sourceId,
      title: src.title,
      funder: src.funder || src.provenance || src.sourceType,
      sourceType: src.sourceType,
      relevance:
        typeof src.rrfScore === 'number'
          ? `RRF Score: ${src.rrfScore.toFixed(4)}`
          : src.sourceType === 'user_snippet'
            ? 'Attached Excerpt'
            : 'Authorized Source Match',
      ...(src.section ? { section: src.section } : {}),
      ...(typeof src.page === 'number' ? { page: src.page } : {}),
      verified: true,
    }));

    return {
      cleanedText,
      verifiedCitations,
      referencedSourceIds: Array.from(referencedSet),
      unverifiedClaimsRemoved,
    };
  }
}
