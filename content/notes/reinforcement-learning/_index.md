---
title: Reinforcement learning
weight: 1
description: >-
  The off-policy actor–critic family used for continuous control in robotics —
  MDPs, DDPG, TD3, SAC and RLPD, each against its architecture diagram.
---

The formalism first, then the algorithms. Everything here is continuous-control
RL as it's actually used on a robot arm, which in practice means the off-policy
actor–critic family: they reuse past experience instead of throwing it away, and
on hardware every rollout is expensive.

{{< cards >}}
  {{< card link="mdp/" title="MDPs" subtitle="The frame every one of these algorithms solves inside." >}}
  {{< card link="off-policy-actor-critic/" title="Off-policy actor–critic" subtitle="DDPG → TD3 → SAC → RLPD, and why each one exists." >}}
{{< /cards >}}
