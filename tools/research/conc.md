# Research log: concurrency & real-time (conc)

Collected 2026-10-08. Each row: subtopic · companies · question idea · URLs that report it as asked there.
LeetCode Discuss posts were read in full (via LeetCode's own GraphQL endpoint, since the HTML pages return 403).
GeeksforGeeks and Hello Interview pages were opened. Glassdoor pages return 403: those rows rely on the
search-result snippet of that specific review page (marked *snippet*).

1. **atomics** · microsoft · Microsoft interview: two unsynchronized threads increment i three times, max and min value printed
   - https://leetcode.com/discuss/post/318583/microsoft-sde-2-pune-by-anonymous_user-bc6p/
2. **atomics** · amazon · Amazon interview: generate unique IDs from many threads
   - https://leetcode.com/discuss/post/1054063/amazon-sde-reject-by-anonymous_user-949w/
3. **atomics** · meta · Meta interview: ticket booking, race conditions and concurrency control
   - https://leetcode.com/discuss/post/6336311/meta-system-design-by-anonymous_user-1n24/
   - https://leetcode.com/discuss/post/4544611/meta-infra-e5-onsite-by-anonymous_user-kl5c/
4. **atomics** · qualcomm, nvidia · Qualcomm / NVIDIA interview: what does the volatile keyword do
   - https://leetcode.com/discuss/post/8365964/qualcomm-senior-engineer-by-anonymous_us-zu9g/
   - https://leetcode.com/discuss/post/824537/qualcomm-engineer-india-new-grad-by-anon-0y2s/
   - https://geeksforgeeks.org/qualcomm-interview-experience-off-campus-2021
   - https://leetcode.com/discuss/post/8510550/nvidia-interview-experience-senior-syste-vr87/
   - https://www.glassdoor.es/Entrevista/NVIDIA-Entrevista-E7633-RVW22514159.htm *(snippet)*
5. **atomics** · apple · Apple interview: hit counter, is it thread-safe and what is the critical section
   - https://leetcode.com/discuss/post/2432962/apple-onsite-london-reject-by-anonymous_-pozj/
6. **condvars** · microsoft · Microsoft interview: producer-consumer extended to multiple producers and consumers
   - https://leetcode.com/discuss/post/6931412/microsoft-l61-interview-process-by-nikhi-rut5/
   - https://leetcode.com/discuss/post/6034209/microsoft-sde-2-hyderabad-passed-novembe-qmws/
   - https://leetcode.com/discuss/post/1338962/microsoft-senior-software-engineer-hyder-702m/
7. **condvars** · qualcomm · Qualcomm interview: code a bounded buffer with semaphores
   - https://leetcode.com/discuss/post/4842838/qualcomm-interview-experiance-by-anonymo-0hg4/
8. **condvars** · microsoft · Microsoft interview: what happens when a counting semaphore reaches 0
   - https://leetcode.com/discuss/post/335125/microsoft-india-interview-questions-by-b-wkfq/
9. **condvars** · nvidia · NVIDIA interview: print 1..N with N threads in order, using N semaphores and then one
   - https://leetcode.com/discuss/post/4032849/nvidia-interview-off-campus-2023/
10. **condvars** · microsoft · Microsoft interview: print odd and even numbers alternately with two threads
   - https://leetcode.com/discuss/post/4089181/microsoft-sde-iii-bangalore-by-anonymous-f9yj/
11. **condvars** · qualcomm · Qualcomm interview: three threads print Aa1Bb2Cc3 in order
   - https://leetcode.com/discuss/post/1939505/qualcomm-senior-engineer-hyderabad-april-ffzb/
12. **condvars** · nvidia, intel · NVIDIA / Intel interview: two threads run alternately (ABAB...) k times
   - https://leetcode.com/discuss/post/1299487/nvidia-software-intern-india-by-anonymou-8g0n/
   - https://www.glassdoor.com.mx/Entrevista/Intel-Corporation-Entrevista-E1519-RVW95626028.htm *(snippet)*
13. **condvars** · amazon · Amazon interview: producer-consumer where producers have ranks
   - https://leetcode.com/discuss/post/323046/amazon-sde12-reject-by-anonymous_user-m4bz/
14. **deadlock** · amazon · Amazon interview: write a program that emulates a deadlock
   - https://leetcode.com/discuss/post/404812/amazon-sde1-india-aug-2019-offer-by-hard-bxnv/
15. **deadlock** · amazon · Amazon interview: explain the Banker's algorithm
   - https://www.geeksforgeeks.org/?p=722931
16. **deadlock** · qualcomm, microsoft · Qualcomm / Microsoft interview: deadlock prevention, avoidance and detection
   - https://www.geeksforgeeks.org/?p=123669
   - https://www.geeksforgeeks.org/?p=140440
   - https://leetcode.com/discuss/post/335125/microsoft-india-interview-questions-by-b-wkfq/
17. **latency-jitter** · qualcomm, nvidia · Qualcomm / NVIDIA interview: steps followed when an interrupt occurs, ISR handling
   - https://leetcode.com/discuss/post/1341747/qualcomm-by-monty4597-ys8n/
   - https://leetcode.com/discuss/post/8510550/nvidia-interview-experience-senior-syste-vr87/
18. **latency-jitter** · google · Google interview: timer callbacks with a single hardware timer
   - https://leetcode.com/discuss/post/1690850/google-online-timer-callback-by-anonymou-yhcx/
19. **lock-free** · qualcomm · Qualcomm interview: can't we share data without a mutex?
   - https://leetcode.com/discuss/post/1341747/qualcomm-by-monty4597-ys8n/
20. **lock-free** · qualcomm · Qualcomm display team interview: avoid screen tearing with a shared frame buffer
   - https://leetcode.com/discuss/post/5079058/qualcomm-senior-engineer-hyderabad-april-u7dw/
21. **memory-order** · nvidia · NVIDIA phone screen: explain atomics and memory barriers
   - https://www.glassdoor.es/Entrevista/NVIDIA-Entrevista-E7633-RVW22514159.htm *(snippet)*
22. **memory-order** · apple · Apple interview: multi-threaded singleton implementation (volatile)
   - https://leetcode.com/discuss/post/1262088/apple-ict3-april-2021-offer-by-anonymous-jsei/
23. **mutex-locks** · amazon, microsoft, apple, intel, qualcomm · Interview classic: mutex vs semaphore
   - https://leetcode.com/discuss/post/626967/amazon-sde1-hyderabad-may-2020-offer-by-t995q/
   - https://www.geeksforgeeks.org/?p=722931
   - https://www.geeksforgeeks.org/?p=160539
   - https://leetcode.com/discuss/post/335125/microsoft-india-interview-questions-by-b-wkfq/
   - https://leetcode.com/discuss/post/3822073/apple-emdedded-swe-interview-by-anonymou-c27g/
   - https://leetcode.com/discuss/post/2114974/intel-on-campus-interview-by-anonymous_u-r0x8/
   - https://geeksforgeeks.org/qualcomm-interview-experience-off-campus-2021
   - https://leetcode.com/discuss/post/1341747/qualcomm-by-monty4597-ys8n/
24. **mutex-locks** · intel, nvidia · Intel / NVIDIA interview: mutex vs spinlock, which one on a single core
   - https://www.geeksforgeeks.org/?p=141478
   - https://www.glassdoor.es/Entrevista/NVIDIA-Entrevista-E7633-RVW22514159.htm *(snippet)*
25. **mutex-locks** · intel · Intel interview: reentrant function vs thread-safe code
   - https://www.geeksforgeeks.org/?p=141478
26. **mutex-locks** · microsoft · Microsoft interview: thread-safe stack, which operations need locking
   - https://leetcode.com/discuss/post/489558/microsoft-azure-bangalore-by-anonymous_u-wwn9/
27. **mutex-locks** · microsoft, google, apple · Interview follow-up: make an LRU / LFU cache thread-safe
   - https://leetcode.com/discuss/post/487498/microsoft-onsite-high-concurrency-lru-ca-h2dc/
   - https://leetcode.com/discuss/post/379416/google-design-thread-safe-lfu-cache-by-a-p3hd/
   - https://leetcode.com/discuss/post/7019880/apple-sde-1-interview-india-by-utkarshda-ddqi/
28. **mutex-locks** · apple · Apple interview: what to synchronize while a hash map resizes
   - https://leetcode.com/discuss/post/1262088/apple-ict3-april-2021-offer-by-anonymous-jsei/
29. **mutex-locks** · google · LeetCode 981 · Time Based Key-Value Store (Google follow-up: multi-threaded version)
   - https://leetcode.com/discuss/post/5141523/google-interview-how-to-implement-a-mult-baaq/
30. **mutex-locks** · microsoft · Microsoft interview: singleton for a multi-threaded program
   - https://leetcode.com/discuss/post/318583/microsoft-sde-2-pune-by-anonymous_user-bc6p/
   - https://leetcode.com/discuss/post/6389446/microsoft-sde-l60-by-anonymous_user-3ynt/
31. **mutex-locks** · nvidia · NVIDIA senior interview: differences between mutex, semaphore and spinlock
   - https://www.hellointerview.com/community/questions/mutex-semaphore-comparison/cmlufiz6y09lt0eadwjafzgyl
32. **mutex-locks** · microsoft, apple, google · Interview: implement a read-write lock
   - https://leetcode.com/discuss/post/335151/microsoft-create-simple-read-write-lock-0k6r0/
   - https://leetcode.com/discuss/post/2502411/apple-cupertino-media-streaming-engineer-jsip/
   - https://www.glassdoor.fr/Entretien/Google-Entretien-E9079-RVW8067629.htm *(snippet)*
33. **rt-scheduling** · qualcomm, nvidia · Qualcomm / NVIDIA interview: priority inversion, why it happens and how to solve it
   - https://www.geeksforgeeks.org/?p=334558
   - https://www.geeksforgeeks.org/?p=123669
   - https://www.geeksforgeeks.org/?p=140440
   - https://geeksforgeeks.org/qualcomm-interview-experience-off-campus-2021
   - https://leetcode.com/discuss/post/5966607/qualcomm-offcampus-by-anonymous_user-cmcm/
   - https://www.geeksforgeeks.org/?p=131187
34. **rt-scheduling** · nvidia · NVIDIA interview: which scheduling algorithm for autonomous vehicles, and why
   - https://leetcode.com/discuss/post/4026331/nvidia-system-software-engineer-intervie-u1st/
   - https://leetcode.com/discuss/post/5396353/nvidia-off-campus-interview-experience-b-edj2/
35. **rt-scheduling** · qualcomm · Qualcomm interview: what is a real-time OS, RTOS vs general-purpose OS
   - https://leetcode.com/discuss/post/8365964/qualcomm-senior-engineer-by-anonymous_us-zu9g/
   - https://leetcode.com/discuss/post/297323/qualcomm-swe-new-grad-new-jersey-may-201-a1ii/
36. **rt-scheduling** · qualcomm · Qualcomm interview: best data structure for real-time scheduling
   - https://www.geeksforgeeks.org/?p=140440
37. **rt-scheduling** · qualcomm · Qualcomm interview: software watchdog timers
   - https://www.geeksforgeeks.org/?p=123669
   - https://www.geeksforgeeks.org/?p=140440
38. **threads** · qualcomm · Qualcomm interview: create two threads and make one wait for the other
   - https://leetcode.com/discuss/post/1939505/qualcomm-senior-engineer-hyderabad-april-ffzb/
39. **threads** · qualcomm · Qualcomm interview: how the stack behaves in a multi-threaded program
   - https://leetcode.com/discuss/post/1341747/qualcomm-by-monty4597-ys8n/
40. **threads** · qualcomm · Qualcomm interview: user-level vs kernel-level threads
   - https://leetcode.com/discuss/post/5966607/qualcomm-offcampus-by-anonymous_user-cmcm/
41. **threads** · microsoft · Microsoft interview: implement your own thread pool
   - https://leetcode.com/discuss/post/5020134/microsoft-sde-2-hyderabad-by-anonymous_u-vaqf/
   - https://leetcode.com/discuss/post/6526940/microsoft-interview-experience-sde-2-hyd-mcj3/

Rejected leads (opened but not usable): Blind "apple-interview-aitggvdf" (the concurrency questions there were from an eBay loop, not Apple); Hello Interview bounded-blocking-queue and web-crawler-multithreaded pages (only OpenAI / Anthropic / ServiceTitan listed); aggregator pages (jointaro, prachub, techinterview.org) without a first-hand company report.
