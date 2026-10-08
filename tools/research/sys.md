# Research log: OS / Linux / embedded (sys) and embedded C bugs (bugs)

Collected 2026-10-08. Each line: company · question idea · URL.
F = page opened and read. S = only the search-engine snippet of that specific page
(Glassdoor/LeetCode returned 403). Items with an ambiguous URL (snippet covered two or more
pages) were NOT used for tags and are listed at the bottom.

## Used as `sources` in staging/sys and staging/bugs

### NVIDIA
- NVIDIA · detect endianness at runtime (F) · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-fw-developer/
- NVIDIA · implement memcpy, handle overlap (F) · same FW page
- NVIDIA · compare IPC mechanisms (F) · same FW page
- NVIDIA · stack growth direction (F) · same FW page + https://www.geeksforgeeks.org/interview-experiences/nvidia-software-interview-experience-internship/
- NVIDIA · count set bits two ways (F) · same FW page
- NVIDIA · endianness + LE->BE conversion in constant time (F) · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-set-2-on-campus-for-r-d-team-pune/
- NVIDIA · volatile variables and usage (F) · Set 2 page + https://www.jointaro.com/interviews/companies/nvidia/experiences/systems-software-engineer-santa-clara-ca-march-1-2016-no-offer-negative-588e423c/
- NVIDIA · custom malloc of 16 bytes at a 16-aligned address (F) · Set 2 page
- NVIDIA · why struct members are not contiguous (padding) (F) · Set 2 page + https://www.jointaro.com/interviews/companies/nvidia/experiences/software-intern-united-states-august-29-2024-no-offer-positive-c2429706/
- NVIDIA · what happens when free() is called (F) · Set 2 page
- NVIDIA · process vs thread, how kernel schedules threads vs processes (F) · Set 2 page
- NVIDIA · TLB / look-aside buffer (F) · Set 2 page + https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-set-4-on-campus/ + https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-set-3-campus/
- NVIDIA · priority inversion (F, OS test topic) · Set 2 page; (S) https://www.glassdoor.ie/Interview/NVIDIA-Interview-E7633-RVW21888329.htm
- NVIDIA · what is wrong: function returns a local array (F) · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-set-5/
- NVIDIA · IPC and semaphores between processes (F) · Set 5 page
- NVIDIA · two processes reading each other's variables (F) · Set 3 page
- NVIDIA · memory map of a C program (F) · Set 3 page + internship page
- NVIDIA · killing a parent process, what happens to children (F) · Set 4 page
- NVIDIA · user vs kernel mode, what is a system call (F) · internship page
- NVIDIA · one-level paging, page/frame counts (F) · internship page
- NVIDIA · what is DMA, how it works (F) · internship page
- NVIDIA · memory leak definition and example (F) · internship page
- NVIDIA · row vs column loop for cache performance (F) · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-system-software-engineer-internship/
- NVIDIA · signed vs unsigned output question (F) · same SSE internship page
- NVIDIA · semaphores so thread A prints before thread B (F) · same SSE internship page
- NVIDIA · L1 vs L2 cache (F) · Jointaro 2024 intern page
- NVIDIA · ISR top half / bottom half (F) · Jointaro 2016 page
- NVIDIA · race condition, deadlock prevention (F) · https://www.geeksforgeeks.org/interview-experiences/nvidia-system-software-engineer-intern-on-campus-drive-experience/
- NVIDIA · set/clear/toggle a bit in 32-bit int (F) · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-system-software-engineer-internshipon-campus/ + https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-system-software-engineer/
- NVIDIA · (*p)++ vs *p++ vs *++p (F) · SSE internship on-campus page
- NVIDIA · 32-bit multiply on a 16-bit-multiply ALU (F) · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-system-software-off-campus/
- NVIDIA · locks / sleeping inside an interrupt handler (S) · https://www.glassdoor.com.au/Interview/NVIDIA-Interview-E7633-RVW5298526.htm

### Qualcomm
- Qualcomm · volatile with an ISR-changed variable (F) · https://www.geeksforgeeks.org/?p=477855
- Qualcomm · detect overflow when multiplying two ints (F) · same page
- Qualcomm · detect endianness (F) · same page
- Qualcomm · struct size, padding, avoid by reordering (F) · same page
- Qualcomm · PTE contents, page table size (F) · same page
- Qualcomm · spinlocks / semaphores (F) · same page
- Qualcomm · page fault handling steps (F) · https://www.geeksforgeeks.org/?p=152508
- Qualcomm · steps when an interrupt occurs (F) · same page
- Qualcomm · two-thread counter without mutex gives wrong result (F) · same page
- Qualcomm · priority inversion (F) · https://www.geeksforgeeks.org/?p=334558
- Qualcomm · memory segments, initialized vs uninitialized globals (F) · same page
- Qualcomm · set/clear bit k macro (F) · same page
- Qualcomm · 64-bit timer from two 32-bit registers (F) · https://www.geeksforgeeks.org/?p=563889
- Qualcomm · ISR vs normal function (F) · same page
- Qualcomm · find errors in short C program (uninitialized pointer) (F) · https://www.geeksforgeeks.org/?p=123669
- Qualcomm · getting data out of a function whose locals are gone (F) · same page
- Qualcomm · library call vs system call (F) · same page
- Qualcomm · malloc(0), how free knows the size; memcpy vs memmove; MMU (F) · https://geeksforgeeks.org/qualcomm-interview-experience-off-campus-2021
- Qualcomm · pipes, FIFOs, message queues with code (F) · https://www.geeksforgeeks.org/?p=666546
- Qualcomm · why cache invalidation around DMA, what is an IOMMU (S) · https://static.glassdoor.it/Interview/Qualcomm-Staff-Engineer-Interview-Questions-EI_IE640.0,8_KO9,23_IP2.htm

