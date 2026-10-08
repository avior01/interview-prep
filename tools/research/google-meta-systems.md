# Research log: Google / Meta, systems topics (cpp, conc, sys, bugs)

Collected 2026-10-08. Each line: company · question idea · URL · opened/snippet · staged in.
"opened" = page read (LeetCode posts via LeetCode's GraphQL endpoint; Blind and GfG via plain fetch).
"snippet" = Glassdoor returned 403; the claim comes from the search-engine snippet of that exact review URL
(each was confirmed with a search on that review id).
Question text in the app is always written in our own words. Staged file suffix: `.researchGM.json`.

## Used as `sources`

### Google
1. Google · implement a mutex using a semaphore · https://www.glassdoor.sg/Interview/Google-Interview-E9079-RVW5189145.htm · snippet · conc/mutex-locks
2. Google (staff embedded, India) · coding round where a spinlock should have been used instead of a mutex · https://www.teamblind.com/post/interviewing-at-google-india-zftgxe5s · opened · conc/mutex-locks
3. Google (L4) · list with non-blocking concurrent reads and an append that waits for ongoing reads/writes · https://leetcode.com/discuss/post/2184334/google-interview-concurrency-by-anonymou-6w26/ · opened · conc/condvars
4. Google (Chrome OS firmware) · watchdog timers in embedded systems · https://www.geeksforgeeks.org/?p=1042307 · opened · conc/rt-scheduling
5. Google (Chrome OS firmware) · function that reads data from a specific memory address · same GfG page · opened · sys/volatile-mmio
6. Google (Chrome OS firmware) · find and fix bugs/vulnerabilities in a firmware snippet · same GfG page · opened · bugs/ub-bugs
7. Google (SRE-SE L3) · Linux internals: inode and its components · https://leetcode.com/discuss/post/6006265/google-sre-se-bangalore-l3-rejected-by-a-pad5/ · opened · sys/syscalls
8. Google (embedded, phone screen) · read_bytes wrapper over a driver read that returns 512-byte blocks · https://leetcode.com/discuss/post/336276/google-embedded-software-engineer-bangal-1w4s/ · opened · sys/syscalls
9. Google (L5/L6) · block device writer with partial-page writes (read, flush, write API) · https://leetcode.com/discuss/post/1690828/google-online-block-driver-by-anonymous_-nd19/ · opened · bugs/off-by-one
10. Google (phone) · memory leak, memory allocation, how processes manage memory (down to kernel) · https://leetcode.com/discuss/post/124994/google-memory-leak-memory-allocation-and-6moo/ · opened · bugs/leaks

### Meta
11. Meta Reality Labs (firmware, in-domain design) · FIFOs and multi-core sync: accessing shared memory from multiple cores · https://www.teamblind.com/post/embedded-software-engineer-firmware-reality-labs-gbdwn5bu · opened · conc/lock-free
12. Meta (screen, Oct 2024) · circular buffer with N-item reads/writes, which corner cases to check · https://www.glassdoor.com.au/Interview/Meta-Interview-E40772-RVW92315228.htm · snippet · bugs/off-by-one
    + Facebook onsite · fixed-capacity Buffer with write(src) / read(n) · https://leetcode.com/discuss/post/354889/facebook-onsite-buffer-by-sithis-z83b/ · opened · same question
13. Meta (embedded) · bit manipulation plus its impact on assembly and CPU cycles · https://leetcode.com/discuss/post/5865751/meta-embedded-engineer-interview-by-anon-a612/ · opened · bugs/overflow
14. Meta (Production Eng.) · processes, parent/child, fork-wait-exec cycle · https://leetcode.com/discuss/post/1789766/facebookmeta-production-engg-intern-londondublin-jan-feb-2022 · opened · sys/processes-threads
15. Meta (Production Eng.) · what happens after typing `ls -l *` in bash · same LeetCode post · opened · sys/syscalls
16. Meta (Production Eng.) · swap, virtual memory, buffer, cache · same LeetCode post · opened · sys/virtual-memory
17. Meta (Production Eng., 2017) · what information is not in the inode · https://www.glassdoor.com.au/Interview/Meta-Interview-E40772-RVW17335216.htm · snippet · sys/syscalls
18. Meta (2010 HR screen) · what is a virtual destructor · https://www.glassdoor.fr/Entretien/Meta-Entretien-E40772-RVW449268.htm · snippet (only Meta page in that result set; id search did not re-surface it) · cpp/polymorphism

## Found but NOT used
- Meta firmware screen · implement 3 functions of a queue circular buffer + code-review "does it compile" question · Glassdoor snippet did not say which review URL.
- Meta firmware (2023) · semaphore vs mutex, SPI/I2C/UART basics · Glassdoor review id not resolvable.
- Meta Reality Labs phone screen · lookup table for runs of 1 bits · already logged in sys.md.
- Meta (Production Eng.) · zombie process, signals · Glassdoor RVW7024735, id search returned nothing for that page.
- Meta (Production Eng.) · how terminal signals reach processes at kernel level · Glassdoor listing page (many reviews).
- Google 2014 firmware · state machine with one input per second; write-to-flash stub · Glassdoor listing, review URL unclear.
- Google (SRE-SE) · ping/awk, bg/fg, screen/tmux · not in our subtopics / too tool-specific.
- Google (Chrome OS firmware) · boot process, UEFI vs BIOS, secure boot · no fitting subtopic.
- Google embedded Blind threads (podplugl, xsnmabrq, qugo2sdj) · only speculation, no reported questions.
- No first-hand Google/Meta source found for: false sharing, cache coherence, vtable internals, move semantics, TPU/silicon systems questions.
