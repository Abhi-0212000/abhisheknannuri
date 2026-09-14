---
title: Publications
description: >-
  Peer-reviewed work on autonomous navigation for sidewalk and outdoor mobile
  robots — HD-map architectures, Lanelet2 on pavements, and vision-based path
  correction.
toc: true
---

Two papers from my M.Eng research on autonomous navigation, both on the same
problem: how a delivery robot knows where the pavement is when the map is wrong.

## Adaptive Global Navigation for Sidewalk Robots

*Integrating OSM Lanelets with Real-Time Pavement Segmentation-Based Correction*

**Abhishek Nannuri** (first author) · IEEE CoDIT 2026 · pp. 3503–3508 · peer-reviewed

{{< still src="sidewalk-nav"
    alt="System architecture for sidewalk global navigation: an OpenStreetMap-derived Lanelet2 map layer feeds a global planner, with a vision-based waypoint correction module using depth and semantic segmentation sitting on top."
    caption="The full pipeline. The map layer proposes a global path; the vision layer corrects it against what the robot actually sees." >}}

Last-mile delivery robots drive on pavements, but HD-map frameworks were built
for roads. Lanelet2 is the standard for structured road networks and assumes
lane geometry that sidewalks don't have.

**What the paper does.** Adapts Lanelet2 to sidewalks, translating OpenStreetMap
geographic coordinates into a local UTM frame so global path planning is metric
and precise rather than approximate. That alone isn't enough, because OSM
pavement geometry is frequently wrong — off by enough that a robot following the
map faithfully drifts toward the curb edge and falls off.

So the second half is a real-time correction module: depth camera plus semantic
segmentation of the pavement surface, continuously adjusting waypoints against
what the robot actually sees. The map proposes; vision disposes.

**Why it matters.** It decouples navigation quality from map quality. You can
deploy into a city whose OSM data was contributed by hand, without surveying
every pavement first.

## Multilayer Environment Model for Outdoor AMR Navigation

Preprint · under submission

{{< still src="multilayer-map.jpg"
    alt="Three-layer high-definition map architecture for outdoor autonomous mobile robot navigation, separating the layers used for global navigation and localisation."
    caption="The three-layer HD-map architecture." >}}

An extended three-layer HD-map architecture for outdoor autonomous mobile
robots. The contribution is structural: separating the map into layers that can
be updated, validated and swapped independently, rather than a single monolithic
representation that has to be regenerated whenever anything changes.

That gives a scalable, map-aware substrate for reliable global navigation and
localisation in complex urban environments — and it's the infrastructure the
sidewalk work above builds on.

## Citing this work

If you use the diagrams from this site, see [Licence and citation](../license/).
