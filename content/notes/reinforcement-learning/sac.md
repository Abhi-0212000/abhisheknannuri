---
title: SAC
weight: 4
---

Soft Actor–Critic is the algorithm I reach for first on a new continuous-control
problem, and the base that ResFiT's residual actor is built on.

The idea in one line: maximise reward **and** policy entropy at the same time, so
the policy keeps exploring instead of collapsing onto whatever it found first.

{{< diagram
    src="chapter2_background/sac_arch_vertical.svg"
    alt="Soft Actor-Critic architecture. Block 1 is data collection: the online actor samples an action, the environment returns a transition, and it is stored in a replay buffer. Block 2 is learning from replay: a random minibatch feeds the online actor, twin online critics, a next-action evaluation step against the online policy, twin target critics, a tuned temperature term, and a soft Bellman target."
    caption="SAC, split into the two loops that run at different rates: collecting transitions, and learning from replay." >}}

## What the diagram is showing

**Block 1 — data collection.** The online actor samples an action from a squashed
Gaussian, the environment returns a transition, and everything goes into the
replay buffer. Because the policy is stochastic, exploration is *built in* —
there's no separate exploration noise to schedule, which is the first practical
difference from DDPG and TD3.

**Block 2 — learning from replay.** A random minibatch drives four updates:

1. **Next-action evaluation.** Actions for the next state are sampled from the
   *online* policy, not a target actor. SAC has no target actor — only target
   critics. This trips people coming from TD3.
2. **Critic update.** Twin critics both regress to the same soft Bellman target,
   which takes the minimum of the two target critics (clipped double-Q, inherited
   from TD3) and subtracts the entropy term.
3. **Actor update.** Minimise `α log π(ã|s) − min Q`, with `ã` reparameterised so
   the gradient flows through the sampling step.
4. **Temperature update.** `α` is tuned automatically against a target entropy
   rather than being a hyperparameter you guess.

Only the critics get soft target updates.

## Why it matters for real robots

The entropy term is what makes SAC sample-efficient enough to be worth
attempting on hardware, and the automatic temperature tuning removes the single
most annoying hyperparameter. The clipped double-Q keeps value overestimation
from driving the actor into nonsense actions — which on a real arm is not an
abstract concern.

<!-- Your own notes: what you hit running this on the Trossen/Franka, what you
     changed from the paper defaults, and where it fell over. -->

## See also

- [TD3](../td3/) — where the twin critics and clipped double-Q come from
- [DDPG](../ddpg/) — the deterministic ancestor
- [RLPD](../rlpd/) — SAC plus prior data
