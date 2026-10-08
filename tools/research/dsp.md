# DSP / SDR / wireless: sourced interview questions (research 2026-10-08)

Format: company · question idea · URL (role, date of report).
Every URL below was opened in a real browser session (Glassdoor interview-question pages and the
listing cards that link to them); each page names the company where the question was asked.
Report text is not copied; the staged questions are written in our own words.
Items already covered by content/dsp/interview.json (2-20 kHz sampling, FIR vs IIR basics, CP role,
32-bit multiply with 8-bit multipliers, overlap-save, ZF/MMSE, CFO, ...) were skipped.
GD = https://www.glassdoor.com/Interview

## fft
1. Texas Instruments · spectrum = two rects at ±100 MHz, 5 MHz wide: time signal, real or not · GD/Given-the-frequency-spectrum-of-a-certain-signal-that-looked-like-two-square-pulses-centred-at-100Mhz-with-bandwidth-5Mh-QTN_8706662.htm (Signal Processing Engineer, 2025-12)
2. Texas Instruments · use a 512-point DFT device for a 256-length sequence · GD/A-certain-device-is-capable-of-computing-the-DFT-of-a-512-length-sequence-Can-we-use-this-device-to-compute-the-DFT-of-a-2-QTN_8706663.htm (Signal Processing Engineer, 2025-12)
3. Microsoft · convolution in time vs frequency domain · GD/One-of-the-questions-I-was-asked-during-the-phone-screen-was-to-describe-the-difference-between-convolution-in-the-time-dom-QTN_4056159.htm (Audio Signal Processing Engineer, 2020-12)
4. Qualcomm · Fourier pairs: sine, impulse, rect, sinc, sinc^2, impulse train; AWGN · GD/Asked-about-Return-loss-VSWR-S-matrix-network-analyser-How-does-a-sine-wave-Impulse-rect-sinc-sinc-2-train-of-im-QTN_2140319.htm (RF Systems Engineer, 2017-07)
5. Meta · reverse the bits of a 32-bit word (DSP Software Engineer) · GD/En-la-primer-entrevista-tuve-que-revertir-los-bits-de-una-palabra-de-32-bits-QTN_8391957.htm (2025-07)

## windows
6. Qualcomm · RBW of a spectrum analyzer (with Nyquist, aliasing, NF) · GD/Niquist-theorem-Noise-figure-Aliasing-Return-Loss-RBW-of-spectrum-analyser-Smith-chart-Walsh-code-Fourier-Transform-QTN_1811785.htm (RF Systems Engineer, 2016-12)

## sampling
7. Apple · sample and reconstruct a 2 kHz tone at 3 kHz · GD/What-is-the-result-of-sampling-and-reconstructing-a-2-khz-tone-with-3-khz-sampling-frequency-QTN_1527167.htm (Algorithms Engineer, 2016-05)
8. Apple · why IQ conversion in a transceiver · GD/Give-the-below-circuit-how-much-power-will-be-transfered-how-to-find-the-total-noise-power-at-the-output-Why-is-IQ-conver-QTN_6986893.htm (RF Systems Engineer, 2024-02)
9. Samsung Research America · dynamic range of a sigma-delta ADC · GD/about-dynamic-rage-of-sigma-delta-ADC-QTN_546812.htm (RF Systems Engineer, 2013-11)

## filters
10. Qualcomm · what filter is y[n] = (1/M)·sum_{i=0..M} x[n-i] · GD/What-kind-of-filter-is-this-y-n-summation-from-i-0-to-i-M-1-M-x-n-i-QTN_225745.htm (DSP and Firmware Developer, 2012-01)
11. Qualcomm · FIR filter coding from scratch in C (same report also: pink vs white noise) · GD/Questions-based-on-the-resume-sampling-theorem-autocorrelation-FIR-vs-IIR-pink-and-amp-white-noise-FIR-filter-coding-fr-QTN_8199538.htm (Audio Signal Processing, 2025-05)
12. Qualcomm · purpose of pulse shaping · GD/What-is-the-purpose-of-pulse-shaping-QTN_1623659.htm (Wireless Systems Engineer, 2016-07)
13. Apple · derive the group delay of a non-linear-phase filter · GD/Homework-Derive-group-delay-of-a-non-linear-phase-filter-Write-a-program-to-shuffle-cards-in-a-particular-manner-until-QTN_695787.htm (Multitouch Sensor Algorithm Engineer, 2014-06)
14. Apple · mean vs median filter; moving average effect on noise std · GD/What-is-the-difference-between-mean-and-median-filter-If-you-apply-a-moving-average-filter-to-a-signal-what-would-happ-QTN_2507036.htm (Algorithm Engineer, 2018-02)
15. Broadcom · RLS vs gradient-descent (LMS) adaptive filter · GD/A-engineer-asked-me-What-is-the-difference-between-RLS-adaptive-filter-and-gradient-descent-filter-At-which-situation-you-QTN_767471.htm (Digital Communication System Engineer, 2014-10)
16. Google · IIR vs FIR filters (audio DSP) · GD/Describe-the-difference-between-IIR-and-FIR-filters-QTN_7166714.htm (Audio DSP Engineer, 2024-04)
17. Qualcomm · convolve a positive signal with itself many times: resulting shape · GD/convolution-of-a-positive-signal-with-itself-many-number-of-times-will-result-in-what-kind-of-waveform-QTN_2576020.htm (Modem Systems Engineer, 2018-04)
18. Qualcomm · pole-zero positions and filter behavior · GD/DSP-filters-pole-zero-positions-and-relation-to-filters-FIR-filter-QTN_5369495.htm (DSP Firmware Developer, 2022-04)
19. Qualcomm · adaptive filters (audio intern) · GD/Questions-about-adaptive-filters-QTN_828902.htm (Intern Audio Signal Processing, 2015-01)

