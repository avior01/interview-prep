# Research log: Google and Meta coding problems (algorithms)

Collected 2026-10-08. Each line: company · problem · URL · how it was read.
"opened" = the post body was read through LeetCode's public GraphQL endpoint
(`ugcArticleDiscussionArticle(topicId)`), because the Discuss HTML returns 403. The post
title or body names the company. Staged in `staging/alg/<subtopic>.researchGM.json`
(4 questions per problem: tagged phone + tagged code + 2 untagged variants).

Every answer, example and trace was checked by running code: Python reference solutions
against brute force, and every C++ modelAnswer (g++ -std=c++20) against those references
on random inputs (6,400+ cases). Every Python modelAnswer was tested the same way.

## Used (24 problems: 14 Google, 10 Meta)

### heaps
- Google · Top k elements of a max-heap array without modifying it · https://leetcode.com/discuss/interview-question/175551/ · opened
- Meta · Sorted iterator over k sorted lists (phone screen) · https://leetcode.com/discuss/interview-question/169334/ · opened

### tries
- Google · Dictionary lookup by a pattern (≈ LeetCode 211, wildcards) (phone screen) · https://leetcode.com/discuss/interview-question/284757/ · opened. The post says "regular expression" without detail; the questions use the standard '.' wildcard reading.

### intervals
- Google · Is an interval fully covered by a list of intervals · https://leetcode.com/discuss/interview-question/339628/ · opened
- Meta · Download manager: is the file complete after each chunk (stream of unsorted intervals) · https://leetcode.com/discuss/interview-question/1140838/ · opened

### greedy
- Meta · Fewest intervals that cover a target interval (≈ LeetCode 1024 Video Stitching) · https://leetcode.com/discuss/interview-question/124825/ · opened
- Google · Largest number from a length-k subsequence of digits (screening) · https://leetcode.com/discuss/post/6022021/ · opened

### dp
- Google · LeetCode 1937 · Maximum Number of Points with Cost (phone screen) · https://leetcode.com/discuss/interview-question/1546118/ · opened
- Meta · LeetCode 1269 · Number of Ways to Stay in the Same Place After Some Steps (phone, E5) · https://leetcode.com/discuss/interview-question/882489/ · opened
- Meta · LeetCode 329 · Longest Increasing Path in a Matrix (phone, E4) · https://leetcode.com/discuss/interview-question/1162082/ · opened

### backtracking
- Meta · Insert + / − between the digits 1–9 to reach a target (phone screen) · https://leetcode.com/discuss/interview-question/330653/ · opened
- Meta · Word break where each word has a usage limit (onsite) · https://leetcode.com/discuss/interview-question/338192/ · opened

### graphs
- Google · LeetCode 1857 · Largest Color Value in a Directed Graph (onsite) · https://leetcode.com/discuss/interview-question/277534/ · opened
- Meta · Heaviest path between two nodes in a weighted DAG (onsite) · https://leetcode.com/discuss/interview-question/1302130/ · opened
- Google · Best chain of 4 cities linked by flights (≈ LeetCode 2242) (onsite) · https://leetcode.com/discuss/interview-question/1621880/ · https://leetcode.com/discuss/interview-question/1879225/ · both opened (the second says it got the exact same question at Google)

### bfs-dfs
- Meta · Shortest path in a maze, return the path itself (E4 phone screen) · https://leetcode.com/discuss/interview-question/1703579/ · opened
- Meta · LeetCode 695 · Max Area of Island (onsite) · https://leetcode.com/discuss/post/5531084/ · opened

### sliding-window
- Google · Camera direction that captures the most buildings (circular window over angles) · https://leetcode.com/discuss/post/3549864/ · opened
- Google · LeetCode 727 · Minimum Window Subsequence (phone) · https://leetcode.com/discuss/interview-question/453517/ · opened

### prefix-sums
- Google · Days when everyone (or at least P people) is available, from per-person unavailable blocks (L4 onsite) · https://leetcode.com/discuss/post/6735411/ · opened
- Google · Minimum cost to equalize building heights by lowering or razing (phone) · https://leetcode.com/discuss/post/2269400/ · opened

### binary-search
- Google · Count binary-searchable elements in an unsorted array (onsite) · https://leetcode.com/discuss/interview-question/879774/ · opened
- Google · Count intervals that contain each query point (phone screen) · https://leetcode.com/discuss/interview-question/1744097/ · opened
- Google · Number of subsets with min + max ≤ K (≈ LeetCode 1498) (onsite) · https://leetcode.com/discuss/interview-question/268604/ · opened

## Found but not used
- Meta · LeetCode 139 Word Break with a trie dictionary (5483553): LeetCode 139 is already in the app.
- Meta · Subarray sum equals k, true/false + 2D follow-up (6548438): LeetCode 560 and 1074 already in the app.
- Meta · Maximum vacation days with PTO (412764): same as LeetCode 1004, already in the app.
- Meta · LeetCode 340 Longest Substring with At Most K Distinct Characters (358505): left out to keep the sliding-window batch small.
- Meta · Minimizing permutations by reversals (1137426, 611178): from the Facebook practice portal, not a reported interview.
- Meta · Merge two interval lists, Range Sum of BST, Next Permutation, Valid Word Abbreviation, Simplify Path, K Closest Points (several posts): already in the app.
- Google · Count strings with a given prefix in a sorted list (5635549): already in the app.
- Google · House Robber variant (5101425): LeetCode 198 already in the app.
- Google · Longest string chain by removing one character down to length 1 (1879225): close to LeetCode 1048; left for a later batch.
- Google · Max sum of K elements from both ends (701938): LeetCode 1423 already in the app.
- Google · Tower of height n with 1×3, 2×3, 3×3 blocks (1986328): the post's own counting of n = 3 is unclear about rotations.
- Google · Minimum number of train stops (124552): the post's definition of "stops" is ambiguous.
- Google · Word extensions / spell checker (345065): string problem, no thin subtopic fit.
