/**
 * Cambium Enterprise Research OS — Academic Citation Formatting Engine
 * Generates standardized, verified BibTeX, APA 7th Edition, and IEEE citations
 * for research opportunities, preprints, and academic grants.
 */

export interface CitationMetadata {
  id?: string;
  title: string;
  authors?: string[];
  year?: number;
  venue?: string;
  doi?: string;
  url?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  entryType?: 'article' | 'book' | 'inproceedings' | 'grant' | 'misc';
  funder?: string;
  category?: string;
  institution?: string;
}

export type AcademicRecord = CitationMetadata;

/**
 * Escapes special characters for LaTeX / BibTeX compatibility
 */
export function escapeLatex(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([&%$#_{}])/g, '\\$1')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

export const escapeBibTeX = escapeLatex;

/**
 * Generates a clean BibTeX citation key: e.g. "Imthiyas2026Living"
 */
function buildCitationKey(meta: CitationMetadata): string {
  let authorPart = 'Anonymous';
  if (meta.authors && meta.authors.length > 0) {
    const lastName = meta.authors[0].trim().split(/\s+/).pop() || 'Scholar';
    authorPart = lastName.replace(/[^a-zA-Z0-9]/g, '');
  } else if (meta.funder) {
    authorPart = meta.funder.replace(/[^a-zA-Z0-9]/g, '');
  }

  const yearPart = meta.year || new Date().getFullYear();
  const titlePart = (meta.title || 'Untitled')
    .split(/\s+/)
    .find((w) => w.length > 3)
    ?.replace(/[^a-zA-Z0-9]/g, '') || 'Doc';

  return `${authorPart}${yearPart}${titlePart}`;
}

/**
 * Generates BibTeX entry
 */
export function generateBibtex(meta: CitationMetadata): string {
  const type = meta.entryType === 'article' ? 'article' : 'misc';
  const key = buildCitationKey(meta);

  const lines: string[] = [`@${type}{${key},`];

  const authors =
    meta.authors && meta.authors.length > 0
      ? meta.authors.join(' and ')
      : meta.funder
      ? `{${meta.funder}}`
      : 'Anonymous';

  lines.push(`  author = {${authors}},`);
  lines.push(`  title = {${meta.title}},`);

  if (meta.venue) {
    lines.push(`  journal = {${meta.venue}},`);
  }

  lines.push(`  year = {${meta.year || new Date().getFullYear()}},`);

  if (meta.volume) lines.push(`  volume = {${meta.volume}},`);
  if (meta.issue) lines.push(`  number = {${meta.issue}},`);
  if (meta.pages) lines.push(`  pages = {${meta.pages}},`);
  if (meta.doi) lines.push(`  doi = {${meta.doi}},`);
  if (meta.url) lines.push(`  url = {${meta.url}},`);

  if (!meta.venue && !meta.doi) {
    lines.push(`  howpublished = {Cambium Research Platform},`);
  }

  lines.push('}');
  return lines.join('\n');
}

export const generateBibTeX = generateBibtex;

/**
 * Formats an author name for APA: "Shaik Mohamed Imthiyas" -> "Imthiyas, S. M."
 */
function formatApaAuthor(author: string): string {
  const parts = author.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const last = parts.pop()!;
  const initials = parts.map((p) => `${p[0].toUpperCase()}.`).join(' ');
  return `${last}, ${initials}`;
}

/**
 * Formats an author name for IEEE: "Shaik Mohamed Imthiyas" -> "S. M. Imthiyas"
 */
function formatIeeeAuthor(author: string): string {
  const parts = author.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const last = parts.pop()!;
  const initials = parts.map((p) => `${p[0].toUpperCase()}.`).join(' ');
  return `${initials} ${last}`;
}

/**
 * Generates APA 7th Edition citation
 */
export function generateApa7(meta: CitationMetadata): string {
  let authorsStr = 'Anonymous';
  if (meta.authors && meta.authors.length > 0) {
    const formatted = meta.authors.map(formatApaAuthor);
    if (formatted.length === 1) {
      authorsStr = formatted[0];
    } else if (formatted.length === 2) {
      authorsStr = `${formatted[0]}, & ${formatted[1]}`;
    } else {
      authorsStr = `${formatted.slice(0, -1).join(', ')}, & ${formatted[formatted.length - 1]}`;
    }
  } else if (meta.funder) {
    authorsStr = meta.funder;
  }

  const year = meta.year || new Date().getFullYear();
  const cleanTitle = meta.title.trim().replace(/\.+$/, '');
  const venuePart = meta.venue ? ` *${meta.venue}*` : ' Cambium Research Platform.';

  let volPages = '';
  if (meta.volume) {
    volPages += `, *${meta.volume}*`;
    if (meta.issue) {
      volPages += `(${meta.issue})`;
    }
  }
  if (meta.pages) {
    volPages += `, ${meta.pages}.`;
  } else if (meta.volume) {
    volPages += '.';
  }

  const urlDoi = meta.url || (meta.doi ? `https://doi.org/${meta.doi}` : '');
  const urlPart = urlDoi ? ` ${urlDoi}` : '';

  return `${authorsStr} (${year}). ${cleanTitle}.${venuePart}${volPages}${urlPart}`;
}

export const generateAPA = generateApa7;

/**
 * Generates IEEE style citation
 */
export function generateIeee(meta: CitationMetadata): string {
  let authorsStr = 'Anonymous';
  if (meta.authors && meta.authors.length > 0) {
    const formatted = meta.authors.map(formatIeeeAuthor);
    if (formatted.length === 1) {
      authorsStr = formatted[0];
    } else if (formatted.length === 2) {
      authorsStr = `${formatted[0]} and ${formatted[1]}`;
    } else {
      authorsStr = `${formatted.slice(0, -1).join(', ')}, and ${formatted[formatted.length - 1]}`;
    }
  } else if (meta.funder) {
    authorsStr = meta.funder;
  }

  const year = meta.year || new Date().getFullYear();
  let citation = `${authorsStr}, "${meta.title},"`;

  if (meta.venue) {
    citation += ` *${meta.venue}*,`;
  }
  if (meta.volume) {
    citation += ` vol. ${meta.volume},`;
  }
  if (meta.issue) {
    citation += ` no. ${meta.issue},`;
  }
  if (meta.pages) {
    citation += ` pp. ${meta.pages},`;
  }

  citation += ` ${year}.`;
  return citation;
}

export const generateIEEE = generateIeee;

/**
 * Universal citation generator dispatcher
 */
export function generateCitation(
  meta: CitationMetadata,
  style: 'bibtex' | 'apa' | 'ieee' = 'bibtex'
): string {
  switch (style) {
    case 'bibtex':
      return generateBibtex(meta);
    case 'apa':
      return generateApa7(meta);
    case 'ieee':
      return generateIeee(meta);
    default:
      return generateBibtex(meta);
  }
}
