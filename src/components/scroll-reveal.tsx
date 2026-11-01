"use client";

import { useEffect } from "react";

/** Adds data-shown to [data-animate] elements as they scroll into view (CSS does the motion). */
export function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-shown", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    const observeAll = () =>
      document.querySelectorAll("[data-animate]:not([data-shown])").forEach((el) => observer.observe(el));
    observeAll();

    // Project rows arrive after a fetch, so watch for new elements too.
    const mutations = new MutationObserver(observeAll);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}
