import { useEffect, useState } from "react";

/**
 * A React hook that observes a list of element IDs and returns the ID of the one currently active in the viewport.
 * Uses IntersectionObserver for high performance and accuracy.
 */
export function useScrollSpy(ids: string[], options?: IntersectionObserverInit) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (ids.length === 0) return;

    const elements = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const visibilityMap = new Map<string, number>();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visibilityMap.set(entry.target.id, entry.intersectionRatio);
      });

      // Find the element with the maximum intersection ratio
      let maxRatio = -1;
      let currentActive = "";

      visibilityMap.forEach((ratio, id) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          currentActive = id;
        }
      });

      // If we found an active element with visible percentage > 0, set it
      if (currentActive && maxRatio > 0) {
        setActiveId(currentActive);
      }
    }, {
      rootMargin: "-20% 0px -60% 0px", // Trigger when element occupies middle/upper part of viewport
      threshold: [0, 0.25, 0.5, 0.75, 1.0],
      ...options
    });

    elements.forEach(el => observer.observe(el));

    // Fallback: Check scroll position initially
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setActiveId(ids[0]);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [ids, options]);

  return activeId || ids[0];
}
