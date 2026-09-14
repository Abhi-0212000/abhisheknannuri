---
title: Abhishek Nannuri
description: >-
  Robotics software engineer in Munich. Reinforcement learning for manipulation
  at BMW Next Generation Robotics — residual RL, vision-based rewards, and real
  hardware deployment.
toc: false
---

Robotics software engineer in Munich. I do reinforcement learning for
manipulation and fine-tuning behavior-learning policies at **BMW Next Generation Robotics/Physical AI in Production**, and the systems work that gets
it onto real hardware.

[abhishek.nannuri@outlook.com](mailto:abhishek.nannuri@outlook.com) ·
[GitHub](https://github.com/Abhi-0212000) ·
[LinkedIn](https://www.linkedin.com/in/abhi-nannuri-02122000/) ·
[CV](cv.pdf)

{{< clip src="ecu-assembly" hero="true"
        caption="ECU assembly on a Franka dual-arm cell — one of the live production tasks I work on at BMW." >}}

**Currently working on** improving behaviour-cloning policies — vision-language-action
models, Action Chunking Transformers, diffusion policies — by learning a
reinforcement-learning residual correction on top of them, and getting that to
run on production hardware.

## About me

I came to robotics sideways — mechanical engineering, then two years as a DevOps
engineer, then classical robotics: perception, localisation and path planning for
autonomous mobile robots, and now Physical AI, improving learned policies with
reinforcement learning and the software architecture around them. It's an
unconventional route to robotics software engineering, but not a scattered one:
a robot needs every one of those layers to work at once. The brain is useless
without the pipeline that trains it, the middleware that runs it, and the
infrastructure that ships it to a factory floor. I've built at each layer, which
means I'm not guessing at either end.

That route is the part of my background I'm most proud of, and by now it's a
deliberate bet. The usual advice is to go deep on one thing. I think that's the
wrong shape for robotics right now: a robot is an end-to-end system, and the
expensive failures happen at the seams between specialisms rather than inside
any one of them — a controller that returns before the arm has moved, a reward
model that never saw a failure case. Knowing the whole pipeline to a working
depth is what lets you see those seams at all. And when something genuinely
needs depth, that's a few focused weeks now, not a career change — provided you
know enough to ask the right question and judge the answer you get back.

I'd also rather change fifteen files and get the structure right than add one
more function to the wrong place like patch work. There is no perfect
architecture. The one that looks clean today will meet a case it was never
designed for, and the honest response is to change it rather than paper over it.
A patch keeps the diff small and the design rigid, and that trade compounds
badly — the larger the codebase grows, the more tempting the patch becomes and
the more it eventually costs. Worth knowing before you hire me.

I keep [technical notes](notes/) on the algorithms I work with, built around the
architecture diagrams I drew for my thesis.

## Work

### Residual RL on real hardware

*BMW Next Generation Robotics · working student · 2025–present*

**Problem.** Behaviour cloning and vision-language-action policies learn a task
from demonstrations, then plateau around 80%. The missing piece is contact-rich
precision, and more demonstrations don't buy it back.

**Approach.** ResFiT freezes the base policy and learns a small bounded residual
on top with a TD3-style actor. Because the base stays intact and the correction
is clipped, you get a safety floor that fine-tuning the whole network can't give
you.

**Result.** 30% → near-perfect on cube pick-and-insert at 3–5 mm tolerance.
On ECU assembly — live production, Franka dual-arm — stage-gated success is high
and full-task reliability is still in progress.

{{< clip src="bc-baseline" pixelated="true"
        caption="Before: base behaviour-cloning policy stalls on the fine alignment. ~30% success." >}}

{{< clip src="residual-rl" pixelated="true"
        caption="After residual RL: longer horizons, and it recovers when it slips." >}}

**What I built.** I've worked the pipeline end to end: teleoperation rigs with
real leader arms driving simulated followers so demonstrations move like a human;
data collection and stage annotation; training the base policies (VLA, ACT,
diffusion); iterative training, where rollouts from the current policy are scored
and fed back in to improve the next one; and then residual RL on top of that
base. Also the Trossen client–server policy server, and the
sim → Trossen → Franka validation protocol. And
I adapted TD3-BC to a residual action space, which hadn't been done — the
regularisation weight in the paper is scaled for full actions, so I re-derived
it and bounded the correction.

→ [The residual training loop](notes/residual-rl/architecture/), with the
architecture diagram.

### Do dense rewards actually help?

*Master's thesis · "Vision-Based Dense Rewards for Finetuning Manipulation
Policies via Reinforcement Learning" · simulation study in Robosuite*

Sparse rewards are supposed to be the thing that kills reinforcement learning on
a real arm, so dense, vision-based reward models should help. I spent a thesis
testing whether that's true, and the headline answer is **no — not where people
assume it is.**

**Reward models are not interchangeable.** I benchmarked five vision-based reward
models — TCC, SARM, ROBOReward, ROBOMeter, TOPReward — on in-distribution,
out-of-distribution and non-monotonic trajectories. Stage-aware models stayed
robust and correctly registered stage *regressions*. The generalist
vision-language models hallucinated reward on out-of-distribution motion,
responding to visual change rather than task progress.

**Reward-aligned behaviour cloning works, cheaply.** Weighting demonstration
frames by task progress beat vanilla BC at every dataset size — 95.6% vs 87.6%
success at 300 demonstrations. TCC matched the much heavier SARM while needing
only 20 labelled episodes against roughly 100.

**The negative result is the interesting one.** Inside residual RL, starting from
a strong BC base (~85%), stage-aware potential-based shaping was *statistically
indistinguishable from a sparse binary reward*. The dense signal bought nothing.
Dense rewards likely pay off from weak or random policies — not from a good one.

**And the failure mode was fixable.** Residual RL collapses early because uniform
action scaling perturbs orientation along with translation. Per-dimension
scaling, plus warming up actor *and* critic with TD3-BC, largely removes that dip.

→ [Benchmarking a reward model before you trust it](notes/reward-modelling/benchmarking/)

### Smart Robotics Platform

*BMW Next Generation Robotics · internship · 2025*

BMW's in-house robotics platform, built to replace a third-party stack. I worked
across ROS 2 middleware, the HMI front and back end, IT/OT connectivity, CI/CD,
Docker Compose orchestration, waypoint management and behaviour trees — and
re-architected the connectivity layer from synchronous to asynchronous messaging
to keep it stable under full container load on the industrial PC.

### Sidewalk navigation for last-mile delivery robots

*M.Eng research · 2024–present · two publications*

Production C++ and ROS 2. I adapted the Lanelet2 HD-map framework to sidewalks,
translating OpenStreetMap coordinates into local UTM for global planning, and
built a real-time waypoint correction module using depth and semantic
segmentation — because OSM sidewalk geometry is wrong often enough that a
map-following robot drifts toward the curb.

Also in the same system: a quintic Bézier local trajectory planner with C2/G2 (curvature) continuity,
and Dynamic Window Approach (DWA) velocity profiling extended to respect the
robot's kinematic and dynamic constraints.

→ [Publications](publications/)

## Before this

Two years as a DevOps engineer at Accenture — CI/CD across Azure, AWS and
SharePoint, Docker, Azure Key Vault, C# and PostgreSQL. At the time it felt like
a detour away from robotics. It wasn't: it's the layer everything else sits on,
and it's why deployment and reproducibility are the parts of robot learning I
find straightforward rather than annoying.

Before that, a B.Tech in Mechanical Engineering at Karunya University — where the
physical intuition comes from.

## Tools

**Languages & runtime** — Python, C++, ROS 2, Linux, Docker, Git, CI/CD, AWS, Azure

**Learning** — PyTorch, JAX, SAC, TD3, RLPD, DSRL, DiffQL, residual RL, ACT,
diffusion policies, vision-language-action models

**Simulation & vision** — MuJoCo, robosuite, Gazebo, OpenCV, MoveIt Pro, Weights & Biases

**Hardware** — Trossen, Franka dual-arm, teleoperation rigs

Codebases I've read properly rather than skimmed: IBRL, SERL, HIL-SERL, ResFiT,
LeRobot, SARM, Pi0.5.

## Get in touch

Email is best: [abhishek.nannuri@outlook.com](mailto:abhishek.nannuri@outlook.com).
I'm in Munich, looking for work in robot learning and foundation models for
manipulation.
