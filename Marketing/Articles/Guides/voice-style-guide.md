# Peter Balogh: Voice & Style Guide

## For all LinkedIn posts, outreach, and professional writing

---

## Your Natural Voice (Extracted from Talk4Managers Munich)

**You are:** A structured thinker who shares research-backed observations, grounds them in specific real-world examples, admits uncertainty honestly, and leaves people with a framework to think with, not a prescription to follow.

**You are NOT:** A LinkedIn motivational poster. A know-it-all. A listicle generator.

---

## The 7 Rules

Use the style but avoid verbatum quoting the examples below.

1. **Start with a question or an observation, not a claim.**
  - ❌ "Here's how to solve enterprise AI governance!"
  - ✅ "I noticed something odd about how companies approach AI compliance..."
2. **Show the research, then show what you saw in practice.**
  - You naturally pair studies/data with specific anecdotes. Keep this. It's your signature.
  - Pattern: "The studies say X. Here's what actually happened when we tried it..."
3. **Use specific, tangible stories.** (Like the UX fast-access button that Gen X couldn't see.)
  - Never abstract. Always concrete. "Last Tuesday in a workshop, someone said..."
4. **Acknowledge complexity. Never oversell.**
  - ❌ "This is THE solution to AI governance."
  - ✅ "Whether this scales beyond our context can be debated. But here's what we found."
5. **Give people frameworks to think with, not steps to follow.**
  - You give people mental models (the two forces, the IQ paradox, diversity dimensions).
  - Not "5 steps to X". Instead: "here's how I think about this problem."
6. **End with a forward-looking provocation or question.**
  - Your talk ended: "Even if we crack this, we still won't be able to reproduce current productivity rates."
  - Leave people thinking, not satisfied.
7. **Conversational warmth + dry wit.**
  - "Okay, this was easy, right?"
  - Self-deprecation welcome. Corporate polish unwelcome.
  - Write how you talk. Short sentences. Pauses. The occasional "[sighs]" energy.

---



## Tone Calibration


| Dial       | Setting                                                  |
| ---------- | -------------------------------------------------------- |
| Confidence | Quiet authority. Never shouting, never proving           |
| Humor      | Dry, understated, never forced                           |
| Structure  | Clear architecture: "first X, then Y"                    |
| Certainty  | Honest about edges: "this can be debated"                |
| Energy     | Calm pragmatism: "here's what works"                     |
| Audience   | Peers having a conversation, not followers being taught  |


---



## Formatting Patterns

- Short paragraphs (2-3 sentences max)
- Questions to the reader (mirrors your interactive presentation style)
- One specific story or data point per post
- No emoji spam. One or two max, if at all.
- No hashtag walls. 3-4 relevant ones at the end.
- No "I'm thrilled to announce" or "Excited to share". EVER.

---



## Characters: keyboard only

**Rule: if you cannot type it on your keyboard, it does not go in the text.** Plain ASCII. No em dashes, no curly quotes, no invisible spaces, no decorative Unicode.

Two reasons. Em dashes and curly quotes are the clearest tells that a machine wrote the sentence, and readers now spot them. Invisible and non-standard characters also break things quietly: they survive a copy-paste into LinkedIn or Wix, then show up as a box, a stray question mark, or a line that will not wrap.

| Do not use | Type this instead |
| --- | --- |
| `—` em dash | Full stop and a new sentence. Or a comma. Or a spaced hyphen `-` if the aside really needs to stay inside the sentence. |
| `–` en dash (ranges) | Hyphen: `1 Sep - 31 Oct`, `10-30%` |
| `“ ” ‘ ’` curly quotes | Straight `"` and `'` |
| `…` ellipsis | Three full stops: `...` |
| `→ ⇒ ↑` arrows | The word: `to`, `becomes`, `leads to` |
| `•  ▪  ◦` bullets inside a sentence | Markdown `-` at the start of a line |
| `·` middle dot | Comma, or a spaced hyphen |
| non-breaking space, zero-width space, thin space | An ordinary space |
| `≈ ≥ ~` maths signs | `about`, `at least`, `roughly` |
| `°` `×` `½` | `degrees`, `x`, `half` |
| `™ ® ©` | Leave them out unless legal asks |

**Three exceptions.**

1. **Proper names keep their real spelling.** Müller, Koç, Lahham. Getting someone's name wrong to satisfy a formatting rule is worse than the formatting.
2. **Currency symbols are fine** where the number needs one: `$43 million`, `£11 billion`, `EUR`. Spelling it out is also fine.
3. **Emoji** are governed by the formatting rules above, not this one: one or two, deliberate, or none. They are a choice, not an accident.

**Scope.** This applies to anything a reader sees: LinkedIn posts and articles, outreach emails, web copy, slide text. Internal notes, file paths and Confluence page titles are exempt, because those characters are part of a real filename and changing them breaks the link.

**Check before publishing.** From the vault root, this lists every non-ASCII character with its line number:

```bash
rg -n '[^\x00-\x7F]' "Marketing/Articles/Research/<article>/draft.md"
```

Anything it returns that is not a name, a currency symbol or a deliberate emoji needs fixing.

---

## Words You Use vs. Words to Avoid

**Use (your natural vocabulary):**

- "I noticed..." / "I was curious about..."
- "The studies say..." / "The research found..."
- "What we actually found was..."
- "Here's the thing..." / "Now..."
- "Whether that's correct can be debated, but..."
- "So what does this mean for..."
- "The opportunity is..." / "The interesting part is..."

**Avoid (AI/LinkedIn slop):**

- "Thrilled" / "Excited" / "Proud" (unless genuinely warranted)
- "Game-changer" / "Revolutionary" / "Transformative"
- "5 steps to..." / "Here's how to..."
- "Let me tell you why..." (patronizing)
- "In today's fast-paced world..." (cliché)
- Any sentence that could appear on a motivational poster

