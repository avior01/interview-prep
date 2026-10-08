# Research log: algorithms A (arrays, strings, hashing, two pointers, sliding window, prefix sums, binary search, stacks, linked lists, complexity)

Collected 2026-10-08. Each line: company · problem · URL of the interview report that names the company.
All pages were opened (GeeksforGeeks via WebFetch; LeetCode Discuss posts via LeetCode's post data, since
the HTML returns 403) unless marked "(search snippet)". Staged in `staging/alg/<subtopic>.researchA.json`.

## Used (55 problems)

### linked-lists
- Microsoft · Odd-position nodes, then even-position nodes reversed · https://www.geeksforgeeks.org/?p=164239
- Microsoft · Merge two sorted linked lists into descending order · https://www.geeksforgeeks.org/?p=164239
- Microsoft, Amazon · LeetCode 369 · Plus One Linked List · https://www.geeksforgeeks.org/?p=164239 · https://www.geeksforgeeks.org/?p=141850
- Microsoft · Odd values before even values in a linked list (stable) · https://www.geeksforgeeks.org/?p=138852
- Microsoft · Delete every nth node of a linked list · https://www.geeksforgeeks.org/?p=138852
- Amazon · XOR linked list · https://www.geeksforgeeks.org/?p=274181
- NVIDIA · Node at the 3/4 position of a linked list · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-set-3-campus/
- Intel · Add two polynomials represented as linked lists · https://www.geeksforgeeks.org/interview-experiences/intel-interview-experience-for-gpu-sde-internship-off-campus/
- Qualcomm · Reverse a doubly linked list · https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-for-sde-off-campus-2023/
- Qualcomm · Print a linked list in reverse without reversing it · https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-off-campus-2021-virtual/

### stacks (incl. queues)
- NVIDIA, Qualcomm · Implement a stack using a linked list · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-set-2-on-campus-for-r-d-team-pune/ · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-set-5/ · https://www.geeksforgeeks.org/?p=250860
- Intel · Double-ended stack (push/pop at both ends; array and linked list) · https://www.geeksforgeeks.org/interview-experiences/intel-interview-experience-set-3-graphics-sw-engineer-position/
- Microsoft, Qualcomm · Queue on a linked list (Microsoft follow-up: make it thread-safe) · https://www.geeksforgeeks.org/?p=156607 · https://www.geeksforgeeks.org/?p=152863
- Apple · LeetCode 1047 · Remove All Adjacent Duplicates In String · https://leetcode.com/discuss/interview-question/5780700/
- Apple · LeetCode 362 · Design Hit Counter · https://leetcode.com/discuss/interview-question/2432962/ · https://leetcode.com/discuss/interview-question/5457845/
- Amazon · Water drop problem (≈ LeetCode 853 Car Fleet) · https://www.geeksforgeeks.org/?p=358537

### hashing
- NVIDIA · Most frequent character in a string · https://www.geeksforgeeks.org/interview-experiences/nvidia-system-software-engineer-intern-on-campus-drive-experience/
- Microsoft · Remove from s1 all characters of s2, in place · https://www.geeksforgeeks.org/?p=174358
- Microsoft · Reconstruct the trip from a list of tickets · https://www.geeksforgeeks.org/?p=156607
- Microsoft · Count triplets with product m (distinct values) · https://www.geeksforgeeks.org/?p=150449
- Amazon · k-th distinct (non-repeating) element · https://www.geeksforgeeks.org/?p=274181
- Amazon · LeetCode 765 · Couples Holding Hands (min swaps to seat pairs together) · https://www.geeksforgeeks.org/?p=137084 · https://www.geeksforgeeks.org/?p=141850
- Google · LeetCode 2034 · Stock Price Fluctuation (stream with corrections; max/min/current) · https://geeksforgeeks.org/google-interview-experience-for-sde-2024
- Meta · LeetCode 953 · Verifying an Alien Dictionary (+ follow-up: ignore unknown chars) · https://leetcode.com/discuss/interview-question/422366/ · https://leetcode.com/discuss/interview-question/615864/
- Meta · LeetCode 166 · Fraction to Recurring Decimal · https://leetcode.com/discuss/interview-question/631989/
- Apple · Group strings that are rotations of each other · https://leetcode.com/discuss/interview-question/865428/

### two-pointers
- Microsoft · Closest triple from three sorted arrays · https://www.geeksforgeeks.org/?p=164239
- Microsoft · Negatives before positives, stable, in place · https://www.geeksforgeeks.org/?p=139661
- Microsoft · Substring match with ^ and $ anchors · https://www.geeksforgeeks.org/?p=138852
- Microsoft · Next palindrome greater than a number given as a string · https://www.geeksforgeeks.org/?p=214227
- Microsoft · Double equal adjacent numbers, then move zeros to the end · https://www.geeksforgeeks.org/?p=165104
- Microsoft · Maximum j − i with a[j] > a[i] · https://www.geeksforgeeks.org/?p=165104
- Meta · Intersection of two sorted arrays with duplicates (+ max-count follow-up) · https://leetcode.com/discuss/interview-question/422366/
- Meta · LeetCode 896 · Monotonic Array · https://leetcode.com/discuss/interview-question/591007/
- Amazon · Check if one array is a subarray of another without extra space · https://www.geeksforgeeks.org/?p=340883

