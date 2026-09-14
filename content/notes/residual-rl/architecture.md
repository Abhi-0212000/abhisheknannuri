---
title: The residual training loop
weight: 1
---

Freeze the base policy, learn a small bounded correction on top. The base stays
intact and the correction is clipped, so there is a safety floor that
fine-tuning the whole network cannot give you.

{{< diagram
    src="chapter4_methodology/residual_architecture.svg"
    alt="Residual RL training architecture: the environment feeds a frozen BC policy and a trained residual actor, whose scaled output is summed and clipped into the action; a reward server produces a shaped reward that fills offline and online buffers, which each supply half of a critic ensemble's batch."
    caption="The residual training loop. Demonstrations fill an offline buffer, warm-up rollouts fill an online one, and initialisation branches on whether offline RL is enabled." >}}

<!-- Your notes: residual scaling α, the clip bound, and why offline TD3-BC
     pre-training of the critic changes the online phase. -->

## See also

- [TD3](../../reinforcement-learning/td3/) — the actor this is built on
