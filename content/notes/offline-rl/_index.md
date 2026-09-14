---
title: Offline RL
weight: 2
description: >-
  Learning from a fixed dataset with no environment interaction — how it differs
  from behaviour cloning, and why extrapolation error is the central problem.
---

Online RL assumes you can keep interacting with the environment. On a real robot
that assumption is expensive and sometimes unsafe. Offline RL asks what you can
learn from a dataset collected once, by some other policy, with no further
interaction during training.

{{< cards >}}
  {{< card link="paradigms/" title="Comparing RL paradigms" subtitle="Online, off-policy and offline — what each assumes about where data comes from." >}}
{{< /cards >}}
