import { SimilarityMatch, HighlightSegment } from '@/types';

export function generateHighlightSegments(
  fullText: string,
  matches: SimilarityMatch[]
): HighlightSegment[] {
  if (!fullText) return [];
  if (!matches || matches.length === 0) {
    return [{
      start: 0,
      end: fullText.length,
      text: fullText,
      isHighlighted: false,
    }];
  }

  // Sort matches by startOffset ascending
  const sortedMatches = [...matches].sort((a, b) => a.start_offset - b.start_offset);

  // Merge overlapping or nested match regions
  const mergedRegions: {
    start: number;
    end: number;
    match: SimilarityMatch;
  }[] = [];

  for (const match of sortedMatches) {
    const start = Math.max(0, Math.min(match.start_offset, fullText.length));
    const end = Math.max(start, Math.min(match.end_offset, fullText.length));

    if (start === end) continue;

    if (mergedRegions.length === 0) {
      mergedRegions.push({ start, end, match });
      continue;
    }

    const last = mergedRegions[mergedRegions.length - 1];
    if (start < last.end) {
      // Overlap: expand last end if current extends further
      if (end > last.end) {
        last.end = end;
      }
      // If current match has higher similarity, update match reference
      if (match.similarity_percentage > last.match.similarity_percentage) {
        last.match = match;
      }
    } else {
      mergedRegions.push({ start, end, match });
    }
  }

  const segments: HighlightSegment[] = [];
  let currentIdx = 0;

  for (const region of mergedRegions) {
    // Non-highlighted gap before this region
    if (region.start > currentIdx) {
      segments.push({
        start: currentIdx,
        end: region.start,
        text: fullText.substring(currentIdx, region.start),
        isHighlighted: false,
      });
    }

    // Highlighted segment
    segments.push({
      start: region.start,
      end: region.end,
      text: fullText.substring(region.start, region.end),
      isHighlighted: true,
      matchId: region.match.id,
      sourceTitle: region.match.source_title,
      sourceType: region.match.source_type,
      similarity: region.match.similarity_percentage,
    });

    currentIdx = region.end;
  }

  // Remaining unhighlighted tail
  if (currentIdx < fullText.length) {
    segments.push({
      start: currentIdx,
      end: fullText.length,
      text: fullText.substring(currentIdx),
      isHighlighted: false,
    });
  }

  return segments;
}
