# Research log: Google + Meta system design and behavioral (sourced questions)

Collected 2026-10-08. Each row is a first-hand interview report that says the item was asked at the
named company. "opened (GraphQL)" means the LeetCode Discuss post was read in full through the public
`leetcode.com/graphql` endpoint (the HTML page returns 403). Questions are written in our own words in
`staging/design/*.researchGM.json` and `staging/beh/*.researchGM.json`.

## System design

| # | Company | Question idea | URL | Status | Subtopic |
|---|---|---|---|---|---|
| 1 | Google | Design Google Docs: chunking, concurrent edits from several users, ordering, real-time propagation (L4/L5 loop) | https://leetcode.com/discuss/interview-question/1930341/google-sde-l4l5-virtual-onsite-passed | opened (GraphQL) | scaling |
| 2 | Google | Design Google Sheets (L5, Bangalore, Apr 2024) | https://leetcode.com/discuss/interview-experience/5285771/ | opened (GraphQL) | scaling |
| 3 | Google | Image hosting website; follow-up: run AI models on the images | https://leetcode.com/discuss/post/5601424/google-l5-interview-experience-by-anonym-l0hq/ | opened (GraphQL) | scaling |
| 3b | Google | Image/GIF/video hosting without sign-up; new requirements added mid-interview | https://leetcode.com/discuss/post/6668243/google-india-sr-software-eng-l5-hired-in-ooe4/ | opened (GraphQL) | scaling |
| 4 | Google | TODO-list app synced across devices; cancellation and update conflicts (L6 Android) | https://leetcode.com/discuss/interview-experience/5331904/ | opened (GraphQL) | scaling |
| 5 | Meta | Store images for FB + Instagram at 1000 uploads/s and handle duplication (compiled list of 2023 onsite questions) | https://leetcode.com/discuss/interview-experience/4428743/ | opened (GraphQL) | scaling |
| 6 | Meta | Post privacy: Only Me / Friends / Public, can user X see the post (list) ; "Design Privacy Settings at Facebook" (E5 Pirate round) | https://leetcode.com/discuss/interview-experience/4428743/ ; https://leetcode.com/discuss/interview-experience/1623547/facebook-e5-phone-screen-virtual-onsite | opened (GraphQL) | scaling |
| 7 | Google | Service with API that receives out-of-order video frames and forwards them in timestamp order; concurrency discussion | https://leetcode.com/discuss/interview-experience/5885342/Google-L5-Interview-Experience-India-Offer/ | opened (GraphQL) | pipelines |
| 8 | Meta | Ad click aggregation system | https://leetcode.com/discuss/interview-experience/4428743/ | opened (GraphQL) | pipelines |
| 9 | Meta | Top 10 songs played on Spotify (top-k) | https://leetcode.com/discuss/interview-experience/4428743/ | opened (GraphQL) | pipelines |
| 10 | Meta | Remove "bad" ad posts from Instagram before users see them (E5 London, offer) | https://leetcode.com/discuss/interview-experience/5072251/ | opened (GraphQL) | pipelines |
| 11 | Meta | Web crawler over 1B+ pages (L5 onsite): frontier, politeness per host, dedup | https://leetcode.com/discuss/interview-experience/4955695/ | opened (GraphQL) | backpressure |
| 12 | Meta | Notification system alerting 1M users for a flash sale; fan-out + queues (E5) | https://leetcode.com/discuss/post/7587361/l4-meta-interview-experience-by-anonymou-8o1z/ | opened (GraphQL) | backpressure |
| 13 | Meta | News feed (FB/Instagram): fan-out for celebrity accounts, media storage, API + data model | https://leetcode.com/discuss/interview-experience/6379540/ (+ Instagram feed: https://leetcode.com/discuss/interview-experience/5799567/ , https://leetcode.com/discuss/interview-experience/5221908/) | opened (GraphQL) | latency-budget |
| 14 | Meta | Product architecture: audio channel system from 2.1 to 5.1 across OSes, WhatsApp calls, FB Live, Reels | https://leetcode.com/discuss/post/6588510/meta-full-loop-e5-bangalore-interview-ex-ztbb/ | opened (GraphQL) | rt-design |
| 15 | Google | "Customer agent system": schedule next customer, agents with different speeds, report wait time; follow-up: agent break / interrupted mid-request | https://leetcode.com/discuss/interview-question/1930341/google-sde-l4l5-virtual-onsite-passed | opened (GraphQL) | producer-consumer |
| 16 | Meta | Design LeetCode / an online coding (contest) platform: run code in containers, leaderboard | https://leetcode.com/discuss/interview-experience/5132163/ ; https://leetcode.com/discuss/post/6603264/meta-e5-full-loop-interview-experience-b-p25o/ ; https://leetcode.com/discuss/interview-experience/5279925/ | opened (GraphQL) | producer-consumer |

## Behavioral

