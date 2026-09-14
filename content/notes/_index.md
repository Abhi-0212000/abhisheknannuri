---
title: Notes
weight: 1
cascade:
  type: docs
---

Working notes on the algorithms and architectures I use day to day — mostly
off-policy reinforcement learning, reward modelling, and getting learned
policies onto real hardware.

Most pages carry a diagram I drew for my master's thesis. They're rendered
straight from the original TikZ source, so they're vector: zoom in as far as you
like. They're licensed [CC BY-NC 4.0](../license/) — reuse them with credit,
just not commercially.

These are notes, not a textbook. They're written to be the explanation I wish
I'd had when I first read each paper, and they lean on what actually mattered
when I implemented the thing.

## Sections

{{< cards >}}
  {{< card link="reinforcement-learning/" title="Reinforcement learning" subtitle="MDPs, and the off-policy actor–critic family: DDPG, TD3, SAC, RLPD." >}}
  {{< card link="offline-rl/" title="Offline RL" subtitle="Learning from a fixed dataset, and why extrapolation error is the hard part." >}}
  {{< card link="reward-modelling/" title="Reward modelling" subtitle="Shaping, learned reward models, and how to benchmark one honestly." >}}
  {{< card link="policy-architectures/" title="Policy architectures" subtitle="Action chunking, receding-horizon execution, imitation baselines." >}}
  {{< card link="residual-rl/" title="Residual RL" subtitle="Freezing a base policy and learning a bounded correction on top." >}}
{{< /cards >}}
