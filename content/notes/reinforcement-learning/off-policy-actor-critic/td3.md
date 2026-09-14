---
title: TD3
weight: 2
description: >-
  Twin Delayed DDPG — three targeted fixes for overestimation bias, and the
  actor the ResFiT residual policy is built on.
---

TD3 is not a new paradigm. It is an architectural refinement of
[DDPG](../ddpg/) aimed at one specific disease: **accumulated overestimation
bias**.

The mechanism is worth stating precisely, because all three fixes follow from
it. Function approximation makes the critic overvalue some state–action pairs.
The deterministic actor is optimised to maximise $Q_\theta(s,a)$, so it
systematically drifts towards those overvalued pairs. Bootstrapping then reuses
those inflated values in the next target. The loop closes and training degrades.

{{< diagram
    src="chapter2_background/td3_arch_vertical.svg"
    alt="TD3 architecture showing twin online critics and twin target critics, target policy smoothing applied to the target actor's output, and delayed actor and target updates every d critic updates."
    caption="Twin critics, a smoothed target action, and a delayed actor — the three changes, all visible at once." >}}

## The three mechanisms

1. **Clipped double-$Q$ learning.** Two independent critics are trained on the
   same target, and the *smaller* of the two estimates is used for bootstrapping.
   Two networks rarely overestimate the same pair simultaneously, so the minimum
   suppresses the bias. It introduces a slight *under*estimation, which is
   harmless: the policy has no incentive to seek out underestimated actions.
2. **Target policy smoothing.** Small clipped noise is added to the target
   actor's action before evaluating it, so similar actions get similar values.
   This stops the policy exploiting narrow, unrealistic peaks in the critic.
3. **Delayed policy and target updates.** The actor and all targets update once
   every $d$ critic updates (typically $d = 2$), giving the critics time to
   settle before the policy consumes their estimates.

## One iteration, stage by stage

**1 · Interaction.** Deterministic actor, external Gaussian exploration noise —
unchanged from DDPG:

$$a_t=\operatorname{clip}\big(\mu_\phi(s_t)+\varepsilon_t,\;a_{\min},a_{\max}\big), \qquad \varepsilon_t\sim\mathcal{N}(0,\sigma^2 I)$$

**2 · Storing experience.** The transition $(s_t,a_t,r_{t+1},s_{t+1},d_{t+1})$
goes to the replay buffer $\mathcal{D}$.

**3 · Sampling.** A minibatch is drawn uniformly from $\mathcal{D}$ — this is
what makes TD3 off-policy.

**4 · Target policy smoothing.** Rather than using the target actor's output
directly:

$$\tilde a=\operatorname{clip}\Big(\mu_{\phi'}(s_{t+1})+\tilde\varepsilon,\; a_{\min},a_{\max}\Big), \qquad \tilde\varepsilon\sim\operatorname{clip}\big(\mathcal{N}(0,\tilde\sigma^2),-c,+c\big)$$

- $\tilde\varepsilon$ — smoothing noise, itself clipped to $[-c, +c]$ so a rare
  large sample can't throw the target far from the intended action
- $\tilde\sigma$ — smoothing noise scale, separate from the exploration $\sigma$

Note the double clip: once on the noise, once on the resulting action.

**5 · Clipped double-$Q$ target.** Both target critics evaluate $\tilde a$ and
the smaller estimate is taken:

$$y_t=r_{t+1}+\gamma\,(1-d_{t+1})\, \min_{i=1,2} Q_{\theta_i'}(s_{t+1},\tilde a)$$

**6 · Critic update.** Both online critics regress onto the *same* target:

$$\mathcal{L}(\theta_1,\theta_2)= \mathbb{E}_{\mathcal{D}}\left[\sum_{i=1,2}\big(Q_{\theta_i}(s_t,a_t)-y_t\big)^2\right]$$

**7 · Delayed actor update.** Only every $d$ critic updates, and the gradient is
taken through the **first critic alone** — not the minimum:

$$\nabla_\phi J(\phi)= \mathbb{E}_{s\sim\mathcal{D}} \Big[\nabla_a Q_{\theta_1}(s,a)\big|_{a=\mu_\phi(s)}\; \nabla_\phi\mu_\phi(s)\Big]$$

**8 · Delayed soft target updates.** On the same delayed schedule, all three
targets Polyak-average towards their online networks:

$$\phi'\leftarrow\tau\phi+(1-\tau)\phi', \qquad \theta_i'\leftarrow\tau\theta_i+(1-\tau)\theta_i',\quad i=1,2$$

## DDPG vs TD3

The first block is TD3's algorithmic contribution; the second is reference
implementation differences that matter in practice.

| | DDPG | TD3 |
|---|---|---|
| Critic networks | 1 online $Q_\theta$ + 1 target (4 total) | 2 online $Q_{\theta_1},Q_{\theta_2}$ + 2 targets (6 total) |
| Bootstrap value | $Q_{\theta'}(s_{t+1},\mu_{\phi'}(s_{t+1}))$ | $\min_{i=1,2}Q_{\theta_i'}(s_{t+1},\tilde a)$ |
| Target action | Deterministic $\mu_{\phi'}(s_{t+1})$ | Smoothed with clipped noise |
| Actor update frequency | Every critic update | Every $d$ critic updates ($d=2$) |
| Target update frequency | Every step | Every $d$ updates, with the actor |
| Actor gradient source | Single critic $Q_\theta$ | $Q_{\theta_1}$ only |
| Exploration noise | Ornstein–Uhlenbeck (correlated) | Gaussian; correlated noise shown unnecessary |
| Initial data collection | Policy acts from step one | Uniform random actions for $T_{\text{start}}$ steps |

## Why it matters here

The residual actor in ResFiT is TD3-style, and its offline variant **TD3-BC** is
what I adapted to a residual action space — the paper's regularisation weight is
scaled for full actions, so it had to be re-derived for a bounded correction.

→ [The residual training loop](../../../residual-rl/architecture/)
