import { useEffect, useRef, useState } from "react";
import "./styles/cta.css";

export default function CTA() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // ✅ مراقبة التمرير
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.3, triggerOnce: false }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`cta-section ${isVisible ? "visible" : ""}`}
    >
      <div className="cta-overlay"></div>

      <div className="cta-container">
        <div className="cta-wrapper">
          <div className="cta-content">
            <h2 className="cta-title">
              Prêt à voyager avec nous ?
            </h2>
            <p className="cta-description">
              Réservez votre prochain voyage avec nous ! Des offres exclusives,
              des prix compétitifs et un support client 24h/24 et 7j/7 vous attendent.
              Votre prochaine destination n'est qu'à un clic !
            </p>
            <a href="/contact" className="cta-button">
              Réservez votre voyage maintenant
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
