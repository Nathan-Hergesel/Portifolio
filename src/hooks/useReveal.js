import { useEffect } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useReveal() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const items = [...document.querySelectorAll(".reveal")];

    if (reducedMotion) {
      items.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6%" }
    );

    items.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 5, 4) * 55}ms`;
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, [reducedMotion]);
}
