import { tokenize, generateNgrams } from './preprocessor';

export function calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 1.0;
  if (setA.size === 0 || setB.size === 0) return 0.0;

  let intersection = 0;
  setA.forEach(item => {
    if (setB.has(item)) {
      intersection++;
    }
  });

  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function calculateNgramSimilarity(textA: string, textB: string, n = 3): number {
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);

  if (tokensA.length === 0 || tokensB.length === 0) return 0.0;

  const ngramsA = new Set(generateNgrams(tokensA, n));
  const ngramsB = new Set(generateNgrams(tokensB, n));

  return calculateJaccardSimilarity(ngramsA, ngramsB);
}

export function computeTermFrequencies(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  const total = tokens.length;
  if (total === 0) return tf;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    tf.set(token, (tf.get(token) || 0) + 1);
  }

  tf.forEach((count, key) => {
    tf.set(key, count / total);
  });

  return tf;
}

export function calculateCosineSimilarity(textA: string, textB: string): number {
  const tokensA = tokenize(textA, true);
  const tokensB = tokenize(textB, true);

  if (tokensA.length === 0 || tokensB.length === 0) return 0.0;

  const tfA = computeTermFrequencies(tokensA);
  const tfB = computeTermFrequencies(tokensB);

  const allWords = new Set<string>();
  tfA.forEach((_, key) => allWords.add(key));
  tfB.forEach((_, key) => allWords.add(key));

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  allWords.forEach(word => {
    const valA = tfA.get(word) || 0;
    const valB = tfB.get(word) || 0;

    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  });

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

export function calculateFuzzySimilarity(s1: string, s2: string): number {
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1.0;
  const dist = levenshteinDistance(s1, s2);
  return Math.max(0, 1 - dist / maxLen);
}