## fixed-point
20. Qualcomm · fixed-point Q representation (audio DSP) · GD/Interviewers-asked-most-of-the-questions-from-the-resume-Also-a-few-questions-related-to-fixed-point-arithmetic-Q-repres-QTN_484165.htm (Audio DSP Engineer, 2013-07)

## multirate
21. Qualcomm · hardware design of a polyphase filter and number of MACs · GD/Explain-the-hardware-design-a-polyphase-filter-and-the-number-of-MACs-required-QTN_1519298.htm (Modem Systems Test Engineer, 2016-05)

## nco
22. Marvell · oscillator frequency stability in a phone · GD/How-much-is-the-osscilator-frequency-stability-in-mobile-phone-QTN_81738.htm (WCDMA/GSM DSP Engineer, 2010-06)
23. Qualcomm · derive phase noise and its shape in frequency · GD/Prove-the-phase-noise-and-explain-its-shape-on-freq-domain-Prove-it-by-approacing-time-domain-QTN_3113954.htm (RF Systems Engineer, 2019-04)

## ring-buffers
24. Qualcomm · modulo without the modulo operator (DSP assembly phone screen) · GD/Qualcomm-Interview-E640-RVW568741.htm (DSP Firmware Engineer, Santa Clara, 2010)

## interview
25. Texas Instruments · MAP decision threshold for ±1 with priors 0.75/0.25 · GD/Either-a-1-or-a-1-symbol-is-transmitted-with-equal-probabiility-At-the-receivers-side-some-gaussian-noise-with-variance-QTN_8706664.htm (Signal Processing Engineer, 2025-12)
26. Texas Instruments · distribution of a linear function of a uniform RV · GD/They-gave-me-some-uniform-random-variable-function-and-a-linear-equation-involving-X-and-Y-and-first-asked-the-distribution-QTN_8439387.htm (Signal Processing Engineer, 2025-08)
27. Qualcomm · pink vs white noise (same report as 11) · GD/Questions-based-on-the-resume-sampling-theorem-autocorrelation-FIR-vs-IIR-pink-and-amp-white-noise-FIR-filter-coding-fr-QTN_8199538.htm
28. Qualcomm · Gaussian RNG when the chip only has a uniform RNG · GD/Several-questions-on-statistics-signal-processing-communications-Mostly-fundamental-knowledge-not-specific-to-any-stand-QTN_879813.htm (Systems Engineer, Wireless, 2015-03)
29. Qualcomm · throughput at 5 mph vs 50 mph · GD/When-you-get-higher-throughput-while-going-at-5mph-and-while-going-at-50-mph-And-Why-QTN_148911.htm (Wireless Systems Test Engineer, 2011-03)
30. Apple · beamforming with N antennas without N TRX chains · GD/how-to-beamform-with-X-amount-of-antenna-without-the-need-of-X-amount-of-TRX-chains-QTN_8394701.htm (Wireless Systems Engineer, 2025-07)
31. Apple · noise floor before vs after the LNA · GD/How-does-noise-floor-change-before-and-after-the-LNA-stage-QTN_3506103.htm (RF Systems Engineer Intern, 2019-10)
32. Apple · pdf of the sum of two independent RVs · GD/How-do-you-find-the-pdf-of-the-sum-of-two-independent-random-variables-QTN_942115.htm (Algorithm Engineer, 2015-05)
33. Broadcom · compare bit rate of BPSK, QPSK, QAM · GD/1-Compare-bit-rate-among-BPSK-QPSK-and-QAM-QTN_261939.htm (Wireless Systems Verification Intern, 2012-05)
34. Google · best beamforming to maximize SNR at the user · GD/best-Beamforming-technique-to-maximize-SNR-at-the-user-side-QTN_7350088.htm (Wireless System Engineer, 2024-06)
35. Intel · can we keep increasing the number of OFDM subcarriers? · GD/1-Types-of-equalizers-Problems-with-zero-forcing-equalizer-Why-is-MMSE-equalizer-better-than-the-former-2-Asked-me-abo-QTN_884584.htm (Wireless Systems Engineer Internship, 2015-03)
36. Marvell · MRC and capacity computations · GD/basic-matlab-and-C-questions-MRC-MMSE-5G-standards-OFDM-Channel-estimation-Sampling-BER-Capacity-computations-QTN_4360572.htm (Wireless Systems Engineer 5G, 2021-04)
37. Marvell · sensitivity of a 1 GHz, 10 dB NF receiver · GD/What-is-the-sensitivity-of-a-system-with-1GHz-bandwidth-and-10dB-NF-QTN_2802925.htm (RF Design Engineer, 2018-09)
38. Qualcomm · MIMO-OFDM detection: MMSE vs ML, which is optimal, high/low SNR · GD/Questions-on-detection-of-MIMO-OFDM-Difference-between-MMSE-and-MLE-which-one-is-better-and-which-one-is-optimum-How-th-QTN_614068.htm (Wireless DSP Engineer, 2014-02)
39. Qualcomm · pdf of a function of iid RVs; MAP · GD/First-of-all-he-asked-about-the-project-you-have-done-Then-he-asked-me-two-problems-related-to-probability-and-static-On-QTN_434751.htm (Wireless Modem ASIC Systems Engineer, 2013-03)
40. Qualcomm · two receive antennas, close vs far apart · GD/You-are-given-2-receiver-antennae-and-one-transmitter-antenna-Describe-what-happens-to-the-received-signal-when-changing-t-QTN_170267.htm (Wireless Modem ASIC Systems Engineer, 2011-06)
41. Qualcomm · 2Tx/1Rx vs 1Tx/2Rx · GD/1-MIMO-Systems-explain-the-benefits-of-2Tx-1RX-vs-1Tx-2Rx-2-10-wires-with-each-having-2-ends-are-inside-a-bag-2-ends-QTN_1489871.htm (Modem Systems Engineer, 2016-04)
42. Qualcomm · estimate lambda of an exponential from ten samples (same report as 41) · GD/1-MIMO-Systems-explain-the-benefits-of-2Tx-1RX-vs-1Tx-2Rx-2-10-wires-with-each-having-2-ends-are-inside-a-bag-2-ends-QTN_1489871.htm
43. Qualcomm · why the mmWave beamspace channel matrix is sparse · GD/Q-Explain-the-mmWave-channel-Why-the-beam-space-matrix-in-the-mmWave-channel-is-sparse-in-nature-and-nbsp-QTN_7102241.htm (Modem Systems Engineer, 2024-04)
44. Qualcomm · Alamouti OSTBC · GD/Do-you-know-ostbc-explain-alamouti-ostbc-for-2x2-MIMO-QTN_4166955.htm (Modem Systems Test Engineer, 2021-01)
45. Qualcomm · LS / MMSE channel estimation with several Rx antennas, different noise variances · GD/1-Least-squares-channel-estimation-2-Calculation-of-PDF-and-CDF-of-functions-of-random-variables-3-MMSE-channel-estim-QTN_5388588.htm (Modem Systems Engineering Intern, 2022-04)
46. Qualcomm · derive the BER of BPSK · GD/Take-a-random-sequence-of-bits-and-perform-source-coding-using-Huffman-code-Write-an-optimization-function-for-a-4-way-tr-QTN_369274.htm (Modem Systems Test Engineer, 2012-10)
47. Qualcomm · how to estimate the 16QAM threshold · GD/How-to-estimate-16QAM-threshold-QTN_61004.htm (DSP Firmware Engineer, 2010-04)
48. Samsung Electronics · y = hx + n: ML and MMSE estimation · GD/Q1-y-hx-n-is-the-system-model-Describe-ML-and-MMSE-channel-estimation-to-estimate-x-Q2-What-is-the-role-of-Cyclic-QTN_3652132.htm (Modem Systems Test Engineer, 2020-02)
49. Apple · drawbacks of OFDM · GD/Most-of-the-questions-and-cross-questions-were-asked-from-the-resume-drawbacks-of-OFDM-etc-QTN_3330177.htm (Wireless Systems Engineer, 2019-07)
50. Qualcomm · why SC-FDMA in the uplink · GD/All-about-resume-why-SCFDMA-in-uplink-PHFICH-channel-frequencies-what-happens-in-MRC-LTE-call-procedure-QTN_1304653.htm (Modem Systems Test Engineer, 2015-12)
51. Qualcomm · 25 red + 25 blue balls in two bowls, maximize P(red) · GD/Given-25-red-balls-and-25-blue-balls-Arrange-them-in-2-bowls-such-that-when-a-ball-is-picked-randomly-from-one-of-bowls-the-QTN_42872.htm (DSP Firmware Engineer Wireless Modem, 2010-02)

## Seen but not used (candidates for a later batch, or already covered)
- Qualcomm · 32-bit multiply with 8-bit multipliers (QTN_42871): already interview.json.
- Qualcomm · OFDM / CP / wideband channel / overlap-save (QTN_42873), QAM and channel offsets (QTN_88866): already covered.
- Rafael · source localization (QTN_4027746): already in dsp-interview-sources.md.
- Keysight · Nyquist (QTN_4975440), OFDMA strengths (QTN_4012432); MediaTek · OFDM and frequency-selective channels (QTN_5239136);
  Texas Instruments · causality (QTN_7565598), LTI test and FT of FT (QTN_2227199); Apple · GMSK vs QPSK and PA linearity (QTN_565535);
  Qualcomm · source vs channel coding vs modulation (QTN_254983), SNR estimation (QTN_61003).
