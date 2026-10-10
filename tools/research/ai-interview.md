# Research log: prompt engineering / LLM application questions (ai)

Collected 2026-10-10. Each line: company · question idea · URL · F/S.
F = page opened and read (LeetCode Discuss posts were read in full through LeetCode's public
GraphQL endpoint `ugcArticleDiscussionArticle(topicId)`, since the HTML returns 403).
S = only the search-engine snippet/summary of that specific page (Glassdoor and 1point3acres return 403).
Tags were used only for NVIDIA, Microsoft, Meta, Google, Amazon; nothing usable was found for
Apple, Intel or Qualcomm (see bottom). Questions are written in our own words in Hebrew.

## Used as `sources` with a company tag

### NVIDIA
- NVIDIA · pros/cons of fine-tuning vs RAG, and how the two complement each other (S) · https://www.glassdoor.it/Colloquio/NVIDIA-Colloquio-E7633-RVW88092230.htm (same review ID on glassdoor.com.br / .com.mx / fr.glassdoor.ca)
- NVIDIA · techniques to adapt a foundation LLM to proprietary domain data, and how they differ in efficacy and implementation (S) · same review

### Amazon
- Amazon · why RAG instead of fine-tuning an LLM (Applied Scientist, Seattle, Sep 2025) (S) · https://www.glassdoor.fr/Entretien/Amazon-Entretien-E6036-RVW100110012.htm
- Amazon · how to evaluate LLMs / LLM evaluation metrics (S) · same review
- Amazon · sources of stochasticity in LLM inference; effect of temperature, top-k, top-p (F) · https://leetcode.com/discuss/post/6871782/amazon-online-1st-round-bengaluru-applie-uiwk/
- Amazon · how LLMs do well with very little task data when prompted (in-context learning) (F) · same post
- Amazon · GenAI round: how much do you trust AI, what do you use it for (F) · https://leetcode.com/discuss/post/8098488/amazon-interview-sde-1-intern-dsa-round-srof2/
- Amazon · GenAI scenario: fix a production issue in one hour with AI tools, without over-relying on AI (F) · https://leetcode.com/discuss/post/8029194/amazon-interview-sde-1-selected-by-anony-qatd/
- Amazon · GenAI-team SDE phone screen covering RAG evaluation (also fine-tuning, embeddings, KV cache) (S) · https://www.1point3acres.com/interview/thread/1103906

### Microsoft
- Microsoft · search API design with hybrid retrieval (BM25 + embeddings); RAG with LLMs; temperature / top-k / top-p; measuring agentic-AI impact and AI tool adoption metrics (F) · https://leetcode.com/discuss/post/7637330/microsoft-l65-interview-experience-by-an-uope/ + https://leetcode.com/discuss/post/7748215/microsoft-senior-interview-experience-ba-wto9/ (same loop, two write-ups)
- Microsoft · senior: RAG application design with requirements changed mid-interview (F) · https://www.hellointerview.com/community/questions/rag-application-design/cmhy2xydo009f08ads2e3ujij

### Meta
- Meta · AI-enabled coding round: gather requirements first, write a precise prompt, verify AI output; AI-written solution passed tests but was exponential (F) · https://leetcode.com/discuss/post/7335102/usa-meta-ai-coding-round-by-mathrules-z3bd/
- Meta · AI-enabled coding: graded on verification, not on prompt engineering; over-reliance is a negative signal (F, built from candidate reports) · https://www.hellointerview.com/blog/meta-ai-enabled-coding

### Google
- Google · AI fluency: how you use AI day to day, do you give it full ownership / how do you restrict its access, step-by-step process for debugging with AI (F) · https://leetcode.com/discuss/post/8439839/google-swe-intern-interview-experience-r-vi40/ + https://leetcode.com/discuss/post/8441953/google-ai-fluency-questionanswer-by-anon-hi2g/
- Google · Gemini Applications HM round: how to evaluate such systems, multi-domain design, prompt enhancement vs fine-tuning under time pressure, what to do with no additional data (F) · https://leetcode.com/discuss/post/7936329/google-hiring-manager-round-gemini-appli-mb5k/

