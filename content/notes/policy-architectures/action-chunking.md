---
title: Action chunking and receding horizon
weight: 1
---

ACT and its relatives predict a *chunk* of future actions rather than one step,
then execute part of it before re-planning. It buys temporal consistency and
cuts the compounding-error problem in behaviour cloning.

{{< diagram
    src="chapter2_background/receding_horizon_chunking.svg"
    alt="Receding-horizon action chunking: a policy predicts a chunk of future actions, executes a prefix, then re-plans."
    caption="Receding-horizon execution of a predicted action chunk." >}}

{{< diagram
    src="chapter4_methodology/act_inference.svg"
    alt="ACT inference: the forward pass runs only when the action queue is empty, otherwise actions are popped from the queue."
    caption="ACT at inference — the forward pass runs only when the queue drains." >}}

<!-- Your notes: chunk size versus reactivity, and what this means for a
     residual correction that has to act inside the chunk. -->
