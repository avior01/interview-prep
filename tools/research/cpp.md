# C++ interview research log (sourced items)

Collected 2026-10-08. Format: company · question idea · URL(s).
"(snippet)" = the page itself could not be opened (HTTP 403); the claim comes from the
search-engine snippet of that exact page. Everything else was opened and read.
Question text in the app is always written in our own words.

## polymorphism
1. NVIDIA · how virtual functions are implemented (vptr / vtable) · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-set-3-campus/ , https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-set-4-on-campus/ , https://www.geeksforgeeks.org/interview-experiences/nvidia-software-interview-experience-internship/
2. NVIDIA, Microsoft, Amazon · what is a virtual destructor · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-set-3-campus/ , https://www.geeksforgeeks.org/interview-experiences/microsoft-idc-interview-experience-set-177-on-campus/ , https://www.geeksforgeeks.org/interview-experiences/amazon-interview-experience-sde1-off-campus-3/
3. Microsoft · compile-time vs run-time polymorphism, overloading vs overriding · https://www.geeksforgeeks.org/interview-experiences/microsoft-idc-interview-experience-set-177-on-campus/ , https://www.geeksforgeeks.org/interview-experiences/microsoft-idc-internship-interview-experience-on-campus/ , https://prachub.com/interview-questions/discuss-mutexes-memory-alignment-polymorphism-idempotency
4. NVIDIA, Intel, Qualcomm · abstract class / pure virtual function · https://www.geeksforgeeks.org/interview-experiences/nvidia-software-interview-experience-internship/ , https://www.geeksforgeeks.org/interview-experiences/intel-interview-experience-set-4-campus-full-time/ , https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-off-campus-2/
5. NVIDIA, Intel · output questions on virtual functions + copy constructor · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-sde-2/ , https://www.geeksforgeeks.org/interview-experiences/intel-interview-experience-set-2-on-campus-for-full-time/
6. Amazon · what is a private constructor · https://www.geeksforgeeks.org/interview-experiences/amazon-interview-experience-sde1-off-campus-3/
7. NVIDIA · "how would you implement virtual functions if you wrote the compiler" · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-set-2-on-campus-for-r-d-team-pune/
8. Intel · difference between class and struct · https://www.geeksforgeeks.org/interview-experiences/intel-graphics-software-engineer-interview-experience/

## const-constexpr (static, volatile, macros, singleton)
9. NVIDIA, Qualcomm · implement a Singleton (private ctor/dtor, static object) · https://www.geeksforgeeks.org/interview-experiences/nvidia-software-interview-experience-internship/ , https://www.geeksforgeeks.org/interview-experiences/qualcomm-fte-interview-experience-for-software-engineer-on-campus/
10. Qualcomm, NVIDIA, Intel · macro vs inline function · https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-off-campus-2020/ , https://prachub.com/interview-questions/explain-cplusplus-and-gpu-tradeoffs , https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-set-1/ , https://www.geeksforgeeks.org/interview-experiences/intel-graphics-software-engineer-interview-experience/
11. Qualcomm, NVIDIA · volatile keyword · https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-off-campus-2020/ , https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-for-wifi-sw-developer-2-years-exp/ , https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-off-campus-2021/ , https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-set-2-on-campus-for-r-d-team-pune/
12. Qualcomm, Intel, NVIDIA · meanings of `static` (variable, function) · https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-for-wifi-sw-developer-2-years-exp/ , https://www.geeksforgeeks.org/interview-experiences/intel-interview-experience-for-internship-on-campus/ , https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-system-software-engineer/
13. NVIDIA · output of a program with a static variable inside recursion · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-set-3-campus/
14. Qualcomm · written test: find the error line in C++ snippets (constructors, const members, object initialization) · https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-for-software-engineer-role-on-campus-placements/

## pointers-refs
15. Intel, Qualcomm · `int* const` vs `const int*` · https://www.geeksforgeeks.org/interview-experiences/intel-interview-experience-set-4-campus-full-time/ , https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-off-campus-2020/ , https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-set-20-on-campus-iiitd/
16. Qualcomm · pointer / double-pointer output question · https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-for-swe-on-campus-2023/ , https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-off-campus-2/
17. NVIDIA, Qualcomm · find the error: call by value instead of by reference · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-system-software-engineer-internship/ , https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-compiler-intern-6-months/ , https://www.geeksforgeeks.org/interview-experiences/qualcomm-fte-interview-experience-for-software-engineer-on-campus/
18. Qualcomm · dangling / wild pointers · https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-for-ml-and-system-engineer/ , https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-off-campus-2/
19. NVIDIA, Qualcomm · function pointers and their uses · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-set-2-on-campus-for-r-d-team-pune/ , https://www.geeksforgeeks.org/interview-experiences/nvidia-software-interview-experience-internship/ , https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-off-campus-2020/

