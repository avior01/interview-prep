# Research log: system design & pipelines (content/design)

Collected 2026-10-08. Each row is a page that says the item was asked at the named company.
"opened" means the page was fetched and read. "snippet" means the page itself returned 403 and
the item is backed by the search-result snippet for that specific URL.
Questions are written in our own words (staging/design/*.research.json).

| # | Company | Question idea | URL | Status | Subtopic |
|---|---|---|---|---|---|
| 1 | Microsoft | Producer/consumer messaging system with a delegator; scale to millions of messages, priorities, threading model | https://www.geeksforgeeks.org/microsoft-interview-experience-set-75-for-sde-ii/ | opened | producer-consumer |
| 2 | Microsoft | Design an n reader / writer class | https://www.geeksforgeeks.org/interview-experiences/microsoft-interview-experience-set-151-sde-2-3-5-years-experience/ | opened | producer-consumer |
| 3 | NVIDIA | Two threads print odd/even in order (mutex + condition variable) | https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-sde-2/ | opened | producer-consumer |
| 4 | Microsoft | Alarm system: create/update/delete alarms, deliver at scheduled time | https://www.geeksforgeeks.org/interview-experiences/microsoft-interview-experience-for-sde-ii/ | opened | producer-consumer |
| 5 | Microsoft | Class that hands out exclusive IDs; interviewer wanted a bit vector | https://www.geeksforgeeks.org/microsoft-interview-for-sde-2/ | opened | producer-consumer |
| 6 | Amazon | Design/upgrade Amazon's system for the Great Indian sale (scalability, SPOF, DB, low latency) | https://www.geeksforgeeks.org/amazon-interview-experience-sde-2-8/ (also https://www.geeksforgeeks.org/?p=381986) | opened | backpressure |
| 7 | Microsoft | Coding contest platform, ~10^6 submissions at closing time | https://www.geeksforgeeks.org/interview-experiences/microsoft-interview-experience-for-sde-ii/ | opened (friend's round, reported in the post) | backpressure |
| 8 | Google | Implement a rate limiter (fixed window, sliding window, token bucket) - L5 | https://leetcode.com/discuss/post/7858030/google-l5-frontend-interview-experience-53w4r/ | snippet (403) | backpressure |
| 9 | Microsoft | Scalable web service for real-time stock market data for millions of users | https://www.geeksforgeeks.org/?p=1044909 | opened | backpressure |
| 10 | Microsoft | Search engine for a global retail application | https://www.geeksforgeeks.org/?p=328159 | opened | latency-budget |
| 11 | Microsoft | Autocomplete feature of Bing search (trie sharding, ranking) | https://www.geeksforgeeks.org/interview-experiences/microsoft-interview-experience-sde-ii-2/ | opened | latency-budget |
| 12 | NVIDIA | Minimize total time of 15 compiler invocations given per-phase times | https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-compiler-engineer/ | opened | latency-budget |
| 13 | Amazon | Design a Netflix-type system (video qualities, caching) | https://www.geeksforgeeks.org/amazon-interview-experience-set-324-sde2/ | opened | latency-budget |
| 14 | Amazon | WhatsApp design; message ordering when client timestamps are unreliable | https://www.geeksforgeeks.org/amazon-interview-experience-sde-2/ | opened | pipelines |
| 15 | Amazon | Analyze all images reachable from a URL without revisiting pages (crawl + dedup) | https://www.geeksforgeeks.org/amazon-interview-set-25/ | opened | pipelines |
| 16 | Microsoft | Sort GB-size files with 200 MB of memory (follow-up of distributed cache) | https://www.geeksforgeeks.org/interview-experiences/microsoft-interview-experience-sde-ii-2/ | opened | pipelines |
| 17 | Amazon | Online teaching system with SMS / social / email notification preferences | https://www.geeksforgeeks.org/amazon-interview-set-25/ | opened | pipelines |
| 18 | Microsoft | Fault-tolerant distributed DB with concurrent reads and writes | https://www.geeksforgeeks.org/?p=1044909 | opened | scaling |
| 19 | Microsoft | Data consistency after failover to a backup server | https://www.geeksforgeeks.org/?p=138918 | opened | scaling |
| 20 | Microsoft | OTP service used by multiple services, unique per user and service | https://www.geeksforgeeks.org/interview-experiences/microsoft-interview-experience-for-sde-2-5/ | opened | scaling |
| 21 | Microsoft + Amazon | Tiny URL service (bit.ly) | https://www.geeksforgeeks.org/microsoft-interview-experience-sde-2-3-years-experienced/ ; https://www.geeksforgeeks.org/amazon-interview-experience-sde-2-3-years-experienced/ | opened | scaling |
| 22 | Amazon | Slack messenger: message schema, online vs offline delivery, partition keys | https://geeksforgeeks.org/amazon-interview-experience-for-sde-ii-virtual-rounds | opened | scaling |
| 23 | Amazon | Twitter APIs, DB design, load user timeline optimally | https://www.geeksforgeeks.org/amazon-interview-experience-sde-2-3-years-experienced/ | opened | scaling |
| 24 | Amazon | Clustered caching for Amazon.com with a central inventory DB | https://www.geeksforgeeks.org/amazon-interview-set-25/ | opened | scaling |
| 25 | Google | Ride-sharing platform handling millions of ride requests per minute | https://www.geeksforgeeks.org/interview-experiences/google-interview-experience-for-sde-3/ | opened | scaling |
| 26 | Meta | Photo system backend: 100 PB of photos, 500M DAU, exact estimates | https://geeksforgeeks.org/facebook-nyc-onsite-interview-experience | opened | scaling |
| 27 | Apple | Game leaderboard with top rankers from different regions | https://www.geeksforgeeks.org/interview-experiences/apple-interview-experience/ | opened | scaling |
| 28 | Microsoft | Distributed LRU cache with O(1) operations / distributed cache system | https://leetcode.com/discuss/interview-experience/7541629 (snippet, 403) ; https://www.geeksforgeeks.org/interview-experiences/microsoft-interview-experience-sde-ii-2/ (opened) | mixed | scaling |
| 29 | Amazon | Web app suddenly very slow when clicking one URL | https://www.geeksforgeeks.org/amazon-interview-set-25/ | opened | observability |
| 30 | Microsoft | Discuss a logging framework and an event dispatcher | https://www.geeksforgeeks.org/interview-experiences/microsoft-interview-experience-set-151-sde-2-3-5-years-experience/ | opened | observability |
| 31 | Apple | Fault-tolerant, highly available system; deployments, rollbacks, monitoring | https://www.geeksforgeeks.org/interview-experiences/apple-interview-experience-for-devops-engineer/ | opened | observability |
| 32 | Microsoft | Distributed file systems: how the single point of failure is handled | https://www.geeksforgeeks.org/?p=523297 | opened | observability |
| 33 | NVIDIA | Reduce cache misses when multiplying two very large matrices | https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-compiler-engineer/ | opened | rt-design |
| 34 | Apple | Dictionary design: hashing, conflicts, extending an overcrowded dictionary | https://www.geeksforgeeks.org/apple-interview-experience-for-software-developer-2020/ | opened | rt-design |

## Found but not used (for later)

| Company | Idea | URL | Note |
|---|---|---|---|
| Microsoft | Scalable fault-tolerant web app (components, caching, LB) | https://www.geeksforgeeks.org/?p=1046118 | opened; generic |
| Microsoft | Load-balancing strategy for fluctuating traffic | https://www.geeksforgeeks.org/?p=1044909 | opened |
| Microsoft | Autocomplete for a messaging app on a new phone | https://www.geeksforgeeks.org/?p=523297 | opened; overlaps #11 |
| Microsoft | Cricbuzz HLD | https://www.geeksforgeeks.org/interview-experiences/microsoft-interview-experience-for-sde-2-5/ | opened |
| Microsoft | Crawler fetching code from n systems; GitHub-like versioning | https://www.geeksforgeeks.org/interview-experiences/microsoft-interview-experience-set-114-2-5-years-experienced-sde2/ | opened |
| Microsoft | Logger design without singleton/static | https://geeksforgeeks.org/microsoft-interview-experience-for-sde-2-2 | opened; OOD |
| Amazon | RedBus; Amazon Locker | https://www.geeksforgeeks.org/amazon-interview-experience-for-sde-2-4/ | opened |
| Amazon | Geo-partitioned multiplayer card game | https://www.geeksforgeeks.org/amazon-interview-experience-set-324-sde2/ | opened |
| Amazon | IRCTC train search; elevator system | https://www.geeksforgeeks.org/amazon-interview-set-25/ | opened |
| Google | Scalable messaging app for millions of users globally | https://www.geeksforgeeks.org/interview-experiences/google-interview-experience-16/ , https://www.geeksforgeeks.org/google-interview-experience-for-software-engineer-6/ | opened |
| Meta | Hulu/Netflix-like service limiting logins to N devices | https://geeksforgeeks.org/facebook-nyc-onsite-interview-experience | opened |
| Apple | DNS design; what happens when you type a URL | https://www.geeksforgeeks.org/interview-experiences/apple-interview-experience/ | opened |
| NVIDIA | Design an OS scheduler (Naukri Code360) | https://www.naukri.com/code360/interview-experiences/nvidia/interview-experience-sep-2021-exp-0-2-years-2 | 403; only a search summary, not used |

Excluded on purpose: interviewing.io mock replays (interviewer works at the company, but the page
does not say the question was asked in a real interview there), prep-site "top questions" lists
(DesignGurus, PracHub, IGotAnOffer), and Glassdoor/1point3acres pages that returned 403 where the
search summary could not be tied to one specific URL.
