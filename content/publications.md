---
title: Publications
description: >-
  Peer-reviewed work on outdoor navigation for autonomous mobile robots —
  extending Lanelet2 HD maps to sidewalks, and a three-layer environment model
  for last-mile delivery robots.
toc: true
---

Both papers come from the same research group at Schmalkalden University of
Applied Sciences, and from the same question: **how does a last-mile delivery
robot know where the pavement is, when the map it was given is imperfect?**

## Adaptive Global Navigation for Sidewalk Robots

*Integrating OSM Lanelets with Real-Time Pavement Segmentation-Based Correction*

**Abhishek Nannuri**, Mohamed Wael Mohamed Lotfy Abdeltawab, Swaraj Tendulkar,
Frank Schrödel — *first author*
IEEE CoDIT 2026 · pp. 3503–3508 · peer-reviewed

{{< still src="sidewalk-nav"
    alt="System architecture for sidewalk global navigation: an annotated Lanelet2 map derived from OpenStreetMap generates global waypoints, while onboard camera segmentation of the pavement produces local centre points; both are transformed into a common UTM32 frame and fused in a waypoint correction block."
    caption="Map-based global planning and camera-based local perception, fused in a common UTM32 frame." >}}

### The problem

Self-driving cars navigate with HD maps — expensive, commercially licensed,
slow to update, and heavy to compute over. Delivery robots can't justify that,
so the alternative is OpenStreetMap: free, globally available, quickly
updateable, and cheap to run.

The catch is precision. A car can drift 30 cm within its lane and nothing
happens. A robot on a pavement that drifts 30 cm goes over the curb into traffic.
And OSM pavement geometry, being hand-contributed, isn't accurate to that
tolerance.

The existing workaround is to drive every route first with GNSS and record
reference waypoints by hand. That works for one route and cannot scale to a city.

### What the paper does

**Extends Lanelet2 to pedestrian space.** Lanelet2 is the standard HD-map
framework for structured road networks. The paper annotates OSM data in JOSM
against Lanelet2 primitives — but for pavements and open campus areas rather
than lanes, with traffic rules re-parameterised for a robot: speed limits,
traversability, and tags marking crowded areas. That lets the global planner
choose between routes on more than distance, e.g. avoiding high pedestrian
density while still optimising traversal time.

**Puts everything in one metric frame.** Map coordinates arrive as latitude and
longitude in decimal degrees. Those, the onboard GPS and the camera output are
all converted into UTM32, so planning is metric rather than angular.

**Corrects the map with what the robot sees.** A depth camera semantically
segments the pavement, extracts its boundaries and centre line, and transforms
those into the global frame. The correction block then fuses the two sources
weighted by how much the vision system trusts itself:

$$P_{\text{corrected}} = \alpha \cdot P_{\text{vision}} + (1-\alpha) \cdot P_{\text{map}}$$

where $\alpha$ is the segmentation confidence. The fusion is adaptive: on a
narrow pavement the vision term dominates and supplies precise centreline
guidance; once the robot reaches open campus ground, where a model trained on
sidewalks is out of its depth, its weight drops automatically.

### Why it matters

It keeps the cheap map and recovers the missing precision from perception,
rather than buying accuracy from a commercial HD-map provider or pre-driving
every route. That is the difference between a demo on one street and something
you could annotate a whole city with.

## Multilayer Environment Model for Outdoor AMR Navigation

Swaraj Tendulkar, **Abhishek Nannuri**, Sagar Nagdev, Frank Schrödel
Preprint · [doi:10.13140/RG.2.2.11843.36640](https://doi.org/10.13140/RG.2.2.11843.36640)

{{< still src="multilayer-map.jpg"
    alt="Three-layer environment model for outdoor autonomous mobile robots, comprising a global layer for Lanelet-based waypoint generation, a static layer for LiDAR landmark mapping, and a dynamic layer for pedestrian movement prediction."
    caption="The three layers, and what each is responsible for." >}}

The companion paper, and the architecture the sidewalk work sits inside.

Autonomous vehicles converged on a three-layer HD-map structure — HERE, TomTom
and NDS all use variants of road model, lane model, localisation model. Mobile
robots have no such standard, despite facing a harder version of the problem:
pedestrians, shared space, and no lane markings to localise against.

This paper proposes the equivalent for outdoor AMRs:

- **Global layer** — Lanelet-based waypoint generation. This is the layer the
  sidewalk paper above develops.
- **Static layer** — LiDAR point-cloud landmark generation and mapping, with
  real-time collection of pedestrian pose data.
- **Dynamic layer** — predicting pedestrian movement from that collected pose
  data.

The contribution is integrative rather than a single algorithm: it puts
geometric path planning and semantic understanding of a moving pedestrian
environment into one model, and argues for standardising it the way the AV
industry already has.

## Citing this work

For the diagrams and notes on this site, see [Licence and citation](../license/).
