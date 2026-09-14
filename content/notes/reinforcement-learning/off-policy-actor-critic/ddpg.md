---
title: DDPG
weight: 1
description: >-
  Deep Deterministic Policy Gradient — the algorithm that made deep RL work on
  continuous actions, walked through against its architecture diagram.
---

DDPG adapts the Deterministic Policy Gradient theorem to continuous action
spaces using deep networks and off-policy experience replay. It's the ancestor of
everything else in this section, and its failure modes are why TD3 and SAC exist.

{{< diagram
    src="chapter2_background/ddpg_arch_vertical.svg"
    alt="DDPG architecture in two blocks: environment interaction streaming transitions into a replay buffer, and off-policy minibatch learning where the online actor and critic are updated by gradient descent while target networks track them slowly via Polyak averaging."
    caption="Two blocks running at different rates: collecting transitions into the replay buffer, and learning from minibatches drawn out of it." >}}

## Four networks, and why

DDPG instantiates an **online actor** $\mu_\phi$, an **online critic**
$Q_\theta$, a **target actor** $\mu_{\phi'}$ and a **target critic**
$Q_{\theta'}$. The targets start as exact copies ($\phi' = \phi$,
$\theta' = \theta$).

The online networks are updated every gradient step. The targets are not — and
that asymmetry is the whole point. Gradient descent on a deep network moves
weights quickly; if you computed the regression target with the same fast-moving
network you are regressing, you get a feedback loop chasing its own output. This
is the **moving-target problem**. Targets are therefore evaluated only with
$(\mu_{\phi'}, Q_{\theta'})$, which receive no gradients and instead drift slowly
towards the online weights.

## One iteration, stage by stage

The numbers follow the badges in the diagram.

**1 · Interaction with the environment.** The actor is deterministic: given
$s_t$ it returns a single action, not a distribution, so it cannot explore on its
own. Exploration is injected externally by perturbing the action at act time:

$$a_t = \operatorname{clip}\big(\mu_\phi(s_t)+\varepsilon_t,\; a_{\min}, a_{\max}\big), \qquad \varepsilon_t\sim\mathcal{N}(0,\sigma^2 I)$$

- $\mu_\phi(s_t)$ — the actor's deterministic action for state $s_t$
- $\varepsilon_t$ — Gaussian exploration noise, standard deviation $\sigma$
- $\operatorname{clip}(\cdot, a_{\min}, a_{\max})$ — keeps the action inside the robot's limits

Because noise is added, the **behaviour** policy that collects data differs from
the **target** policy being learned. That gap is what makes DDPG off-policy.

**2 · Storing experience.** Each interaction yields a transition
$(s_t, a_t, r_{t+1}, s_{t+1}, d_{t+1})$ — state, action, reward, next state, and
the done flag — appended to the replay buffer $\mathcal{D}$.

**3 · Sampling a minibatch.** Updates are computed from a minibatch
$\mathcal{B}$ drawn *uniformly at random* from $\mathcal{D}$, which breaks the
temporal correlation between consecutive steps.

**4 · The Bellman target.** The target actor proposes the next action and the
target critic scores it:

$$y_t = r_{t+1} + \gamma\,(1-d_{t+1})\, Q_{\theta'}\big(s_{t+1},\,\mu_{\phi'}(s_{t+1})\big)$$

- $\gamma$ — discount factor, how much future reward is worth now
- $(1-d_{t+1})$ — zeroes the bootstrap when the episode ended, so terminal states
  aren't credited with future value that cannot happen
- $Q_{\theta'}(\cdot)$ — the *target* critic, deliberately not the online one

**5 · Critic update.** The online critic regresses onto that target, minimising
the mean squared Bellman error:

$$\mathcal{L}(\theta) = \mathbb{E}_{\mathcal{D}}\Big[\big(Q_\theta(s_t,a_t)-y_t\big)^2\Big]$$

**6 · Actor update.** DDPG maximises expected discounted return, but that
expectation runs over whole trajectories and can't be differentiated. The critic
supplies the surrogate: maximise $J(\phi) = \mathbb{E}_{s\sim\mathcal{D}}[Q_\theta(s,\mu_\phi(s))]$.
Chain rule gives the policy gradient:

$$\nabla_\phi J(\phi) = \mathbb{E}_{s\sim\mathcal{D}} \Big[\nabla_a Q_\theta(s,a)\big|_{a=\mu_\phi(s)}\; \nabla_\phi \mu_\phi(s)\Big]$$

Read right to left: how the action changes with the actor's weights, times how
the value changes with the action. The actor climbs the critic's gradient.

**7 · Soft target updates.** Both targets take a small step towards their online
counterparts every step:

$$\theta' \leftarrow \tau\theta+(1-\tau)\theta', \qquad \phi' \leftarrow \tau\phi+(1-\tau)\phi'$$

with $\tau \ll 1$ (typically $0.005$). This is **Polyak averaging**.

## Where it breaks

Function approximation error makes the critic overestimate some state–action
pairs. The actor is explicitly optimised to maximise $Q_\theta$, so it moves
*towards* exactly those overestimated pairs. Those inflated values then re-enter
the next Bellman target through bootstrapping — a positive feedback loop that
destabilises training.

That single failure is what [TD3](../td3/) was built to break.
