---
title: Reward shaping
weight: 1
---

A sparse reward gives a real robot almost no signal. Shaping adds intermediate
signal — but done carelessly it changes the optimal policy, which is why
potential-based shaping exists.

{{< diagram
    src="chapter2_background/reward_shaping_cycle.svg"
    alt="The reward shaping cycle."
    caption="Reward shaping." >}}

<!-- Your notes: PBRS vs milestone rewards, and which you used where. -->
