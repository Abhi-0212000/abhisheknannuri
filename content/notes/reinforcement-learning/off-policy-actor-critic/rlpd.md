---
title: RLPD
weight: 4
description: >-
  Reinforcement Learning with Prior Data — using demonstrations in online RL
  without a separate offline pre-training stage.
---

RLPD answers a question that comes up constantly in robot manipulation: you
already have data — teleoperation demonstrations, logs from an earlier
controller — so what do you do with it?

The assumed answer is a dedicated offline RL algorithm: pre-train on the dataset
with behaviour constraints, then fine-tune online. RLPD shows you can skip that
entirely. A standard off-policy method can just be handed the data and left to
learn online, **provided three structural changes are made**. There is no offline
pre-training phase at all; learning is online from the first step.

{{< diagram
    src="chapter2_background/rlpd_arch_vertical.svg"
    alt="RLPD architecture: dual-buffer data collection combining an online replay buffer with a fixed prior dataset, and symmetric 50:50 minibatch learning with a high update-to-data ratio, an ensemble of layer-normalised critics, and Bellman targets computed over a random subset of targets."
    caption="Two buffers sampled 50:50, and an ensemble of LayerNorm critics updated several times per environment step." >}}

It builds directly on [SAC](../sac/) and inherits its structure — stochastic
actor, no target actor, Polyak-updated target critics, auto-tuned $\alpha$. The
one structural change is that the twin critics become an ensemble of $E$ critics
with $E$ targets, so there are $2E+1$ networks rather than five.

## The three changes

### 1 · Symmetric sampling

Two buffers: an online replay buffer $\mathcal{R}$ the agent fills as it acts,
and the fixed offline dataset $\mathcal{D}$, never written to. **Every minibatch
takes half from each**, regardless of the size of either:

$$\mathcal{B} = \mathcal{B}_{\text{online}} \cup \mathcal{B}_{\text{demo}}, \quad |\mathcal{B}_{\text{online}}| = |\mathcal{B}_{\text{demo}}| = \frac{|\mathcal{B}|}{2}$$

This guarantees a steady supply of prior experience in every update without
letting it drown out recent online data — and it removes the mixing ratio as a
hyperparameter entirely.

The obvious alternative — pre-filling the replay buffer with the offline data —
performs significantly worse, because the prior data's share shrinks as online
experience accumulates. Exactly when it stops helping is then an accident of how
long you trained.

### 2 · LayerNorm in the critics

The offline data covers a narrow slice of the state–action space, so the critic
is constantly asked to value actions it has never seen. Unconstrained networks
extrapolate wildly on those inputs.

Offline RL methods usually answer by explicitly penalising unfamiliar actions —
which also suppresses exploration. RLPD instead puts a **LayerNormalisation**
layer inside each critic. That bounds the output magnitude by the norm of the
final weights, capping how far a value can extrapolate, *without* constraining
what the policy is allowed to try.

This is the single most important of the three: remove it and you get value
divergence and complete learning failure on narrow datasets.

### 3 · Critic ensemble with a high UTD ratio

For prior data to actually accelerate learning it has to propagate through
Bellman backups quickly, so RLPD performs $G$ gradient updates per environment
step ($G \ge 2$ — a high **update-to-data** ratio) rather than one.

Doing that with only two critics overfits the small amount of data seen so far.
An ensemble of $E$ critics regularises it: at each update a small random subset
$\mathcal{Z} \subset \{1,\dots,E\}$ of the targets is drawn — typically
$|\mathcal{Z}| \in \{1,2\}$ — and the target uses the minimum over *that subset
alone*, so the degree of pessimism varies from update to update.

The actor, crucially, is trained against the **mean** over the full ensemble,
not the minimum. Pessimism belongs in the value estimate, not in the policy
objective.

## The objectives

Soft Bellman target, minimum over the random subset:

$$y_t = r_{t+1} + \gamma (1 - d_{t+1}) \left[ \min_{i \in \mathcal{Z}} Q_{\theta_i'}(s_{t+1}, a') - \alpha \log\pi_\phi(a' \mid s_{t+1}) \right], \qquad a' \sim \pi_\phi(\cdot \mid s_{t+1})$$

- $\mathcal{Z}$ — the randomly drawn subset of target critics for this update
- $\alpha\log\pi_\phi$ — SAC's entropy term, inherited unchanged

All $E$ critics regress onto that shared target:

$$\mathcal{L}(\theta_{1:E}) = \frac{1}{|\mathcal{B}|} \sum_{\mathcal{B}} \sum_{i=1}^{E} \left( Q_{\theta_i}(s_t, a_t) - y_t \right)^2$$

The actor maximises the ensemble **mean**, plus entropy:

$$J(\phi) = \mathbb{E}_{s_t \sim \mathcal{B},\, \tilde{a}_t \sim \pi_\phi} \left[ \frac{1}{E} \sum_{i=1}^{E} Q_{\theta_i}(s_t, \tilde{a}_t) - \alpha \log\pi_\phi(\tilde{a}_t \mid s_t) \right]$$

## Two domain-dependent choices

Worth knowing before you copy the defaults:

- $|\mathcal{Z}| = 2$ reproduces clipped double-$Q$; $|\mathcal{Z}| = 1$ removes
  pessimism entirely. Conservative choices can actively hurt on sparse-reward
  tasks.
- The entropy backup term in the target is **disabled** on some domains —
  maximising entropy in the actor without propagating it through Bellman backups.

## See also

- [SAC](../sac/) — the algorithm this extends
- [Off-policy actor–critic](../) — where this sits in the lineage