### Intel
- Intel · cache and TLB (F) · https://www.geeksforgeeks.org/?p=166065
- Intel · checking for stack overflow / measuring stack use (F) · same page
- Intel · int *const p vs const int *p (F) · same page
- Intel · page fault, why virtual memory (F) · https://www.geeksforgeeks.org/?p=296416
- Intel · CPU scheduling algorithms (F) · https://www.geeksforgeeks.org/?p=136164
- Intel · how the processor handles an interrupt, MMU role (F) · https://www.geeksforgeeks.org/?p=130688
- Intel · power-of-two check with one bit operation (F) · same page
- Intel · what is DMA, IOMMU (S) · https://www.glassdoor.com/Interview/Intel-Corporation-Interview-E1519-RVW3166757.htm

### Microsoft
- Microsoft · 4GB RAM, four 2GB processes (F) · https://www.geeksforgeeks.org/?p=338497
- Microsoft · what limits process size if not RAM (F) · same page
- Microsoft · end-to-end access of node->val, paging/TLB (F) · same page
- Microsoft · semaphore vs mutex vs spinlock (F) · same page
- Microsoft · while(1) process and the scheduler (F) · same page
- Microsoft · page replacement algorithms (F) · same page
- Microsoft · rand() vs rand_r() thread safety (F) · same page
- Microsoft · buggy isPowerOfTwo (returns true for 0) (F) · https://www.geeksforgeeks.org/microsoft-interview-experience-set-106/
- Microsoft · int on stack vs new int, effect with many threads (F) · same page
- Microsoft · Chrome tab: process or thread (F) · https://www.geeksforgeeks.org/interview-experiences/microsoft-interview-experience-set-126-campus-internship/
- Microsoft · multiple processes sharing a resource (shm + semaphore) (F) · same page
- Microsoft · thread-safe BitSet with mutexes (F) · https://www.geeksforgeeks.org/interview-experiences/microsoft-interview-experience-set-111-1-5-years-experienced/
- Microsoft · what threads share with the process (F) · https://www.geeksforgeeks.org/interview-experiences/microsoft-interview-experience-set-49-internship/

### Amazon
- Amazon · program larger than RAM, page fault, thrashing, system call (F) · https://www.geeksforgeeks.org/interview-experiences/amazon-interview-experience-sde1-off-campus-2/
- Amazon · Belady's anomaly, page fault handling (F) · https://www.geeksforgeeks.org/interview-experiences/amazon-interview-experience-399-campus-full-time/
- Amazon · scheduling algorithms, threads vs multiprocessing (F) · same page
- Amazon · detect deadlock in a wait-for graph (F) · https://www.geeksforgeeks.org/amazon-interview-experience-sde-i/
- Amazon · thrashing vs caching (F) · https://www.geeksforgeeks.org/amazon-interview-experience-for-sde-1-6-months-experienced-off-campus/

### Apple
- Apple · aligned_malloc / aligned_free (S) · https://www.glassdoor.co.uk/Interview/Apple-Interview-E1138-RVW99250603.htm
- Apple · semaphore vs mutex; set-bit / get-bit in C (F) · https://www.teamblind.com/post/apple-emdedded-swe-interview-7ewyjstw
- Apple · find bugs in firmware C code (F) · https://www.teamblind.com/post/apple-interview-embedded-software-engineer-algorithm-questions-anmuulm4
- Apple · check endianness (Core OS kernel CoderPad) (S) · https://leetcode.com/discuss/post/7874360/apple-kernel-engineer-core-os-interview-lmh7t/

### Meta
- Meta · bit manipulation with a lookup table, run of consecutive 1 bits (F) · https://www.teamblind.com/post/firmware-interview-full-loop-at-meta-reality-labs-uqmfofhd

### Google
- Google · disable interrupts before taking a spinlock shared with an ISR (S) · https://static.glassdoor.nl/Interview/Google-Interview-E9079-RVW597517.htm

## Found but NOT used (URL ambiguous or company tie weak)
- Intel · MSI/MESI state transitions · Glassdoor RVW1327818 or RVW326742 (snippet did not say which)
- Intel · measure L1 size in C · same ambiguity
- Intel · what happens when you call malloc; page faults with two processes · RVW20321317 or RVW90894720
- Microsoft · volatile vs static · one of three Glassdoor reviews
- Apple · interrupts/polling/DMA, scheduling/IRQs, volatile/binary semaphore/static · Glassdoor listing pages (several reviews per page)
- Apple · fork/exec/wait, signals (LeetCode 707265) · post covers three companies
- Apple · software timer, memory faults (RVW95113107) · too vague
- NVIDIA · OS/GPU race with a register · no URL
- No source found for: fork() semantics, false sharing, cache associativity, off-by-one bugs at a named company.
