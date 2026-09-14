---
title: Benchmarking a reward model before you trust it
weight: 3
---

The part people skip. A reward model tested only on successful demonstrations
tells you nothing — it has never been shown a trajectory that moves without
making progress.

{{< diagram
    src="chapter3_related_work/rw_monotonic_vs_not.svg"
    alt="Monotonic versus non-monotonic reward traces, showing how a reward-only model can be fooled by motion that never completes the task."
    caption="Monotonic versus non-monotonic traces — where reward-only models fail." >}}

I built three splits: in-distribution, out-of-distribution, and non-monotonic
runs containing reversals and recoveries. Stage-aware models track real progress
across all three. Reward-only models get fooled by motion that never completes
the task.

<!-- Your notes: the five models, the ground truth, and the numbers. -->
