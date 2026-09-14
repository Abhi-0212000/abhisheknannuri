---
title: MDPs
weight: 1
description: >-
  The Markov Decision Process — the frame every RL algorithm solves inside, and
  where its assumptions break on a real robot cell.
---

The formalism every algorithm in this section is solving inside. Worth being
precise about, because real robot problems violate its assumptions quietly.

{{< diagram
    src="chapter2_background/mdp_diagram.svg"
    minwidth="22rem"
    alt="The Markov Decision Process loop: an agent observes a state, takes an action, and the environment returns a reward and the next state."
    caption="The agent–environment loop." >}}

An MDP is the tuple $(\mathcal{S}, \mathcal{A}, P, r, \gamma)$:

- $\mathcal{S}$ — the **state space**. On a manipulation cell this is typically
  camera frames plus proprioception (joint angles, gripper width).
- $\mathcal{A}$ — the **action space**. Continuous here: end-effector deltas or
  joint targets, which is why the whole off-policy actor–critic family applies
  and discrete-action methods like DQN do not.
- $P(s_{t+1} \mid s_t, a_t)$ — the **transition dynamics**. Physics, in our case,
  and not something we get to write down.
- $r(s_t, a_t)$ — the **reward function**. The part you have to design, and the
  subject of most of [reward modelling](../../reward-modelling/).
- $\gamma \in [0,1)$ — the **discount factor**, setting how much future reward is
  worth now. It also bounds the effective horizon: roughly $1/(1-\gamma)$ steps.

The agent acts under a policy $\pi(a \mid s)$ and the goal is to maximise
expected discounted return:

$$J(\pi) = \mathbb{E}_{\pi}\Big[\textstyle\sum_{t=0}^{\infty} \gamma^{t} r_{t+1}\Big]$$

## The Markov assumption, and where it breaks

The defining property is that the next state depends **only** on the current
state and action — not on anything earlier. The state is a sufficient statistic
for the future.

On a real cell that is routinely false, and it's worth knowing which way:

- **Partial observability.** A fixed camera cannot see whether the part in the
  gripper is seated or merely touching. Two physically different situations
  produce identical observations, so the "state" isn't one.
- **Latency.** Between reading an observation and the action taking effect, the
  arm has moved. The state you conditioned on is already stale — which is
  exactly the failure behind the control-frequency bug on the Trossen arm.
- **Contact history.** Whether a surface is currently slipping depends on what
  happened over the last several steps, not on this frame.

Frame stacking and action chunking are both partial answers to this: they widen
what counts as "the state" until the Markov assumption is close enough to true.

## Next

- [Off-policy actor–critic](../off-policy-actor-critic/) — the algorithms that
  solve this
- [Comparing RL paradigms](../../offline-rl/paradigms/) — online, off-policy and
  offline, and what each assumes about data collection
