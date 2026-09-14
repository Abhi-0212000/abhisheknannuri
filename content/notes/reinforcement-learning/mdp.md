---
title: MDPs
weight: 1
---

The frame every one of these algorithms is solving inside. Worth being precise
about, because most real-robot problems quietly violate one of its assumptions.

{{< diagram
    src="chapter2_background/mdp_diagram.svg"
    alt="Markov Decision Process: an agent observes a state, takes an action, and the environment returns a reward and the next state."
    caption="The agent–environment loop." >}}

<!-- Your notes: the Markov assumption and where it breaks on a real cell —
     partial observability from a fixed camera, latency in the control loop. -->