### sliding-window
- Microsoft · Sum over windows of size k of the count of elements appearing once · https://www.geeksforgeeks.org/?p=135603
- Amazon · LeetCode 632 · Smallest Range Covering Elements from K Lists · https://www.geeksforgeeks.org/?p=141850
- Amazon · Longest subarray whose product equals its LCM · https://www.geeksforgeeks.org/?p=340883
- Meta · LeetCode 480 · Sliding Window Median · https://leetcode.com/discuss/interview-question/6089349/
- Apple · LeetCode 862 · Shortest Subarray with Sum at Least K · https://leetcode.com/discuss/interview-question/758045/

### prefix-sums
- Meta, NVIDIA · Point covered by the most intervals · https://leetcode.com/discuss/interview-question/396248/ · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-compiler-intern-6-months/
- Meta · Count of 1s in a range of a huge 0/1 array · https://leetcode.com/discuss/interview-question/383819/
- Apple · Longest subarray with sum at most K (negatives allowed; follow-up to 862) · https://leetcode.com/discuss/interview-question/758045/

### binary-search
- Amazon · Row with the maximum number of 1s · https://www.geeksforgeeks.org/?p=137084
- Google · Most frequent letter in a sorted string of uppercase letters · https://leetcode.com/discuss/post/5865405/google-l2-interview-by-anonymous_user-d04z/ (search snippet; page returns 403)
- Meta · LeetCode 278 · First Bad Version · https://leetcode.com/discuss/interview-experience/1074741/
- Meta · Count distinct values in a sorted array faster than O(n) · https://leetcode.com/discuss/interview-question/629432/
- Qualcomm · Index of the first 1 in an infinite sorted 0/1 array · https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-for-staff-engineer/

### complexity
- NVIDIA · Complexity of power(x, n) that recurses twice on n/2 · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-sde-2/
- NVIDIA · Row-wise vs column-wise loop order (cache) · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-system-software-engineer-internship/
- NVIDIA, Intel · LeetCode 172 · Factorial Trailing Zeroes · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-set-1/ · https://www.geeksforgeeks.org/interview-experiences/intel-interview-experience-for-intership-on-campus/
- NVIDIA · Convert a 4D tensor from NCHW to NHWC · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-sde-2/
- Amazon · Data structure with O(1) insert/remove/findMax/deleteMax (impossibility; Max Stack) · https://www.geeksforgeeks.org/?p=132884
- Amazon · Count inversions · https://www.geeksforgeeks.org/?p=132884
- Google · Position of an element if an unsorted array were sorted (+ follow-up: given an index) · https://www.geeksforgeeks.org/?p=667198

## Found but not used (candidates for later)
- Microsoft · Union and intersection of two linked lists · https://www.geeksforgeeks.org/?p=174358
- Microsoft · Delete common characters, then append the second string's unique characters · https://www.geeksforgeeks.org/?p=156607 (used only as an untagged variant)
- Microsoft · Find two missing numbers in 1..N · https://www.geeksforgeeks.org/?p=214227
- Amazon · Multiply two polynomials as linked lists · https://www.geeksforgeeks.org/?p=132884
- Amazon · Words that appear at least K times in a file · https://www.geeksforgeeks.org/?p=132884
- Google · Top k users by number of words in a chat log · https://www.geeksforgeeks.org/?p=667198
- Google · All occurrences of a pattern (explain the hashing; why linear) · https://geeksforgeeks.org/google-interview-experience-for-sde-2024
- NVIDIA · Split a sentence into rows of a 2D char array (C) · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-compiler-engineer/
- NVIDIA · Hex string to decimal · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-fw-developer/
- NVIDIA · Binary search complexity and binary search on a linked list · https://www.geeksforgeeks.org/interview-experiences/nvidia-software-interview-experience-internship/
- Intel · Second-largest value in a 2D array without sorting · https://www.geeksforgeeks.org/interview-experiences/intel-interview-experience-on-campus-2023/
- Intel · Remove duplicate characters from a string · https://www.geeksforgeeks.org/interview-experiences/intel-interview-experience-for-graduate-intern-on-campus/
- Intel · Days with most check-ins/check-outs · https://www.geeksforgeeks.org/interview-experiences/intel-interview-experience-set-4-campus-full-time/
- Qualcomm · Delete a given node from a circular linked list · https://www.geeksforgeeks.org/?p=153966
- Qualcomm · Unique elements in an array; array subset of another · https://www.geeksforgeeks.org/?p=152564
- Qualcomm · Duplicates in a linked list; detect and remove a loop · https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-for-software-engineer-role-on-campus-placements/
- Qualcomm · Delete nodes greater than X; LeetCode 1290 Convert Binary Number in a Linked List to Integer · https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-off-campus-2021-2/
- Qualcomm · Move last node to front; insert a name into a sorted list; reverse odd-position words; binary runs to decimal · https://www.geeksforgeeks.org/interview-experiences/qualcomm-fte-interview-experience-for-software-engineer-on-campus/
- Meta · Merge 3 sorted arrays without duplicates · https://leetcode.com/discuss/interview-question/568482/
- Meta · Split an array into two equal-sum parts · https://leetcode.com/discuss/interview-question/391865/
- Meta · Merge two interval lists · https://leetcode.com/discuss/interview-question/5743575/
- Meta · Add two decimal number strings · https://leetcode.com/discuss/interview-question/551052/
- Meta · LeetCode 1424 · Diagonal Traverse II · https://leetcode.com/discuss/interview-question/5762396/
- Apple · First element that appears once (sorted follow-up) · https://leetcode.com/discuss/interview-question/669304/
- Apple · Two users related if timestamps within t · https://leetcode.com/discuss/interview-question/2583977/
- Apple · Skip sections from a 1 to the next 0 · https://leetcode.com/discuss/interview-question/5531432/
