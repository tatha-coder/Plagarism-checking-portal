export interface SentenceSpan {
  index: number;
  text: string;
  cleanText: string;
  startOffset: number;
  endOffset: number;
  tokens: string[];
}

export const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', 'aren', 'as', 'at', 'be', 'because', 'been', 'before', 'being',
  'below', 'between', 'both', 'but', 'by', 'can', 'cannot', 'could', 'did', 'do',
  'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further',
  'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him',
  'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself',
  'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on',
  'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out',
  'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that',
  'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these',
  'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up',
  'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who',
  'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
]);

export function cleanString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(str: string, removeStopwords = false): string[] {
  const cleaned = cleanString(str);
  if (!cleaned) return [];
  const tokens = cleaned.split(' ').filter(Boolean);
  if (removeStopwords) {
    return tokens.filter(t => !STOPWORDS.has(t) && t.length > 1);
  }
  return tokens;
}

export function generateNgrams(tokens: string[], n = 3): string[] {
  if (tokens.length < n) {
    return tokens.length > 0 ? [tokens.join(' ')] : [];
  }
  const ngrams: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.push(tokens.slice(i, i + n).join(' '));
  }
  return ngrams;
}

export function segmentSentences(rawText: string): SentenceSpan[] {
  const spans: SentenceSpan[] = [];
  if (!rawText || !rawText.trim()) return spans;

  // Regex that captures sentence boundary delimiters while tracking position
  const sentenceRegex = /([^\.!\?\n]+[\.!\?]+|[\r\n]{2,}|[^\.!\?\n]+$)/g;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = sentenceRegex.exec(rawText)) !== null) {
    const rawMatch = match[0];
    const trimmed = rawMatch.trim();

    if (trimmed.length > 0) {
      // Find actual start offset within rawMatch if leading whitespace exists
      const leadingSpace = rawMatch.indexOf(trimmed);
      const startOffset = match.index + (leadingSpace >= 0 ? leadingSpace : 0);
      const endOffset = startOffset + trimmed.length;

      const clean = cleanString(trimmed);
      const tokens = tokenize(clean, false);

      if (tokens.length >= 3) {
        spans.push({
          index: index++,
          text: trimmed,
          cleanText: clean,
          startOffset,
          endOffset,
          tokens,
        });
      }
    }
  }

  return spans;
}
