import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, CheckCircle } from "lucide-react";
import "./styles/testimonials.css";

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      name: "RHITA DGUIGOU",
      location: "Maroc",
      image: './images/Cl1.png',
      rating: 5,
      text: "Très bonne expérience avec cette agence ! L'équipe est professionnelle, à l'écoute et très réactive. Tout était parfaitement organisé du début à la fin (transport, hébergement, activités). Je recommande vivement pour des vacances sans stress.",
      verified: true,
      date: "Avril 2026"
    },
    {
      id: 2,
      name: "Soukaina Ezzibiri",
      location: "Maroc",
      image: "./images/Cl2.png",
      rating: 5,
      text: "L'agence Al-Miraj offre le meilleur service et la meilleure gestion.",
      verified: true,
      date: "Janvier 2026"
    },
    {
      id: 3,
      name: "Hafid Chahour",
      location: "Maroc",
      image: "./images/Cl3.png",
      rating: 5,
      text: "اناس محترفون تعاملت مع مجموعة من السائقين عندهم شكرا لكم تشعر معهم بالارتياح و الامان وفقكم الله ",
      verified: true,
      date: "Avril 2025"
    },
    {
      id: 4,
      name: "hamza benhidi",
      location: "Maroc",
      image: "./images/Cl4.png",
      rating: 4.9,
      text: "Goood staff good service the best travel agency in the word",
      verified: true,
      date: "Février 2024"
    }
  ];

  const totalSlides = testimonials.length;

  // Autoplay
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    resetAutoplay();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    resetAutoplay();
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    resetAutoplay();
  };

  const resetAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 5000);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="star-filled" />);
    }
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="star-half-wrapper">
          <Star className="star-filled half" />
          <Star className="star-empty half" />
        </div>
      );
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="star-empty" />);
    }
    return stars;
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">

        {/* Header */}
        <div className="testimonials-header">
          <span className="testimonials-badge">Ils nous font confiance</span>
          <h2 className="testimonials-title">
            Ce que nos clients disent de nous
          </h2>
          <p className="testimonials-subtitle">
            Des milliers de voyageurs satisfaits partagent leur expérience
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="testimonials-slider">

          {/* Cards Container */}
          <div className="testimonials-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-content">
                  {/* Quote Icon */}
                  <div className="quote-icon">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  {/* Text */}
                  <p className="testimonial-text">"{testimonial.text}"</p>

                  {/* Rating */}
                  <div className="testimonial-rating">
                    {renderStars(testimonial.rating)}
                    <span className="rating-value">{testimonial.rating}</span>
                  </div>

                  {/* Author */}
                  <div className="testimonial-author">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="author-image"
                    />
                    <div className="author-info">
                      <div className="author-name">
                        {testimonial.name}
                        {testimonial.verified && (
                          <CheckCircle className="verified-badge" />
                        )}
                      </div>
                      <div className="author-location">{testimonial.location}</div>
                      <div className="author-date">{testimonial.date}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            className="slider-nav prev"
            onClick={prevSlide}
            aria-label="Précédent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            className="slider-nav next"
            onClick={nextSlide}
            aria-label="Suivant"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="slider-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`slider-dot ${currentSlide === index ? "active" : ""}`}
                onClick={() => goToSlide(index)}
                aria-label={`Aller au témoignage ${index + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
