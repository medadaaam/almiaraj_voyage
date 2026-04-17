import { useState, useEffect } from "react";
import "./hero.css";
import Search from "./search";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);

  const slides = [
    {
      image:
        "https://webfol.travedeus.com/storage//01KDH98HZXCQBKZE1Q69PNKM9C.webp",
      title:
        "Réservez votre prochain voyage vers diverses destinations touristiques",
      subtitle: "Rejoignez-nous pour des voyages qui allient luxe et confort.",
    },
    {
      image:
        "https://webfol.travedeus.com/storage//01KDH9NJXN8BETZVAWBG8TJH8C.webp",
      title: "Découvrez des expériences uniques à travers le monde",
      subtitle: "Des circuits sur mesure pour des souvenirs inoubliables.",
    },
  ];

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

  return (
    <section className="relative w-screen top-0 flex flex-col items-center justify-center w-full min-h-screen -mt-24 bg-[#f9fafb] -ml-[1vw] -mr-[80vw]">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`hero-bg-slide absolute inset-0 bg-center bg-cover bg-no-repeat transition-opacity duration-1000 opacity-100 ${
            currentSlide === index && fade ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url('${slide.image}')` }}
        >
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="hero-text text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-gray-100 animate-fade-in-down">
                {slide.title}
              </h1>
              <p className="hero-text mx-auto mt-5 text-xl md:text-2xl font-normal text-gray-300 max-w-2xl animate-fade-in-up">
                {slide.subtitle}
              </p>
              <div className="hero-text flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fade-in-up animation-delay-500">
                <a
                  href="#trips"
                  className="bg-[#fb923c] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg hover:bg-[#2f6f85] transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Explorer les voyages
                </a>
                <a
                  href="/customize-tour"
                  className="text-center border-2 border-white text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg hover:bg-white hover:text-[#2f6f85] transform hover:scale-105 transition-all duration-300"
                >
                  Personnaliser le circuit
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dots indicators */}
      {/* <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
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
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "w-8 bg-[#fb923c]"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div> */}

    </section>
  );
}
