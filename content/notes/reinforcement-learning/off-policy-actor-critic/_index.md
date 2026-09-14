---
title: Off-policy actor–critic
weight: 2
description: >-
  DDPG, TD3, SAC and RLPD — four algorithms in one lineage, each fixing a
  specific failure of the one before it.
---

Four algorithms, one lineage. Each exists because of a concrete failure in the
one before it, which is the only order worth learning them in.

- **[DDPG](ddpg/)** made deep RL work on continuous actions at all: a
  deterministic actor, a critic, target networks and a replay buffer.
- **[TD3](td3/)** fixes DDPG's overestimation bias with three targeted changes.
- **[SAC](sac/)** replaces the deterministic actor with a stochastic one and
  optimises a maximum-entropy objective, which makes most of TD3's machinery
  unnecessary.
- **[RLPD](rlpd/)** keeps SAC and adds prior data — demonstrations or old logs —
  without a separate offline pre-training stage.

## The shared skeleton

All four are **actor–critic**: a policy network proposes actions, a value
network scores them, and the policy is improved by ascending the value network's
gradient. All four are **off-policy**: updates are computed from minibatches
sampled out of a replay buffer rather than from the trajectory currently being
run, which is what makes them viable when data is expensive.

The trajectory-level objective

$$J(\pi) = \mathbb{E}\Big[\textstyle\sum_{t} \gamma^{t} r_{t+1}\Big]$$

cannot be differentiated directly, because the expectation runs over whole
trajectories. The critic exists to supply a differentiable surrogate for it. That
is the single idea the whole family is built on; the algorithms differ only in
what the value means and how the action handed to the critic is produced.

## Where they differ

| | DDPG | TD3 | SAC |
|---|---|---|---|
| Policy | Deterministic $\mu_\phi(s)$ | Deterministic $\mu_\phi(s)$ | Stochastic squashed Gaussian $\pi_\phi(a\vert s)$ |
| Exploration | External noise, Ornstein–Uhlenbeck | External noise, Gaussian | Learned state-dependent variance |
| Critics | 1 online + 1 target (4 networks) | 2 online + 2 target (6 networks) | 2 online + 2 target, no target actor (5 networks) |
| Bootstrap value | $Q_{\theta'}(s',\mu_{\phi'}(s'))$ | $\min_{i=1,2}Q_{\theta_i'}(s',\tilde a)$ | $\min_{i=1,2}Q_{\theta_i'}(s',a') - \alpha\log\pi_\phi(a'\vert s')$ |
| Target action | Deterministic | Smoothed with clipped noise | Sampled from the online policy |
| Actor update | Every critic update | Every $d=2$ critic updates | Every step |
| Actor gradient from | $Q_\theta$ | $Q_{\theta_1}$ only | $\min(Q_{\theta_1},Q_{\theta_2})$, reparameterised |

Setting $\alpha = 0$ in SAC recovers TD3 exactly. That's the cleanest way to see
what the entropy term is actually buying.

RLPD sits outside this table because it changes the *data*, not the update rule:
it keeps SAC's objective and replaces the two critics with an ensemble of $E$.
