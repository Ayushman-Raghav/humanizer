/**
 * AI writing pattern definitions.
 *
 * Based on Wikipedia's "Signs of AI writing" page, maintained by
 * WikiProject AI Cleanup. Each pattern includes a regex that matches
 * common AI-generated phrases and a color for visual highlighting.
 *
 * Reference: https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing
 */

export const AI_PATTERNS = [
  {
    id: "significance",
    label: "Inflated significance",
    description: "Puffs up importance with claims about how things represent or contribute to broader topics.",
    color: "#e74c3c",
    words: /\b(stands as|serves as|is a testament|a reminder|vital role|significant role|crucial role|pivotal|key moment|underscores|highlights its|reflects broader|symbolizing|enduring|lasting|setting the stage|marking a shift|key turning point|evolving landscape|focal point|indelible mark|deeply rooted)\b/gi,
  },
  {
    id: "promo",
    label: "Promotional language",
    description: "Travel-brochure tone. Neutral writing doesn't need to sell you on a town or a temple.",
    color: "#e67e22",
    words: /\b(boasts a|vibrant|rich cultural|profound|enhancing|showcasing|exemplifies|commitment to|natural beauty|nestled|in the heart of|groundbreaking|renowned|breathtaking|must-visit|stunning|world-class|cutting-edge|game-changing|best-in-class)\b/gi,
  },
  {
    id: "ai_vocab",
    label: "AI vocabulary",
    description: "Words that appear far more frequently in post-2023 text. They often co-occur.",
    color: "#9b59b6",
    words: /\b(additionally|delve|emphasizing|fostering|garner|interplay|intricate|intricacies|tapestry|testament|underscore|underscores|landscape|showcase|showcases|crucial|pivotal|enhance|enhanced|valuable|align with|aligns with)\b/gi,
  },
  {
    id: "ing_phrases",
    label: "Superficial -ing analyses",
    description: "Participial phrases tacked onto sentences to add fake analytical depth.",
    color: "#3498db",
    words: /\b(highlighting|underscoring|emphasizing|ensuring|reflecting|symbolizing|contributing to|cultivating|fostering|encompassing|showcasing|demonstrating|illustrating|representing|signifying)\b/gi,
  },
  {
    id: "copula",
    label: "Copula avoidance",
    description: "Elaborate substitutes for simple \"is\", \"are\", or \"has\".",
    color: "#1abc9c",
    words: /\b(serves as|stands as|marks a|represents a|boasts|features a|offers a|functions as)\b/gi,
  },
  {
    id: "chatbot",
    label: "Chatbot artifacts",
    description: "Conversational filler from chatbot interactions that gets left in the text.",
    color: "#e91e63",
    words: /\b(I hope this helps|Of course!|Certainly!|You're absolutely right|Would you like|let me know|here is a|Great question|That's an excellent|Let's dive in|let's explore|let's break this down|here's what you need to know|without further ado)\b/gi,
  },
  {
    id: "hedging",
    label: "Excessive hedging",
    description: "Over-qualifying statements until they say almost nothing.",
    color: "#795548",
    words: /\b(could potentially|it could be argued|might possibly|it is important to note|due to the fact that|in order to|at this point in time|has the ability to|in the event that|it should be noted)\b/gi,
  },
  {
    id: "filler",
    label: "Filler & tropes",
    description: "Persuasive authority tropes and generic positive conclusions.",
    color: "#607d8b",
    words: /\b(the real question is|at its core|in reality|what really matters|fundamentally|the deeper issue|the heart of the matter|it's not just|it's about|the future looks bright|exciting times)\b/gi,
  },
];

export const SAMPLE_TEXT = `Great question! Here is an essay on this topic. I hope this helps!

AI-assisted coding serves as an enduring testament to the transformative potential of large language models, marking a pivotal moment in the evolution of software development. In today's rapidly evolving technological landscape, these groundbreaking tools—nestled at the intersection of research and practice—are reshaping how engineers ideate, iterate, and deliver, underscoring their vital role in modern workflows.

At its core, the value proposition is clear: streamlining processes, enhancing collaboration, and fostering alignment. It's not just about autocomplete; it's about unlocking creativity at scale, ensuring that organizations can remain agile while delivering seamless, intuitive, and powerful experiences to users.

While specific details are limited based on available information, it could potentially be argued that these tools might have some positive effect. Despite challenges typical of emerging technologies, the ecosystem continues to thrive. In order to fully realize this potential, teams must align with best practices.

In conclusion, the future looks bright. Exciting times lie ahead as we continue this journey toward excellence. Let me know if you'd like me to expand on any section!`;
