# Research log: Python + behavioral (sourced questions)

Collected 2026-10-08. Format: company · question idea (our paraphrase) · URL · how the page attributes it.
Only items where the page (or its search snippet) names the company were kept. Questions in
staging/py/*.research.json and staging/beh/*.research.json are written in our own words.

Access notes: Glassdoor list pages, LeetCode Discuss, 1point3acres, igotanoffer and interviewquery
blocked fetching (403/429/bot-check). Most Python items therefore come from PracHub question pages,
which name company, role and round. The web-search budget ran out before Intel/Qualcomm reports were
found; no Intel or Qualcomm item is kept.

## Python

### data-model
- Apple · lists vs dicts: complexity, iteration-order guarantee, mutability, memory · https://prachub.com/interview-questions/explain-python-lists-dicts-and-concurrency · PracHub: Apple, Software Engineer, technical screen
- Apple · OOP: child class relies on a dict built in the parent's `__init__` (most-frequent key without max) · https://prachub.com/coding-questions/implement-most-frequent-key-without-using-max · PracHub: Apple, Data Engineer, technical screen
- Microsoft · how Python manages memory (refcount + cyclic GC), Python vs Java runtime model · https://prachub.com/interview-questions/explain-python-java-and-memory-management · PracHub: Microsoft, Software Engineer, onsite
- Meta · explain Python's garbage collector · https://www.glassdoor.it/Colloquio/Meta-Colloquio-E40772-RVW74349571.htm · Glassdoor review, Meta Python Developer (opened by the research pass; 403 on a later re-check)
- Amazon · safe_min/safe_max with NaN handling · https://prachub.com/interview-questions/implement-robust-word-counts-and-min-max · PracHub: Amazon, Data Scientist, onsite
- Amazon · same task: `key=` and default sentinel, first element wins on ties · https://prachub.com/interview-questions/implement-robust-word-counts-and-min-max · same page
- Amazon · collections.deque: what it is, why use it · https://fr.glassdoor.ch/Entretien/Amazon-Entretien-E6036-RVW105380732.htm · Glassdoor review, Amazon Software Developer (Jul 2025)

### generators
- Apple · map() vs list comprehension · https://prachub.com/interview-questions/explain-python-lists-dicts-and-concurrency · PracHub: Apple, SWE, technical screen
- Apple · generator yielding every (overlapping) match position of a pattern · https://prachub.com/coding-questions/write-a-generator-for-substring-pattern-matches · PracHub: Apple ML Engineer new-grad tech round (+ candidate write-up https://prachub.com/interview-experiences/apple-new-grad-machine-learning-engineer-interview-experience-two-tech-screens-no-feedback-on-the-reject)
- Google · re-implement itertools.tee lazily with buffering · https://prachub.com/interview-questions/implement-a-lazy-tee-iterator-in-python · PracHub: Google, SWE, technical screen
- Google · robust memory-light generator over messy input (None / bad items) · https://prachub.com/interview-questions/implement-a-robust-python-generator · PracHub: Google ML Engineer onsite
- Google · iterator merging lists, filtering blocked IDs, no duplicates · https://prachub.com/coding-questions/implement-iterator-merging-lists-with-filtering · PracHub: Google SWE technical screen
- Amazon · stream a 50 GB file and count words without loading it into memory · https://prachub.com/interview-questions/implement-robust-word-counts-and-min-max · PracHub: Amazon Data Scientist onsite
- Amazon · lazily merge timestamp-sorted streams without flattening · https://prachub.com/coding-questions/merge-sorted-event-streams-through-an-iterator · PracHub: Amazon SWE onsite
- Amazon · k-way merge over possibly infinite sorted iterators, take first N · https://prachub.com/coding-questions/implement-streaming-k-way-merge-with-constraints · PracHub: Amazon Data Scientist Senior+
- NVIDIA · process a large CSV safely as a stream (encoding, memory) · https://prachub.com/interview-questions/analyze-and-debug-python-utilities · PracHub: NVIDIA, SWE, onsite

### gil
- Apple · explain the CPython GIL and how it limits threads · https://prachub.com/interview-questions/explain-python-lists-dicts-and-concurrency · PracHub: Apple SWE technical screen
- Apple · threading vs multiprocessing: when each · same URL · same
- Apple · share data safely between workers (Queue/Lock/Event), avoid races and deadlocks · same URL · same
- Meta · explain the GIL · https://www.glassdoor.it/Colloquio/Meta-Colloquio-E40772-RVW74349571.htm · Glassdoor review, Meta Python Developer

### numpy
- NVIDIA · 2D convolution in NumPy without Python loops · https://prachub.com/coding-questions/implement-2d-convolution-using-numpy-slicing · PracHub: NVIDIA SWE technical screen (also https://prachub.com/interview-experiences/nvidia-technical-marketing-engineer-interview-experience-one-round-four-parts-resume-ml-trivia-and-live-numpy-coding)
- NVIDIA · tensor shapes + broadcasting rules · https://prachub.com/interview-questions/derive-mlp-shapes-and-explain-pytorch-broadcasting · PracHub: NVIDIA SWE
- Google · binomial matrix, normalize each column (broadcasting) · https://prachub.com/coding-questions/generate-binomial-matrix-and-column-normalize · PracHub: Google Data Scientist
- Google · transformer block / self-attention in NumPy (softmax) · https://prachub.com/coding-questions/implement-a-transformer-block-with-swiglu · PracHub: Google ML Engineer
- Amazon · multi-head attention from scratch in NumPy · https://prachub.com/coding-questions/implement-multi-head-attention-from-scratch-in-numpy · PracHub: Amazon Applied Scientist
- Amazon · top-p (nucleus) sampling in NumPy · https://prachub.com/coding-questions/implement-top-p-nucleus-sampling-in-numpy · PracHub: Amazon Applied Scientist
- Amazon · vectorized group-relative advantages (GRPO) in NumPy · https://prachub.com/interview-questions/grpo-in-numpy-group-relative-advantages-process-rewards-and-shaped-rewards · PracHub: Amazon ML Engineer

### asyncio
- NVIDIA · debug async URL fetcher: blocking call stalls the event loop · https://prachub.com/interview-questions/analyze-and-debug-python-utilities · PracHub: NVIDIA SWE onsite
- NVIDIA · same: coroutine created but never awaited · same URL
- NVIDIA · same: race condition between coroutines · same URL

### Rejected (Python)
- Microsoft MLE GIL thread on 1point3acres (search title only, page bot-blocked); NVIDIA Glassdoor "Python fundamentals + concurrency" (snippet only, no concrete question); pandas items on PracHub company lists (title only); Squarepoint / Varonis / Fynd pages (not target companies); Qualcomm "Python interview questions" blog (generic list).

## Behavioral

### star
- Microsoft · tell me about yourself · https://www.aced.io/blog/microsoft-interview-process · listed under Microsoft behavioral interview questions
- NVIDIA · most technically complex project and why it was complex · https://www.aced.io/blog/nvidia-interview-process · "actual interview questions asked at NVIDIA, as reported by candidates"
- Meta · project you're most proud of · https://intervue.io/blog/meta-interview-experience · most frequently reported Meta behavioral questions
- Google · favorite project and how you executed it · https://interviewkickstart.com/blogs/interview-questions/google-software-engineer-interview-sample-questions-and-tips · Google SWE sample questions (weaker attribution)
- Meta · technical decision with big trade-offs · https://intervue.io/blog/meta-interview-experience · same list
- Amazon · customer's stated problem wasn't the root cause · https://www.aced.io/blog/amazon-interview-process · reported by interviewers/recent candidates
- Amazon · a time you dove deep · https://www.aced.io/blog/amazon-interview-process · same
- Apple · worked under pressure to meet a deadline · https://www.aced.io/blog/apple-interview-process · Apple questions reported by candidates
- Amazon · learned a skill outside your job description · https://www.aced.io/blog/how-to-nail-amazons-behavioral-interview-questions · recalled by a candidate (Learn and Be Curious)
- NVIDIA · technology you explored on your own · https://www.finalroundai.com/interview-prep/nvidia-behavioral-interview · common NVIDIA questions (weaker)

### failure
- Amazon · couldn't deliver on a commitment · https://www.aced.io/blog/amazon-interview-process · reported list
- Meta · failed to deliver something on time · https://intervue.io/blog/meta-interview-experience · frequently reported
- Meta · made a mistake · https://career.kean.edu/blog/2025/09/26/meta-behavioral-interview-guide-and-top-questions/ · questions candidates faced at Meta
- Google · made a mistake and what you changed · https://www.aced.io/blog/google-interview-process · reported by candidates
- Meta · negative feedback · https://career.kean.edu/blog/2025/09/26/meta-behavioral-interview-guide-and-top-questions/
- Google · negative feedback · https://interviewing.io/guides/hiring-process/google · Google guide example list
- NVIDIA · negative feedback · https://www.aced.io/blog/nvidia-interview-process · reported by candidates
- Microsoft · a project that failed · https://www.aced.io/blog/microsoft-interview-process
- Microsoft · showed a growth mindset · https://www.aced.io/blog/microsoft-interview-process
- NVIDIA · wrong about a technical decision · https://www.finalroundai.com/interview-prep/nvidia-behavioral-interview (weaker)
- Microsoft · wrong in a technical debate · https://www.designgurus.io/answers/detail/top-microsoft-behavioral-interview-questions-and-how-to-answer-them (weaker)
- Meta · what you'd do differently if you restarted a recent project · https://www.techinterview.org/post/3233477365/meta-behavioral-interview-cheat-sheet/
- Microsoft · top two strengths and weaknesses · https://interviewing.io/guides/hiring-process/microsoft · anecdote from a Microsoft interviewer
- Apple · areas you still need to develop · https://www.aced.io/blog/apple-interview-process

### conflict
- Microsoft · conflict, how resolved, what learned · https://www.aced.io/blog/microsoft-interview-process
- NVIDIA · conflict with a coworker · https://www.aced.io/blog/nvidia-interview-process
- Apple · conflict on a team · https://www.aced.io/blog/apple-interview-process
- Google · disagreed with someone and resolved it · https://www.aced.io/blog/google-interview-process
- Amazon · disagreed with a manager/peer on something important · https://www.aced.io/blog/how-to-nail-amazons-behavioral-interview-questions
- Meta · disagreed with your manager's technical direction · https://intervue.io/blog/meta-interview-experience
- Microsoft · your team is blocking you · https://www.aced.io/blog/microsoft-interview-process
- Meta · difficult stakeholder · https://career.kean.edu/blog/2025/09/26/meta-behavioral-interview-guide-and-top-questions/
- Google · difficult stakeholder · https://www.aced.io/blog/google-interview-process
- Meta · two teams couldn't agree · https://interviewing.io/guides/hiring-process/meta-facebook
- Amazon · hybrid solution when stakeholders couldn't agree · https://www.aced.io/blog/how-to-nail-amazons-behavioral-interview-questions · marked "Reported"
- Amazon · disagreed with a teammate · https://www.aced.io/blog/amazon-interview-process
- NVIDIA · disagreed with senior leadership · https://www.finalroundai.com/interview-prep/nvidia-behavioral-interview (weaker)

### leadership
- Amazon · took ownership of a project · https://www.aced.io/blog/amazon-interview-process
- Amazon · decision with incomplete information · https://www.aced.io/blog/amazon-interview-process
- Meta · fast decision and lived with the result · https://interviewing.io/guides/hiring-process/meta-facebook
- Microsoft · influenced a team you had no authority over · https://www.designgurus.io/answers/detail/top-microsoft-behavioral-interview-questions-and-how-to-answer-them (weaker)
- NVIDIA · influenced a decision without authority · https://www.designgurus.io/answers/detail/top-nvidia-behavioral-interview-questions-and-how-to-answer-them (weaker)
- Meta · convinced engineers to build a feature · https://career.kean.edu/blog/2025/09/26/meta-behavioral-interview-guide-and-top-questions/
- Meta · ambiguous requirements · https://career.kean.edu/blog/2025/09/26/meta-behavioral-interview-guide-and-top-questions/
- Meta · prioritizing across many projects · https://career.kean.edu/blog/2025/09/26/meta-behavioral-interview-guide-and-top-questions/
- NVIDIA · how you prioritize tasks · https://www.aced.io/blog/nvidia-interview-process
- Google · mentoring a junior whose feedback isn't landing · https://interviewing.io/guides/hiring-process/google
- Amazon · communicated a change of direction people would resist · https://www.aced.io/blog/how-to-nail-amazons-behavioral-interview-questions
- Microsoft · gained someone's trust · https://www.aced.io/blog/microsoft-interview-process
- Microsoft · biggest risk you've taken · https://www.aced.io/blog/microsoft-interview-process

### why-software
- NVIDIA · why NVIDIA · https://www.aced.io/blog/nvidia-interview-process
- Microsoft · why you fit Microsoft's mission · https://www.aced.io/blog/microsoft-interview-process
- Google · why Google · https://www.aced.io/blog/google-interview-process
- Apple · why Apple · https://www.aced.io/blog/apple-interview-process
- Meta · why are you leaving your current role · https://www.techinterview.org/post/3233477365/meta-behavioral-interview-cheat-sheet/
- Apple · where in 5 years / what you're passionate about · https://www.aced.io/blog/apple-interview-process

### Follow-up probes used in rubrics
- Amazon: "what data did you use", "who disagreed", "what would you do differently", "how did you know it was the right call", baseline for metrics; Bar Raiser digs into missed commitments · https://www.aced.io/blog/how-to-nail-amazons-behavioral-interview-questions , https://www.aced.io/blog/amazon-interview-process
- Meta: "what specifically did you do", "how did you measure success", "resolved directly or escalated", "what options did you weigh", 4–5 levels deep, I vs we · https://intervue.io/blog/meta-interview-experience , https://www.techinterview.org/post/3233477365/meta-behavioral-interview-cheat-sheet/
- Microsoft: "what did you learn", positivity, ownership, no blaming · https://www.aced.io/blog/microsoft-interview-process , https://interviewing.io/guides/hiring-process/microsoft
- NVIDIA: how you take criticism; behavioral turns into a technical deep dive · https://www.designgurus.io/answers/detail/top-nvidia-behavioral-interview-questions-and-how-to-answer-them
