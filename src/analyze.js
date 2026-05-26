import { AI_PATTERNS } from "./patterns";

/**
 * Scan text for AI writing patterns and return a sorted, non-overlapping
 * list of matches with their positions and pattern metadata.
 */
export function analyzeText(text) {
  const matches = [];

  for (const pattern of AI_PATTERNS) {
    const regex = new RegExp(pattern.words.source, pattern.words.flags);
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        pattern,
      });
    }
  }

  // Sort by position, then remove overlaps (keep earliest match).
  matches.sort((a, b) => a.start - b.start);
  const filtered = [];
  let lastEnd = -1;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      filtered.push(m);
      lastEnd = m.end;
    }
  }
  return filtered;
}

/**
 * Count how many times each pattern was matched.
 */
export function getPatternCounts(matches) {
  const counts = {};
  for (const m of matches) {
    counts[m.pattern.id] = (counts[m.pattern.id] || 0) + 1;
  }
  return counts;
}

/**
 * Produce a 0-100 "AI score" based on pattern density and variety.
 * Higher = more likely AI-generated.
 */
export function getAIScore(text, matches) {
  if (!text.trim()) return 0;
  const wordCount = text.split(/\s+/).length;
  const density = matches.length / wordCount;
  const patternTypes = new Set(matches.map((m) => m.pattern.id)).size;
  const raw = Math.min(density * 500 + patternTypes * 8, 100);
  return Math.round(raw);
}
