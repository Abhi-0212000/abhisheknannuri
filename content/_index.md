---
title: Abhishek Nannuri
description: >-
  Robotics software engineer in Munich. Reinforcement learning for manipulation
  at BMW Next Generation Robotics — residual RL, vision-based rewards, and real
  hardware deployment.
toc: false
---

Robotics software engineer in Munich. I do reinforcement learning for
manipulation at **BMW Next Generation Robotics**, and the systems work that gets
it onto real hardware.

[abhishek.nannuri@outlook.com](mailto:abhishek.nannuri@outlook.com) ·
[GitHub](https://github.com/Abhi-0212000) ·
[LinkedIn](https://www.linkedin.com/in/abhi-nannuri-02122000/) ·
[CV](cv.pdf)

{{< clip src="ecu-assembly" hero="true"
        caption="ECU assembly on a Franka dual-arm cell — one of the live production tasks I work on at BMW." >}}

<dl class="facts">
  <dt>Now</dt>
  <dd>M.Eng thesis + working student, BMW Next Generation Robotics</dd>
  <dt>Field</dt>
  <dd>Residual RL and vision-based rewards for contact-rich manipulation</dd>
  <dt>Result</dt>
  <dd>Cube pick-and-insert 30% &rarr; near-perfect · ECU assembly running on a Franka dual-arm cell in production</dd>
  <dt>Also</dt>
  <dd>Two publications in autonomous navigation · C++/ROS&nbsp;2 · 2 years DevOps</dd>
  <dt>Wants</dt>
  <dd>Robot learning and foundation models for manipulation</dd>
</dl>

I got here sideways: mechanical engineering, then two years as a DevOps
engineer, then C++ and ROS 2 navigation research, then robot learning. It means
I've written the Dockerfile and the reward function for the same system.

I'd also rather change fifteen files and get the structure right than add one
more function to the wrong place. Worth knowing before you hire me.

I keep [technical notes](notes/) on the algorithms I work with, built around the
architecture diagrams I drew for my thesis.

## Work

### Residual RL for contact-rich manipulation

*Master's thesis · BMW Next Generation Robotics · 2025–present*

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

**What I built.** The teleoperation pipeline, with real leader arms driving
simulated followers so demonstrations move like a human. The Trossen
client–server policy server. The sim → Trossen → Franka validation protocol. And
I adapted TD3-BC to a residual action space, which hadn't been done — the
regularisation weight in the paper is scaled for full actions, so I re-derived
it and bounded the correction.

→ [The residual training loop](notes/residual-rl/architecture/), with the
architecture diagram.

### Vision-based dense rewards

*My own proposal · benchmarked in simulation, now adapting to real hardware*

RL on a real arm dies on sparse rewards. I proposed repurposing Temporal
Cycle-Consistency — built to align video and audio — as a progress reward
instead. An industrial task is a repeatable human procedure, so you can match
the current observation against features from human demonstrations and read off
task progress. Simpler than SARM, and it matched or beat it.

I benchmarked five reward models against a stage-based ground truth on three
splits: in-distribution, out-of-distribution, and non-monotonic runs with
reversals. Stage-aware models track real progress; reward-only models get fooled
by motion that never completes the task.

→ [Benchmarking a reward model before you trust it](notes/reward-modelling/benchmarking/)

### Smart Robotics Platform

*BMW Next Generation Robotics · internship · 2025*

BMW's in-house robotics platform, built to replace a third-party stack. I worked
across ROS 2 middleware, the HMI front and back end, IT/OT connectivity, CI/CD,
Docker Compose orchestration, waypoint management and behaviour trees.

Ahead of a management demo, the modules kept failing on the industrial PC.
Reviewing pull requests, I found the connectivity layer making synchronous Kafka
calls that blocked once all containers were under load. I re-architected it to
asynchronous messaging overnight and defended the design to the software
architect the next morning.

### Sidewalk navigation for last-mile delivery robots

*M.Eng research · 2024–present · two publications*

Production C++ and ROS 2. I adapted the Lanelet2 HD-map framework to sidewalks,
translating OpenStreetMap coordinates into local UTM for global planning, and
built a real-time waypoint correction module using depth and semantic
segmentation — because OSM sidewalk geometry is wrong often enough that a
map-following robot drifts toward the curb.

Also in the same system: a quintic Bézier local planner with C2/G2 continuity,
and DWA velocity profiling extended to respect the robot's kinematic and dynamic
constraints.

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