## memory-layout
20. Intel · `struct Node { int data; Node next; }` without `*` + its size · https://www.geeksforgeeks.org/interview-experiences/intel-interview-experience-for-graduate-intern-on-campus/
21. NVIDIA, Qualcomm · code to detect little/big endian · https://leetcode.com/discuss/post/4032849/nvidia-interview-off-campus-2023 , https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-fw-developer/ , https://www.geeksforgeeks.org/interview-experiences/qualcomm-fte-interview-experience-for-software-engineer-on-campus/ , https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-for-software-engineer-role-on-campus-placements/
22. Qualcomm · union of int and char: which byte does the char see · https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-off-campus-2020/
23. NVIDIA · structure padding and the offset operator · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-sde-2/
24. NVIDIA · macro that aligns a size up to a power of 2 / aligned malloc · https://www.aced.io/experiences/nvidia-software-engineer-interview-90647e , https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-sde-2/
25. NVIDIA · small-string class: sizeof with tiny buffer on 32/64-bit, memcpy vs strncpy · https://prachub.com/interview-questions/optimize-a-small-string-cplusplus-class
26. NVIDIA, Qualcomm · which variable lives in which memory segment · https://www.geeksforgeeks.org/interview-experiences/nvidia-software-interview-experience-internship/ , https://leetcode.com/discuss/post/4032849/nvidia-interview-off-campus-2023 , https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-off-campus-2/
27. NVIDIA, Qualcomm · determine whether the stack grows up or down · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-fw-developer/ , https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-off-campus-2020/
28. NVIDIA · 2D array: row-wise vs column-wise loop, which is preferred · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-system-software-engineer-internship/
29. Qualcomm · reason about output of a program with enum + struct (default enum values, aggregate init) · https://prachub.com/interview-questions/explain-cplusplus-and-gpu-tradeoffs

## ub
30. NVIDIA · output of printf with several a++ / ++a in one call · https://leetcode.com/discuss/post/4032849/nvidia-interview-off-campus-2023
31. NVIDIA · signed vs unsigned int output question · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-system-software-engineer-internship/
32. Qualcomm · what does malloc(0) return · https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-off-campus-2021/
33. Qualcomm, NVIDIA · memcpy vs memmove (overlap) · https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-off-campus-2021/ , https://www.aced.io/experiences/nvidia-software-engineer-interview-90647e , https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-fw-developer/

## smart-pointers
34. NVIDIA · implement a (thread-safe) reference-counted shared pointer · https://prachub.com/interview-questions/implement-a-thread-safe-reference-counted-smart-pointer-in-cplusplus , https://static.glassdoor.at/Interview/NVIDIA-Interview-E7633-RVW100852741.htm (snippet)
35. NVIDIA · atomic reference count and memory ordering in that pointer · https://prachub.com/interview-questions/implement-a-thread-safe-reference-counted-smart-pointer-in-cplusplus
36. Microsoft · free heap memory automatically at scope exit → write a smart pointer class (operator*, operator->, destructor) · https://www.naukri.com/code360/interview-experiences/microsoft/microsoft-interview-experience-by-gaurav-kaushik-feb-2019-exp-0-2-years (snippet)

## raii
37. Microsoft · implement `cp`, then RAII for descriptors, copy/move of the owner, not leaving half-written DEST · https://prachub.com/interview-questions/implement-the-linux-cp-command-then-explain-its-os-and-cplusplus-internals
38. NVIDIA, Intel · new vs malloc, delete vs free, how an object is created · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-fw-developer/ , https://www.geeksforgeeks.org/interview-experiences/intel-interview-experience-set-4-campus-full-time/
39. NVIDIA · output questions on constructor and destructor order · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-sde-2/

## move-semantics
40. Apple · write a usage example for a move-only resource-owning class; what compiles and why · https://prachub.com/interview-questions/write-a-usage-example-for-a-resource-owning-cplusplus-class-and-explain-its-semantics
41. NVIDIA · explain move semantics and const-correctness with examples · https://prachub.com/interview-questions/demonstrate-software-engineering-fundamentals

## stl
42. Qualcomm · implement the iterator of a vector · https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-for-staff-engineer/
43. Qualcomm, NVIDIA · how std::vector works internally · https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-for-graphics-software-engineer-off-campus-2024/ , https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-fw-developer/
44. NVIDIA, Microsoft · hash map without STL / hash function design; why hashing raw object memory is unsafe · https://www.aced.io/experiences/nvidia-software-engineer-interview-90647e , https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-experience-for-compiler-engineer/ , https://prachub.com/interview-questions/design-a-dictionary-for-heterogeneous-key-and-value-types

## templates
45. NVIDIA · what exactly happens when a template is used (instantiation) · https://www.geeksforgeeks.org/interview-experiences/nvidia-interview-set-2-on-campus-for-r-d-team-pune/ , https://leetcode.com/discuss/post/4032849/nvidia-interview-off-campus-2023
46. Intel · what is a template and why do we need templates · https://www.geeksforgeeks.org/interview-experiences/intel-graphics-software-engineer-interview-experience/

## lambdas
47. NVIDIA · memory safety of closures that capture references · https://www.glassdoor.com.au/Interview/NVIDIA-Interview-E7633-RVW84770937.htm (snippet)
48. Qualcomm · advantage of function pointers over direct calls (answered with C++11 lambdas) · https://www.geeksforgeeks.org/interview-experiences/qualcomm-interview-experience-set-20-on-campus-iiitd/

## exceptions
49. Apple · resource-owning class whose methods throw length_error / out_of_range; demonstrate failure paths · https://prachub.com/interview-questions/write-a-usage-example-for-a-resource-owning-cplusplus-class-and-explain-its-semantics

Total: 49 sourced items.
