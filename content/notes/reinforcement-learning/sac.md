---
title: SAC
weight: 4
description: >-
  Soft Actor–Critic explained against its architecture diagram — the eight
  stages of one iteration, and what changes coming from TD3.
---

Soft Actor–Critic ([Haarnoja et al., 2018](https://arxiv.org/abs/1801.01290)) is
the algorithm I reach for first on a new continuous-control problem, and the
base the ResFiT residual actor is built on.

The idea in one line: maximise reward **and** policy entropy at the same time, so
the policy keeps exploring instead of collapsing onto whatever it found first.

$$
J(\pi) = \sum_{t=0}^{\infty} \gamma^t \, \mathbb{E}\Big[ r_{t+1} + \alpha \mathcal{H}\big(\pi(\cdot\,|\,s_t)\big) \Big]
$$

Setting $\alpha = 0$ recovers TD3's objective exactly. Everything else follows
from that one extra term.

{{< diagram
    src="chapter2_background/sac_arch_vertical.svg"
    alt="Soft Actor-Critic architecture. Block 1 is data collection: the online actor samples an action, the environment returns a transition, and it is stored in a replay buffer. Block 2 is learning from replay: a random minibatch feeds the online actor, twin online critics, a next-action evaluation step against the online policy, twin target critics, a tuned entropy temperature, and a soft Bellman target."
    caption="SAC maintains **five** networks — one stochastic actor, two online critics, two target critics — plus an automatically tuned temperature $\alpha$. There is no target actor." >}}

## One iteration, stage by stage

The numbers below follow the badges in the diagram.

1. **Action execution.** Actions are sampled from the stochastic policy,
   $a_t \sim \pi_\phi(\cdot|s_t)$. Because the $\tanh$ squashing changes the
   probability density, the log-probability needs the Jacobian correction
   $-\sum_j \log(1 - \tanh^2 u_j)$. Forgetting this term is a classic
   implementation bug — it silently biases the entropy estimate.
2. **Storage and sampling.** Transitions $(s_t, a_t, r_{t+1}, s_{t+1}, d_{t+1})$
   go into the replay buffer and are sampled uniformly.
3. **Next-state policy evaluation.** Candidate next actions
   $a' \sim \pi_\phi(\cdot|s_{t+1})$ come from the **online** actor. This is the
   step people coming from TD3 get wrong: SAC has no target actor.
4. **Soft Bellman target.** The target critics evaluate $(s_{t+1}, a')$, take the
   minimum to suppress overestimation, and subtract the entropy bonus:
   $y_t = r_{t+1} + \gamma(1 - d_{t+1})\big[\min_i Q_{\theta_i'}(s_{t+1},a') - \alpha\log\pi_\phi(a'|s_{t+1})\big]$
5. **Twin critic update.** Both online critics regress onto the same shared
   target $y_t$.
6. **Actor update via reparameterisation.** Fresh actions
   $\tilde a_t = a_{\max}\tanh(\mu_\phi + \sigma_\phi \odot \xi)$, $\xi \sim \mathcal{N}(0, I)$,
   keep the whole thing differentiable end to end. The actor minimises
   $\alpha\log\pi_\phi(\tilde a_t|s_t) - \min_i Q_{\theta_i}(s_t,\tilde a_t)$.
7. **Temperature adjustment.** $\alpha$ is tuned by gradient descent against a
   target entropy $\bar{\mathcal{H}} = -\dim(\mathcal{A})$, rather than being a
   hyperparameter you guess.
8. **Target tracking.** Only the *critic* targets track their online networks,
   via Polyak averaging every step.

## Coming from TD3

| Property | TD3 | SAC |
|---|---|---|
| Policy | Deterministic $\mu_\phi(s)$ | Stochastic squashed Gaussian $\pi_\phi(a\vert s)$ |
| Exploration | Additive external noise $\mathcal{N}(0,\sigma^2)$ | Learned state-dependent variance $\sigma_\phi(s)$ |
| Networks | 6 (actor, 2 critics, target actor, 2 target critics) | 5 (actor, 2 critics, 2 target critics) |
| Target actor | Yes | None — samples the online policy |
| Value objective | Expected return | Maximum-entropy return (soft $Q$) |
| Actor gradient | Deterministic policy gradient via $Q_{\theta_1}$ | Reparameterisation gradient via $\min(Q_{\theta_1}, Q_{\theta_2})$ |
| Update schedule | Delayed actor/target updates ($d=2$) | Every step ($d=1$) |

The deeper point: TD3 needs target policy smoothing and a target actor to stop
the actor exploiting isolated peaks in the $Q$ landscape. In SAC, sampling from a
distribution *does that smoothing for free* — which is why the algorithm is
simpler despite optimising a more complicated objective.

## Why it matters on real robots

The entropy term is what makes SAC sample-efficient enough to attempt on
hardware at all, and automatic temperature tuning removes the single most
annoying hyperparameter. Clipped double-$Q$ keeps value overestimation from
driving the actor into nonsense actions — which on a real arm is not an abstract
concern.

<!-- Your own notes: what you hit running this on Trossen/Franka, what you
     changed from the paper defaults, and where it fell over. -->

## See also

- [TD3](../td3/) — where the twin critics and clipped double-$Q$ come from
- [DDPG](../ddpg/) — the deterministic ancestor
- [RLPD](../rlpd/) — SAC plus prior data
- [The residual training loop](../../residual-rl/architecture/) — SAC/TD3 as a frozen base