| # | Company | Question idea | URL | Status | Subtopic |
|---|---|---|---|---|---|
| B1 | Meta | Disagreement with a coworker where you later found out you were wrong; follow-up "how did you find out?" (E4 product) | https://leetcode.com/discuss/interview-experience/6391263/ | opened (GraphQL) | conflict |
| B2 | Meta | A time you were misunderstood at work / a misunderstanding with a colleague (E5 Infra London) | https://leetcode.com/discuss/interview-experience/5707159/ | opened (GraphQL) | conflict |
| B3 | Google | An "offensive situation" with someone on your team (G&L round, L3/L4 India 2022) | https://leetcode.com/discuss/interview-experience/2392718/ | opened (GraphQL) | conflict |
| B4 | Meta | Took initiative / went beyond what was expected | https://leetcode.com/discuss/interview-experience/5707159/ | opened (GraphQL) | leadership |
| B5 | Meta | Dealt with pushback from the team (E5 Warsaw) ; a time you were right but had to convince others (E4) | https://leetcode.com/discuss/interview-experience/5799567/ ; https://leetcode.com/discuss/interview-experience/6379540/ | opened (GraphQL) | leadership |
| B6 | Google | Hypothetical: plan an offsite for the team as its lead (G&L) | https://leetcode.com/discuss/interview-experience/2392718/ | opened (GraphQL) | leadership |
| B7 | Google | Open-ended "what would you do as CEO of X" round; feedback: did not handle ambiguity | https://leetcode.com/discuss/interview-experience/5529760/Google-or-L5-or-Bangalore-or-May-2024/ | opened (GraphQL) | leadership |
| B8 | Google | Hypothetical: how you'd handle customer reviews and differences of opinion; motivation (G&L, L4) | https://leetcode.com/discuss/interview-experience/1046309/ | opened (GraphQL) | leadership |
| B9 | Google | Failure: a goal you set yourself and didn't meet (G&L) ; "a time you messed up" (L5 Googliness) | https://leetcode.com/discuss/interview-experience/2392718/ ; https://leetcode.com/discuss/interview-experience/4820834/Google-L5-SSE-interview-experience | opened (GraphQL) | failure |
| B10 | Google | A project you recently delivered and how you prepared for failure cases / obstacles (G&L, L4) | https://leetcode.com/discuss/interview-experience/1046309/ | opened (GraphQL) | star |
| B11 | Meta | Cross-org project: your role, technical planning / roadmapping (E6 screen behavioral) | https://leetcode.com/discuss/interview-experience/5122394/ | opened (GraphQL) | star |
| B12 | Meta | Behavioral became a grilling deep dive into the technology on the resume (E5 Menlo Park) | https://leetcode.com/discuss/interview-experience/1124632/facebook-e5-onsite-menlo-park | opened (GraphQL) | star |
| B13 | Google | Why did you change companies, and now why Google; what you expect at Google (G&L) | https://leetcode.com/discuss/interview-experience/2392718/ | opened (GraphQL) | why-software |

### Follow-up probes used in rubrics
- Google: G&L is a back-and-forth with many follow-ups "to see if you were bsing" (1930341); hypothetical questions are mixed in (1046309, 2392718); ambiguity is graded explicitly (5529760).
- Meta: follow-ups interrupt the story (https://leetcode.com/discuss/interview-experience/5934156/); "how would you deal with it now?" (5799567); "how did you find out you were wrong?" (6391263); E6 vs E5 judged by cross-team scope (5122394); the behavioral round also sets the level (https://leetcode.com/discuss/interview-experience/5794114/).

## Found but not used (for later)

| Company | Idea | URL | Note |
|---|---|---|---|
| Google | Service that indexes Twitter's whole news feed | https://leetcode.com/discuss/interview-experience/5885342/Google-L5-Interview-Experience-India-Offer/ | opened |
| Google | Events from news/social sources: crawler + dedup of the same event + booking | https://leetcode.com/discuss/interview-experience/5534774/ | opened |
| Google | Inventory management, then high-concurrency follow-up; central HR system integration | https://leetcode.com/discuss/post/6552739/google-l5-interview-experienceselected-b-8ff5/ | opened |
| Google | Distributed cache for a given task; TikTok-style Google News | https://leetcode.com/discuss/post/6349651/ | opened |
| Google | Real-time streaming system with scale (L6) | https://leetcode.com/discuss/interview-experience/1945705/ | opened, no detail |
| Google | Rate limiter + DDoS prevention as the L5 design question | https://leetcode.com/discuss/interview-experience/5894250/ | opened |
| Meta | Price alert (camelcamelcamel), proximity server, online chess, WhatsApp, YouTube | https://leetcode.com/discuss/interview-experience/4428743/ | opened (list) |
| Meta | Text posts + keyword search | https://leetcode.com/discuss/interview-experience/5707159/ | opened |
| Meta | Auction system on Instagram | https://leetcode.com/discuss/interview-experience/5531084/ | opened |
| Meta | Android push-notification client without Google's push service | https://leetcode.com/discuss/interview-experience/1988885/ | opened |
| Meta | Netflix-like streaming service with many features | https://leetcode.com/discuss/interview-experience/1124632/facebook-e5-onsite-menlo-park | opened |
| Meta | 1-v-1 online gaming platform (2019) | https://leetcode.com/discuss/interview-experience/411971/ | opened |

Excluded: a Meta E5 report (https://leetcode.com/discuss/interview-experience/5501360/) whose design question was framed
around a botnet of hacked computers; not used. The Google L3 post 4778433 (its Googleyness list is "questions to practice", not questions asked),
prep-site lists (igotanoffer, interviewkickstart, designgurus, careerflow), Glassdoor pages (not opened),
the official metacareers SWE page (opened, but the question details are in a PDF that was not fetched).
