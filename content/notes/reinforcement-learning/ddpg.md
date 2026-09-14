---
title: DDPG
weight: 2
---

The first algorithm that made deep RL work on continuous action spaces, and the
ancestor of everything else in this section. Deterministic actor, single critic,
target networks, replay buffer.

{{< diagram
    src="chapter2_background/ddpg_arch_vertical.svg"
    alt="Deep Deterministic Policy Gradient architecture, showing the deterministic actor, single critic, target networks and replay buffer."
    caption="DDPG." >}}

<!-- Your notes: why it is brittle in practice — overestimation bias, sensitivity
     to exploration noise — which is exactly what TD3 sets out to fix. -->
