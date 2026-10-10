# AI / prompting lessons, part 1: basics, structure, examples, reasoning (research 2026-10-10)

Format: title · URL · what was used. All pages were opened and read (WebFetch / raw GitHub).
No text was copied into the content files; lessons and questions are written in our own words and our own
examples. No Chrome extension or user browser was used.

## Anthropic (primary)

1. Prompt engineering overview · https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview · prerequisites (success criteria + empirical tests + first draft); "not every failing eval is a prompt problem" (latency/cost → model choice).
2. Prompting best practices (Claude) · https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices · be clear and direct, "brilliant new employee" framing, golden rule (colleague test), context/motivation behind instructions, examples (relevant/diverse/structured, 3–5, `<example>` tags), XML tags (consistent names, nesting), role in system prompt, long-context placement (documents on top, query at end), quote grounding, format control (say what to do, XML format indicators, match prompt style), migrating away from prefill (400 error on recent models; structured outputs, direct instructions, XML output, continuation in user turn), overthinking/over-prompting on recent models, adaptive thinking + effort, general vs prescriptive thinking guidance, multishot with thinking, manual CoT only as fallback (writing reasoning in tags may be declined on newest models), self-check instructions and over-verification, sensitivity to the word "think" on some models with thinking off, prompt chaining (self-correction chain), migration notes.
3. Effort · https://platform.claude.com/docs/en/build-with-claude/effort · levels low/medium/high/xhigh/max, effort is soft guidance not a budget, affects all output tokens incl. tool calls, defaults differ by model, max_tokens is the hard cap, changing top-level effort invalidates prompt cache, run effort sweeps on evals.
4. Thinking · https://platform.claude.com/docs/en/build-with-claude/thinking · thinking blocks + signature, summarized vs omitted display (never raw CoT), thinking billed as output tokens and counts toward max_tokens, pass blocks back unmodified in tool loops, interleaved thinking, budget_tokens deprecated/rejected on recent models, prefill rejected on recent models, forced tool use caveats.
5. Steering thinking · https://platform.claude.com/docs/en/build-with-claude/thinking-steering-and-cost · per-effort thinking behavior table, steering frequency of thinking via system prompt / per message, lower effort before prompt steering, cost control (max_tokens hard vs effort soft), stop_reason max_tokens remedies.
6. Structured outputs · https://platform.claude.com/docs/en/build-with-claude/structured-outputs · JSON outputs vs strict tool use, constrained decoding (grammar compiled + cached), supported/unsupported JSON Schema features (no min/max/length, no recursion), refusal and max_tokens can break schema, enum casing caveat, property order, reasoning fields may trigger reasoning_extraction refusal.
7. Refusals and fallback · https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback · "Keep reasoning in thinking blocks": reasoning_extraction category (scratchpad tags, reasoning fields in JSON), ask for a short explanation instead.
8. Define success criteria and build evaluations · https://platform.claude.com/docs/en/test-and-evaluate/develop-tests · specific/measurable/achievable/relevant criteria, multidimensional criteria, eval design principles (task-specific, automate, volume over quality), grading methods.
9. Interactive prompt engineering tutorial (GitHub) · https://github.com/anthropics/prompt-eng-interactive-tutorial (chapters 2–7 read via raw notebooks) · chapter structure; clear and direct; role prompting incl. audience; separating data from instructions with templates; formatting output and "speaking for Claude" (prefill, historical); stop sequences on closing tag; precognition (reasoning must be output to count, order sensitivity); few-shot prompting.
10. Anthropic Academy · https://anthropic.skilljar.com/ and https://anthropic.skilljar.com/claude-with-the-anthropic-api · course catalog; "Building with the Claude API" curriculum (clear/direct, specific, XML, examples, eval workflow, code vs model grading).
11. Best practices for prompt engineering (Claude blog) · https://claude.com/blog/best-practices-for-prompt-engineering · start simple, permit uncertainty, technique-to-problem mapping, over-engineering as a mistake, heavy personas add little, prompt engineering as part of context engineering.
12. The "think" tool (Anthropic engineering) · https://www.anthropic.com/engineering/claude-think-tool · think tool vs extended thinking, when it helps (policy-heavy, sequential tool results), note that extended thinking is now preferred in most cases.
13. Building effective agents (Anthropic engineering) · https://www.anthropic.com/engineering/building-effective-agents · prompt chaining with gates, routing, parallelization (sectioning/voting), evaluator-optimizer; start simple.
14. Reasoning models don't always say what they think (Anthropic research) · https://www.anthropic.com/research/reasoning-models-dont-say-think · CoT faithfulness (hint acknowledged ~25% / ~39%), reward hacking rarely verbalized → CoT is not a reliable audit log.

## Other vendors

15. OpenAI prompt engineering guide · https://developers.openai.com/api/docs/guides/prompt-engineering · developer vs user message priority, Markdown + XML structure, few-shot, reasoning vs GPT models (high-level goals vs explicit steps), structured outputs, static content first for caching, pin snapshots + evals.
16. Google Gemini prompting strategies · https://ai.google.dev/gemini-api/docs/prompting-strategies · constraints, response format, zero vs few-shot, consistent example formatting, positive patterns vs anti-patterns, too many examples → overfitting, prefixes, breaking prompts into chains / parallel + aggregate.
17. Microsoft Foundry prompt engineering techniques · https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/prompt-engineering · prompt components (instructions, primary/supporting content, cues), recency bias and repeating instructions, clear syntax/separators, break task down, CoT only for non-reasoning models, citations as structure, give the model an "out", space efficiency.

## Papers

18. Wei et al., Chain-of-Thought Prompting Elicits Reasoning in LLMs · https://arxiv.org/abs/2201.11903 · few-shot CoT exemplars, gains on GSM8K, benefit grows with scale.
19. Kojima et al., Large Language Models are Zero-Shot Reasoners · https://arxiv.org/abs/2205.11916 · zero-shot CoT ("Let's think step by step"), MultiArith 17.7→78.7, GSM8K 10.4→40.7.
20. Wang et al., Self-Consistency Improves CoT Reasoning · https://arxiv.org/abs/2203.11171 · sample diverse paths + majority vote, +17.9% GSM8K.
21. Yao et al., ReAct · https://arxiv.org/abs/2210.03629 · interleave reasoning traces and actions; reduces hallucination/error propagation vs pure CoT.
22. Sprague et al., To CoT or not to CoT? · https://arxiv.org/abs/2409.12183 · CoT helps mainly math/symbolic tasks; little gain elsewhere; apply selectively.
23. Liu et al., Mind Your Step (by Step) · https://arxiv.org/abs/2410.21333 · tasks where CoT hurts (up to −36.3 points), overthinking analogy.
24. Turpin et al., Language Models Don't Always Say What They Think · https://arxiv.org/abs/2305.04388 · unfaithful CoT under biasing features (answer always (A)).
25. Min et al., Rethinking the Role of Demonstrations · https://arxiv.org/abs/2202.12837 · random labels barely hurt; label space, input distribution and format matter.
26. Zhao et al., Calibrate Before Use · https://arxiv.org/abs/2102.09690 · few-shot instability from format/selection/order; recency and common-token bias; contextual calibration.
27. Lu et al., Fantastically Ordered Prompts · https://arxiv.org/abs/2104.08786 · example order can swing from SOTA to chance; good orders don't transfer between models.
28. Liu et al., What Makes Good In-Context Examples for GPT-3? · https://arxiv.org/abs/2101.06804 · retrieving semantically similar examples beats random selection.
