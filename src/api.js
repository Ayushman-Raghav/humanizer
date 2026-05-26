const SYSTEM_PROMPT = `You are a writing editor that removes AI-generated patterns from text. Rewrite the given text to sound natural and human-written. Follow these rules strictly:
- Remove significance inflation (testament, pivotal, evolving landscape, etc.)
- Remove promotional language (groundbreaking, nestled, vibrant, etc.)
- Remove chatbot artifacts (I hope this helps, Great question, Let me know, etc.)
- Replace copula avoidance (serves as, stands as) with simple is/are/has
- Remove superficial -ing phrases (highlighting, underscoring, showcasing)
- Cut filler phrases (in order to, due to the fact that, at its core)
- Remove excessive hedging (could potentially, it could be argued)
- Remove negative parallelisms (it's not just X, it's Y)
- Remove rule-of-three patterns
- Remove em dash overuse, replace with commas or periods
- Remove generic positive conclusions
- Use straight quotes, not curly
- Add personality: vary sentence length, have opinions, use first person where it fits, acknowledge complexity
- Keep the core meaning intact
Return ONLY the rewritten text, nothing else. No preamble, no explanation.`;

/**
 * Send text to the Anthropic API for humanization.
 *
 * @param {string} text - The AI-sounding text to rewrite.
 * @param {string} apiKey - Anthropic API key.
 * @param {object} [options]
 * @param {string} [options.model] - Model to use (default: claude-sonnet-4-20250514).
 * @returns {Promise<string>} The rewritten text.
 */
export async function humanize(text, apiKey, options = {}) {
  const model = options.model || "claude-sonnet-4-20250514";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `Humanize this text:\n\n${text}` }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .filter(Boolean)
    .join("\n");
}