## Used as `sources` without a tag (company named in `problem`)
- Mastercard · RAG pipeline end to end (ingestion, chunking, embeddings, vector DB, context construction, evaluation); MCP host/client/server, tools/resources (F) · https://leetcode.com/discuss/post/8539984/mastercard-ai-engineer-interview-experie-u5ak/
- Avaamo · chunking impact on retrieval; bi-encoder vs cross-encoder; prompting techniques used in real applications; RAG evaluation; semantic caching (F) · https://leetcode.com/discuss/post/6879712/interview-senior-mle-avaamo-bengaluru-by-l9sy/
- EPAM · retrieval metrics (recall, precision, MRR) and generation metrics (faithfulness, grounding); agentic AI with HITL; ReAct (F) · https://leetcode.com/discuss/post/7876633/epam-systems-senior-ai-engineer-intervie-4l0h/
- Tekion · design a platform running long AI agents with tool calls, human approval mid-run, crash safety; eval pipeline for RAG (F) · https://leetcode.com/discuss/post/8542635/tekion-staff-software-engineer-interview-n71r/
- Teradata · RAG over an organization's internal data with access control, reranking, metadata filtering (F) · https://leetcode.com/discuss/post/8559932/teradata-cloud-ai-engineer-interview-exp-ic79/
- Anthropic · ML/prompt engineer loop: manage the context window on long tasks, memory/chat history, keep output consistent without changing the code path, guardrails (F, anonymous write-up) · https://www.aced.io/experiences/anthropic-machine-learning-engineer-interview-27873a

## Seen but NOT used for tags
- Microsoft · hallucinations: what, how to avoid; catastrophic forgetting (Applied Scientist Intern, 2026) (S) · snippet covered several review IDs (RVW104111398 / RVW103506033); could not tie it to one page, so not used.
- Microsoft · recruiter said the SDE-2 AI loop would cover caching to reduce AI costs, LLM observability, AI app design + evaluating it · https://leetcode.com/discuss/post/7494384/microsoft-ai-interview-for-sde-2-by-anon-m7if/ (F) · announced before the interview, not a report of what was asked; used only as inspiration.
- Microsoft · senior MLE onsite: ML fundamentals for search and RAG (S) · https://www.1point3acres.com/interview/thread/1149212 ; Teams AI Platform onsite: RAG pipeline design (S) · https://www.1point3acres.com/interview/thread/1170511 · snippet-only, not needed.
- NVIDIA · Sr Cloud Architect, Aug 2025: prep list "RAG, prompt engineering, fine tuning" (S) · https://www.glassdoor.co.in/Interview/NVIDIA-Interview-E7633-RVW99583668.htm · a preparation hint, not a question.
- Helo (startup, India) · RAG pipeline, reranking, hallucination mitigation, chunk size/overlap (S) · https://www.glassdoor.co.uk/Interview/Helo-Interview-E830638-RVW104966573.htm
- Amazon GenAI Fluency round posts that only ask for tips (no questions): LeetCode 7584467, 8481722, 7642876, 7525828, 7786873, 8441884, 7643209 (basic GenAI questions, unspecified), 7623949 (was a DSA round).
- Anthropic Blind thread: CodeSignal prompt-engineering assessment exists, no questions disclosed · https://www.teamblind.com/post/anthropic-applied-ai-product-engineer-interview-8bqjbuwx

## Nothing found
- Apple, Intel, Qualcomm: no report (opened or snippet) naming a prompting/LLM-app question. Intel Blind thread (https://www.teamblind.com/post/ai-solutions-engineering-interview-at-intel-wnfi331t) had no questions. Dataford/CleverPrep/InterviewQuery "guides" are not company sources and were not used.
- Generic listicles (lets-code, datacamp, analyticsvidhya, kodekloud) used only as inspiration for untagged variants.
