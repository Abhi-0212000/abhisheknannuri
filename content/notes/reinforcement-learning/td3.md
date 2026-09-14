---
title: TD3
weight: 3
---

Twin Delayed DDPG. Three changes to DDPG, each fixing a specific failure:
clipped double-Q against overestimation, delayed actor updates, and target
policy smoothing.

{{< diagram
    src="chapter2_background/td3_arch_vertical.svg"
    alt="TD3 architecture, showing twin critics, the delayed actor update and target policy smoothing."
    caption="TD3." >}}

TD3 matters here beyond its own merits: the residual actor in ResFiT is
TD3-style, and the offline variant TD3-BC is what I adapted to a residual action
space.

<!-- Your notes: the TD3-BC regularisation weight, why it is scaled for full
     actions, and how you re-derived it for a bounded residual. -->

## See also

- [Residual RL architecture](../../residual-rl/) — where the TD3 actor is used
