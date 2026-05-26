# Humanizer

Detect AI writing patterns and rewrite text to sound like a person actually wrote it.

![AI Score: 87 → 12](https://img.shields.io/badge/AI%20Score-87%20→%2012-22c55e)
![Patterns](https://img.shields.io/badge/patterns-29-6c5ce7)
![License](https://img.shields.io/badge/license-MIT-blue)
![Live Demo](https://img.shields.io/badge/demo-live-22c55e)

**[? Try it live ?](https://humanizer-tool-lilac.vercel.app)**

## What it does

Humanizer does two things:

1. **Detects** — scans text for 29 categories of AI writing patterns and highlights them inline. Gives you a 0-100 "AI score."
2. **Rewrites** — sends the text to Claude, which rewrites it following the same 29 rules. Not just pattern removal, but adding voice, varied rhythm, and actual opinions.

The pattern catalog comes from Wikipedia's [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) page, maintained by editors who clean AI-generated text off the encyclopedia.

## The patterns

| Category | Examples |
|----------|----------|
| Inflated significance | "serves as a testament", "pivotal moment", "evolving landscape" |
| Promotional language | "groundbreaking", "nestled", "breathtaking", "vibrant" |
| AI vocabulary | "delve", "tapestry", "interplay", "underscore", "foster" |
| Superficial -ing phrases | "highlighting", "showcasing", "reflecting", "ensuring" |
| Copula avoidance | "serves as" instead of "is", "stands as", "functions as" |
| Chatbot artifacts | "I hope this helps!", "Great question!", "Let's dive in" |
| Excessive hedging | "could potentially", "it could be argued", "in order to" |
| Filler & tropes | "at its core", "the future looks bright", "exciting times" |

## Quick start

```bash
git clone https://github.com/Ayushman-Raghav/humanizer.git
cd humanizer
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Rewriting (optional)

The detection works without any setup. To use the "Humanize" rewrite feature, you need an [Anthropic API key](https://console.anthropic.com/). Enter it in the browser when prompted. Your key stays client-side and is never stored.

## Project structure

```
src/
  patterns.js   — Pattern definitions (regexes, colors, labels)
  analyze.js    — Text analysis: matching, scoring, counting
  api.js        — Anthropic API integration for rewriting
  App.jsx       — UI components and layout
  main.jsx      — React entry point
```

## Customizing patterns

Edit `src/patterns.js` to add, remove, or tweak detection rules. Each pattern has:

- `id` — unique identifier
- `label` — display name
- `description` — what it detects and why it matters
- `color` — hex color for highlighting
- `words` — regex matching the pattern

## How the score works

The AI score (0-100) is based on two factors: how dense the pattern matches are relative to word count, and how many different pattern categories were triggered. A text that hits 6 out of 8 categories with high density scores close to 100. A text with one or two stray matches scores low.

It's a heuristic, not a classifier. Some human-written text will score above zero, and some AI text will score low. The highlighted patterns are more useful than the number.

## Built with

- [React](https://react.dev) + [Vite](https://vite.dev)
- [Anthropic API](https://docs.anthropic.com) (Claude Sonnet for rewriting)
- Pattern catalog from [Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)

## License

MIT
