import { useState, useEffect, useRef } from "react";
import "./styles/hero.css";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);
  const heroRef = useRef(null);

  const slides = [
    {
      image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
      title: "Réservez votre prochain voyage vers diverses destinations touristiques",
      subtitle: "Rejoignez-nous pour des voyages qui allient luxe et confort.",
    },
    {
      image: "https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg",
      title: "Découvrez des expériences uniques à travers le monde",
      subtitle: "Des circuits sur mesure pour des souvenirs inoubliables.",
    },
    {
      image: "https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg",
      title: "Explorez les trésors cachés des médinas ancestrales",
      subtitle: "Imprégnez-vous de l'authenticité et de la culture locale.",
    },
    {
      image: "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg",
      title: "Vivez des aventures inoubliables en pleine nature",
      subtitle: "Des expériences uniques qui resteront gravées dans votre mémoire.",
    }
  ];

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setFade(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // 3D Tilt Effect
  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const { width, height, left, top } = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    heroRef.current.style.transform = `
      rotateY(${x * 8}deg)
      rotateX(${-y * 8}deg)
    `;
  };

  const resetTilt = () => {
    if (heroRef.current) {
      heroRef.current.style.transform = "rotateY(0deg) rotateX(0deg)";
    }
  };

  return (
    <section
      className="hero-section"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`hero-slide ${currentSlide === index && fade ? "active" : ""}`}
          style={{ backgroundImage: `url('${slide.image}')` }}
        >
          <div className="hero-overlay">
            <div className="hero-content">
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-subtitle">{slide.subtitle}</p>
              <div className="hero-buttons">
<<<<<<< HEAD
                <a href="services/circuits" className="hero-btn-primary">
=======
                <a href="services/voyages" className="hero-btn-primary">
>>>>>>> c6840e06f0ea336640e2e35bfccde823661c4382
                  Explorer les voyages
                </a>
                <a href="/customize-tour" className="hero-btn-secondary">
                  Personnaliser le circuit
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="hero-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setFade(false);
              setTimeout(() => {
                setCurrentSlide(index);
                setFade(true);
              }, 500);
            }}
            className={`hero-dot ${currentSlide === index ? "active" : ""}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
