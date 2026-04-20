import { useEffect } from "react";
import ScrollReveal from "scrollreveal";

export function useScrollReveal() {
  useEffect(() => {
    // Vérifier si ScrollReveal est disponible
    if (typeof window === "undefined") return;

    // Configuration de ScrollReveal
    const sr = ScrollReveal({
      reset: false,
      distance: "60px",
      duration: 1000,
      delay: 100,
      easing: "cubic-bezier(0.5, 0, 0, 1)",
      opacity: 0,
      scale: 0.95,
      viewFactor: 0.2,
    });

    // Animations pour chaque type de reveal
    sr.reveal(".reveal-top", {
      origin: "top",
      interval: 100,
    });

    sr.reveal(".reveal-bottom", {
      origin: "bottom",
      interval: 100,
    });

    sr.reveal(".reveal-left", {
      origin: "left",
      interval: 100,
    });

    sr.reveal(".reveal-right", {
      origin: "right",
      interval: 100,
    });

    sr.reveal(".reveal-zoom", {
      scale: 0.8,
      interval: 100,
    });

    // Stagger effect for children
    sr.reveal(".stagger-children > *", {
      interval: 150,
      origin: "bottom",
      distance: "30px",
    });

    // Cleanup
    return () => {
      if (sr && sr.destroy) {
        sr.destroy();
      }
    };
  }, []);
}
