---
title: Comparing RL paradigms
weight: 1
description: >-
  Online, off-policy and offline RL side by side — what each assumes about how
  data is collected, and what that costs on real hardware.
---

Three ways to arrange the same learning problem. The difference between them is
entirely about **where the data comes from**, and that single choice determines
what each one costs to run on hardware.

{{< diagram
    src="chapter2_background/rl_paradigms_comparison.svg"
    credit="Adapted from Levine et al. (2020), *Offline Reinforcement Learning: Tutorial, Review, and Perspectives*. Redrawn by Abhishek Nannuri."
    alt="Three reinforcement learning paradigms side by side: (a) classic online RL, where the policy collects rollouts and updates from them directly; (b) off-policy RL, where rollouts accumulate in a replay buffer that updates sample from; and (c) offline RL, where a fixed dataset is collected in advance by a behaviour policy and the learned policy never interacts with the environment during training."
    caption="**(a)** classic online RL with active on-policy rollouts and streaming updates · **(b)** off-policy RL with rollouts stored into a replay buffer $\mathcal{D}$ · **(c)** offline RL, where a fixed dataset $\mathcal{D}$ is collected a priori by an arbitrary behaviour policy $\pi_\beta$ and used to train $\pi$ with no environment interaction during training." >}}

## (a) Classic online RL

The policy collects rollouts and updates from them immediately. Data is
**on-policy**: it comes from the policy currently being improved, so every update
invalidates everything collected before it.

That is why on-policy methods are sample-hungry. Each batch of experience is used
once and thrown away. On a simulator that's fine. On a Franka arm it is not.

## (b) Off-policy RL

Rollouts accumulate in a replay buffer $\mathcal{D}$, and updates draw
minibatches from the whole buffer rather than from the current trajectory. Old
experience keeps paying rent.

This is the regime [DDPG, TD3, SAC and RLPD](../../reinforcement-learning/off-policy-actor-critic/)
operate in, and the reason they're the family worth using on real robots: the
same rollout contributes to many gradient steps.

## (c) Offline RL

The dataset $\mathcal{D}$ is collected **in advance** by some arbitrary behaviour
policy $\pi_\beta$ — a human teleoperator, a scripted controller, an older
policy — and $\pi$ is trained without touching the environment at all.

The attraction is obvious: no rollouts, no safety risk, and you can reuse data
you already paid for. The difficulty is equally specific. The critic will be
asked to value actions $\pi$ wants to take but which $\pi_\beta$ never took, and
for those there is no data to correct a bad estimate. Nothing in the training
loop can catch the error, because there is no interaction to contradict it. This
is **extrapolation error**, and it is the central problem the whole subfield is
organised around.

Two responses appear elsewhere in these notes:

- **Constrain the policy** towards the behaviour policy — TD3-BC adds a
  behaviour-cloning term to the actor objective.
- **Constrain the critic's output range** instead of the policy — which is what
  [RLPD](../../reinforcement-learning/off-policy-actor-critic/rlpd/) does with
  LayerNorm, preserving exploration.

## Which one applies

| | Data source | Interaction during training | Main cost |
|---|---|---|---|
| Online (on-policy) | Current policy only | Yes, constantly | Sample-hungry; every rollout used once |
| Off-policy | Replay buffer of all past rollouts | Yes | Overestimation bias from bootstrapping |
| Offline | Fixed dataset from $\pi_\beta$ | None | Extrapolation error on unseen actions |

In practice the interesting work sits between (b) and (c): you have prior data
*and* you can interact, just not much. That is exactly the setting
[RLPD](../../reinforcement-learning/off-policy-actor-critic/rlpd/) and residual
RL are built for.
