# Research log: Google + Meta, Python and DSP (sourced questions)

Collected 2026-10-08. Format: company · question idea (our paraphrase) · URL · opened/snippet.
Staged in staging/py/*.researchGM.json and staging/dsp/*.researchGM.json; questions are written in our own words.
Each sourced item has 1 tagged question + 2 untagged variants.

Access notes: Glassdoor review pages return 403 to plain fetch, so Glassdoor items are from search-result
snippets of that specific review. LeetCode Discuss posts were read through the public GraphQL endpoint
(`ugcArticleDiscussionArticle`). PracHub pages and the Substack post were opened with a plain fetch.
Web searches used: 22.

## Python

### data-model
- Meta · Production Engineer coding screen: parse the "dinosaur" CSV files (join by name, compute speed, print bipedal by speed) · https://leetcode.com/discuss/post/7143811/meta-production-engineer-interview-by-jp-jgy2/ · opened (candidate: "asked the Dinosaur questions in the coding round" of the PE phone screen)
  - same · https://reliabilitywhisperer.substack.com/p/2025meta-e4-production-engineer-interview · opened (2025 E4 PE write-up: Dino CSV parsing in the screen). The language is not named on either page; our question is the Python version.

### generators
- Meta · PE screen: filter logs with a Python script and build a structure from them · https://www.glassdoor.com.au/Interview/Meta-Interview-E40772-RVW35612726.htm · snippet (403 on fetch)
- Meta · Data Scientist onsite: stream an event log in Python and sessionize with a 30 s inactivity gap (generator, stateful dict) · https://prachub.com/coding-questions/compute-effective-reads-with-sql-and-python-streaming · opened
- Google · SWE onsite: exact most-frequent IP addresses in a file far larger than RAM (bounded memory, ties, temp files) · https://prachub.com/interview-questions/find-the-most-frequent-ip-addresses-in-a-file-too-large-for-memory · opened (language not specified; our question uses Python)

### numpy
- Google · Data Scientist technical screen: add a priority-ordered conditional column, vectorized (`np.select`), NaN rating must not trigger "high" · https://prachub.com/coding-questions/add-a-conditional-column-in-python · opened

## DSP

### filters
- Meta · audio team (Acoustic Research Engineer, Redmond): IIR vs FIR, then biquad vs Chebyshev vs Butterworth · https://www.glassdoor.co.uk/Interview/Meta-Interview-E40772-RVW81031582.htm , https://www.glassdoor.co.uk/Interview/Meta-Interview-E40772-RVW103803555.htm · snippet (reviews dated 2023 and 2026 per search summary; 403 on fetch). IIR vs FIR already in content as a Google item, so only the biquad/Butterworth/Chebyshev part was used.
- Google · onsite / phone: average of the last k stream values after removing the top and bottom 5% · https://leetcode.com/discuss/post/417463/google-onsite-moving-average-from-a-data-zpdd/ , https://leetcode.com/discuss/post/537232/google-phone-average-of-k-numbers-in-a-s-bc1w/ · opened
  - related · Google SWE technical screen: sliding-window average after dropping the k largest, stream-like, no re-sorting · https://prachub.com/coding-questions/sliding-window-average-after-dropping-the-largest-values · opened

### ring-buffers
- Meta · LeetCode 346 Moving Average from Data Stream, and the Meta variant with all numbers given up front · https://leetcode.com/discuss/post/6257150/metas-variant-for-lc346-moving-average-f-am8j/ · opened (post says it is in Meta's top-50 and describes the variant Meta asks)
  - Meta · SWE technical screen: compute sliding-window averages · https://prachub.com/coding-questions/compute-sliding-window-averages · opened
- Meta · Facebook phone: average weight of events in the past K minutes, K not known in advance · https://leetcode.com/discuss/post/435747/facebook-phone-average-value-in-past-k-m-l13e/ · opened
- Google · Embedded SWE phone screen: `read_bytes(count)` wrapper over a driver `read()` that returns 512-byte blocks (cache the remainder) · https://leetcode.com/discuss/post/336276/google-embedded-software-engineer-bangal-1w4s/ · opened

### interview
- Meta · audio team: types of measurement microphones (free-field, pressure, random-incidence) · same two Glassdoor reviews as filters · snippet
- Meta · Reality Labs: design an audio mixer · https://leetcode.com/discuss/post/2477114/embedded-system-design-faang-interview-q-uym3/ · opened (weaker: an Interview Kickstart promo post listing "Design an audio mixer (Asked at Meta Reality Lab)")
- Meta · Facebook interview question: Faulty Sensor (LeetCode 1826) · https://leetcode.com/discuss/post/1092760/facebook-interview-question-faulty-senso-e0t3/ · opened
- Meta · ML Engineer onsite: streaming / online statistics without storing the stream · https://prachub.com/coding-questions/solve-sampling-and-streaming-tasks · opened (the page names the area only; the statistic is not specified, so the question uses mean/variance via Welford)

## Rejected / not used
- Google · 2012 phone screen: definition of frequency vs period (Glassdoor RVW9522094, snippet): too trivial and old.
- Google · Blind threads on "Software Engineer, Audio and Signal Processing" (teamblind ktyp0zaq, xhdnch8t): opened, no concrete questions.
- Meta · Reality Labs posts on LeetCode Discuss (6619587, 5713589, 7038254, 6941434, 6998947, 1319374): questions about the process only, no content.
- Meta · "facebook audio algorithm position" (LeetCode 568242): candidate asking what to expect, no questions.
- Google wireless/modem and Pixel audio: no Google-attributed concrete questions found in this pass (only job postings and Qualcomm reports).
- Shallow vs deep copy Glassdoor question (QTN_8895330): company not shown, not used.
- Meta PracHub "Design a Concurrent, Memory-Bounded Tally Service", "Design an Expected O(1) Randomized Container": concurrency/algorithm topics, out of scope for py/dsp.

## Verification
Every Python snippet in the staged files was run (Python 3.13, NumPy 2.3.5, SciPy 1.17); outputs match the marked answers.
Numbers checked with NumPy/SciPy: Butterworth −3.01 dB at cutoff (N=2,4,8); 4th-order analog attenuation at 2·fc: Butterworth 24.1 dB,
Chebyshev I (1 dB) 33.9 dB; SOS shape (4, 6) for order 7; trimmed mean 4.75 vs mean 8.8; rebuffering 480→512: 416 left after
3 blocks, peak occupancy 960 (100,000-block simulation); float32 naive variance −8.0 vs 1.25; float32 running-sum drift ≈0.13.
