---
title: RLPD
weight: 5
---

Reinforcement Learning with Prior Data. SAC, but every minibatch is half
demonstrations and half online transitions — which is most of what makes
off-policy RL viable when rollouts are expensive.

{{< diagram
    src="chapter2_background/rlpd_arch_vertical.svg"
    alt="RLPD architecture: symmetric sampling from an offline demonstration buffer and an online replay buffer feeding a critic ensemble with layer normalisation."
    caption="RLPD — symmetric sampling, critic ensembles, layer normalisation." >}}

<!-- Your notes: the 50/50 split in practice, ensemble size, and how this
     compares to warm-starting from BC. -->
