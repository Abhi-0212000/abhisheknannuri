---
title: Abhishek Nannuri
toc: false
---

Robotics software engineer in Munich. Reinforcement learning for manipulation,
and the systems work that gets it onto real hardware.

[abhishek.nannuri@outlook.com](mailto:abhishek.nannuri@outlook.com) ·
[GitHub](https://github.com/Abhi-0212000) ·
[LinkedIn](https://www.linkedin.com/in/abhi-nannuri-02122000/) ·
[CV](/cv.pdf)

{{< clip src="ecu-assembly" hero="true"
        caption="ECU assembly on a Franka dual-arm cell — one of the live production tasks I work on at BMW." >}}

I'm finishing an M.Eng in Mechatronics & Robotics, and doing my thesis inside
BMW's Next Generation Robotics group, where I also work as a working student.

My research is reinforcement learning for manipulation — taking policies that
learn from demonstrations and pushing them past the point where they plateau.
But a robot that works once in a lab is a small part of the job. The rest is the
teleoperation rig that collects the data, the container that ships the policy,
the pipeline that keeps any of it reproducible, and the long debugging session
at the seam between the controller, the middleware and the learning loop.

I got here sideways: mechanical engineering, then two years as a DevOps
engineer, then C++ and ROS 2 navigation research, then robot learning. It's an
odd path, and it means I've written the Dockerfile and the reward function for
the same system.

I'd also rather change fifteen files and get the structure right than add one
more function to the wrong place. Worth knowing before you hire me.

I keep [technical notes](notes/) on the algorithms I work with — mostly
reinforcement learning, with the architecture diagrams I drew for my thesis.

## Work

### Residual RL for contact-rich manipulation

*Master's thesis, BMW Next Generation Robotics · 2025 to now*

<div class="figure-pair">

{{< clip src="bc-baseline" pixelated="true"
        caption="Base behaviour-cloning policy on cube pick-and-insert, 3–5&nbsp;mm tolerance. It stalls on the fine alignment. ~30% success." >}}

{{< clip src="residual-rl" pixelated="true"
        caption="The same task after residual RL. Longer horizons, and it recovers when it slips." >}}

</div>

Behaviour cloning and vision-language-action policies learn a task from
demonstrations and then plateau, usually around 80%. The missing piece is
contact-rich precision, and more demonstrations don't buy it back — they're
expensive and they hit diminishing returns. Pure RL closes the gap but needs far
too many rollouts to be safe on a real arm, and a sparse reward gives almost no
signal in the real world.

ResFiT freezes the base policy and learns a small bounded residual on top with a
TD3-style actor. The base stays intact and the correction is bounded, so you get
a safety floor that fine-tuning the whole network can't give you. On the cube
pick-and-insert task above, this took the base policy from around 30% to
near-perfect. On ECU assembly — a live production task on a Franka dual-arm
cell — stage-gated success is high, and full-task reliability is still in
progress.

What I built: the teleoperation pipeline, with real leader arms driving
simulated followers so the demonstrations move like a human; the Trossen
client–server policy server; and the sim → Trossen → Franka validation protocol.
I also adapted TD3-BC to a residual action space, which hadn't been done — the
regularisation weight in the paper is scaled for full actions, so I re-derived
it from the maths and bounded the correction.

Nobody in the lab had run off-policy RL on real hardware before, so most of the
integration debugging was mine. The one worth telling: a precise placement task
oscillated back and forth on the real robot while simulation was fine. The
Trossen end-effector-pose API defaults to non-blocking and returns *before* the
arm has moved, so every observation captured the old pose and every delta-action
transition looked like a no-op. The fix was to respect a fixed control frequency
and read state on the next cycle, once the motion has settled.

Obvious in hindsight, invisible in sim. Most of what I do sits at that seam —
between the controller, the middleware and the learning loop.

### Vision-based dense rewards

*My own proposal · benchmarked in simulation, now adapting to real hardware*

RL on a real arm dies on sparse rewards. I proposed repurposing Temporal
Cycle-Consistency — built to align video and audio — as a progress reward
instead. An industrial task is a repeatable human procedure, so you can match
the current observation against features from human demonstrations and read off
how far along the task is. It's much simpler than SARM, and it matched or beat
it.

I benchmarked five reward models against a stage-based ground truth on three
splits: in-distribution, out-of-distribution, and non-monotonic runs with
reversals. Stage-aware models track real progress, while reward-only models get
fooled by motion that never completes the task. Which is really the lesson: a
baseline you only test on successful demonstrations tells you nothing.

### Smart Robotics Platform

*BMW Next Generation Robotics, internship · 2025*

BMW's in-house robotics platform, built to replace a third-party stack. I worked
across most of it: ROS 2 middleware, the HMI front and back end, IT/OT
connectivity modules, CI/CD, Docker Compose orchestration, waypoint management
and behaviour trees. Because I'd read and debugged so much of the codebase, I
ended up as one of the few people who could work across the whole platform
rather than one slice of it.

The fix I'm most pleased with: ahead of a management demo, with the senior
developers away and each of us shipping a last-minute feature, the modules kept
falling over on the industrial PC. Reviewing pull requests, I found the
connectivity layer making synchronous Kafka calls that blocked once all the
containers were under load. I re-architected it to asynchronous messaging
overnight, and defended the decision to the software architect the next morning.

### Sidewalk navigation for last-mile delivery robots

*M.Eng research · 2024 to now · two publications*

{{< still src="sidewalk-nav" alt="System architecture for sidewalk global navigation, showing the Lanelet2 HD-map layer feeding a global planner with a vision-based waypoint correction module on top." caption="Global planning on sidewalks, with a vision-based correction module sitting on top of the map layer." >}}

Production C++ and ROS 2. I adapted the Lanelet2 HD-map framework to sidewalks,
translating OpenStreetMap coordinates into local UTM for precise global
planning, and built a real-time waypoint correction module using depth and
semantic segmentation. It exists because OSM sidewalk geometry is wrong often
enough that a purely map-following robot drifts toward the curb edge.

Also in the same system: a quintic Bézier local trajectory planner with C2 and
G2 continuity, and DWA velocity profiling extended to respect the robot's
kinematic and dynamic constraints. Built as a modular ROS 2 architecture with
real exception handling and logging, because it had to run unattended.

Earlier work in the same area: EKF sensor fusion over IMU, GNSS and LIDAR for
state estimation, and visual odometry using SIFT matching and essential-matrix
decomposition.

## Before this

Two years as a DevOps engineer at Accenture. CI/CD across Azure, AWS and
SharePoint, Docker, secure credential handling with Azure Key Vault, C# and
PostgreSQL.

At the time it felt like a detour away from robotics. It wasn't. It's the layer
everything else sits on, and it's why deployment, reproducibility and getting
things to run on edge hardware are the parts of robot learning I find
straightforward rather than annoying.

Before that, a B.Tech in Mechanical Engineering at Karunya University — which is
where the physical intuition comes from.

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
I'm in Munich, and I'm looking for work in robot learning and foundation models
for manipulation.
