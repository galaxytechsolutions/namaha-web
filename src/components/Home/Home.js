import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const TRUST_STRIP_ITEMS = [
  { id: 1, icon: "shield", text: "Pujas Performed by Qualified Veda Pandits" },
  { id: 2, icon: "shield", text: "Puja Recordings within 2-4 days" },
  { id: 3, icon: "shield", text: "Prasad at your Doorstep in 7-10 days" },
];

const HERO_SLIDES = [
  {
    id: "pooja",
    title: "Shri Aaum Special Pooja",
    description:
      "Experience divine rituals, sacred pujas, and personalized sankalps that bring peace, protection, and abundance into your life- from anywhere in the world.",
    ctaLabel: "Book Pooja",
    ctaTo: "/puja",
    image: "/images/Kshetra%20Element%202.png",
    imageAlt: "Sacred pooja thali, deepam and offerings",
  },
  {
    id: "chadava",
    title: "Shri Aaum Sacred Chadava",
    description:
      "Offer sacred chadavas at powerful kshetras. Invite divine grace, protection, and abundance into your life.",
    ctaLabel: "Offer Chadava",
    ctaTo: "/chadhava",
    image: "/images/Puja%20Element%201.png",
    imageAlt: "Sacred temple kshetra illustration",
  },
];

function Home() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="App">
      <main>
        <div className="home-hero-viewport">
          {/* ================= HERO ================= */}
          <section id="home" className="hero-modern">
            <div className="hero-modern-carousel">
              {HERO_SLIDES.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`hero-modern-slide ${index === activeSlide ? "hero-modern-slide-active" : ""}`}
                >
                  <div className="hero-modern-inner">
                    <div className="hero-modern-content">
                      <div className="hero-modern-block">
                        <h1>{slide.title}</h1>
                        <p>{slide.description}</p>
                        <Link to={slide.ctaTo} className="hero-btn hero-btn-solid">
                          {slide.ctaLabel}
                        </Link>
                      </div>
                    </div>
                    <div className="hero-modern-images" aria-hidden="true">
                      <div className="hero-modern-image-card">
                        <img src={slide.image} alt={slide.imageAlt} className="hero-modern-image" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="hero-modern-dots">
                {HERO_SLIDES.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    className={`hero-modern-dot ${index === activeSlide ? "hero-modern-dot-active" : ""}`}
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Show ${slide.title}`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Trust strip */}
          <div className="trust-strip-wrap">
            <div className="trust-strip-scroll">
              <div className="trust-strip-inner">
                {[...TRUST_STRIP_ITEMS, ...TRUST_STRIP_ITEMS].map(
                  (item, index) => (
                    <span key={index} className="trust-strip-item">
                      {item.icon === "shield" && (
                        <span className="trust-strip-icon">✓</span>
                      )}
                      {item.icon === "badge" && (
                        <span className="trust-strip-icon">1</span>
                      )}
                      <span className="trust-strip-text">{item.text}</span>
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;