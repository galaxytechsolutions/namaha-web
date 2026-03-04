import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

// 🔹 Static images
const Images = [
  { id: 1, url: "/hero-1.png" },
  { id: 2, url: "/hero-2.png" },
  { id: 3, url: "/hero-3.png" },
];

// 🔹 Static hero text
const HERO_CONTENT = [
  {
    title: "Temples Teerth Tatva within your reach",
    subtitle:
      "Connect to sacred teerth kshetras and perform pujas from anywhere. Get Prasad at your doorstep.",
    twoButtons: false,
    // singleButtonLabel: 'Explore Now',
  },
  {
    title: "Sacred Pujas, Performed at Holy Teerth Kshetras",
    subtitle:
      "Perform Pujas and watch your names and gotras being chanted from the comfort of your homes",
    twoButtons: false,
  },
  {
    title: "Your Sankalpa, Performed Where It Truly Matters",
    subtitle:
      "Worship the divine deities and receive blessings with recorded videos and Prasad from your homes.",
    twoButtons: false,
    // singleButtonLabel: 'Book Now',
  },
];

const TRUST_STRIP_ITEMS = [
  { id: 1, icon: "shield", text: "Pujas Performed by Qualified Veda Pandits" },
  { id: 2, icon: "shield", text: "Puja Recordings within 2-4 days" },
  { id: 3, icon: "shield", text: "Prasad at your Doorstep in 7-10 days" },
];

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState([]);

  // ✅ Load slides from STATIC images
  useEffect(() => {
    const slides = Images.map((img, index) => ({
      id: img.id,
      image: img.url,
      ...HERO_CONTENT[index % HERO_CONTENT.length],
    }));

    setHeroSlides(slides);
  }, []);

  // ✅ Auto slide
  useEffect(() => {
    if (heroSlides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSlides]);

  const goToSlide = (index) => setCurrentSlide(index);

  return (
    <div className="App">
      <main>
        <div className="home-hero-viewport">
        {/* ================= HERO ================= */}
        <section id="home" className="hero-section1">
          <div className="hero-carousel-track">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`hero-slide1 ${
                  index === currentSlide ? "hero-slide-active" : ""
                }`}
              >
                {/* Banner */}
                <img
                  src={slide.image}
                  alt="Puja Banner"
                  className="hero-bg-image1"
                />

                {/* Content - left side only */}
                <div className="hero-content1">
                  <div className="hero-text-stack">
                    <h1>{slide.title}</h1>
                    <p className="hero-subtitle">{slide.subtitle}</p>
                  </div>
                  <div className="hero-buttons">
                    <Link to="/puja" className="hero-btn hero-btn-solid">
                      Book Puja
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="hero-carousel-dots">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                className={`hero-dot ${
                  index === currentSlide ? "hero-dot-active" : ""
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
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

      {/* Floating WhatsApp – direct link, opens in new tab, no popup */}
      <a
        href="https://wa.me/9059926363"
        target="_blank"
        rel="noopener noreferrer"
        className="wa-fab"
        aria-label="Chat on WhatsApp"
      >
        <span className="wa-fab-icon" aria-hidden="true">
          <svg
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            className="wa-fab-svg"
          >
            <path
              d="M16 3C9.385 3 4 8.385 4 15c0 2.119.56 4.086 1.54 5.802L4 29l8.47-1.512A11.86 11.86 0 0 0 16 27c6.615 0 12-5.385 12-12S22.615 3 16 3Z"
              fill="#25D366"
            />
            <path
              d="M16 5.25C10.64 5.25 6.25 9.64 6.25 15c0 2.03.63 3.92 1.82 5.54l-.75 3.89 3.96-.72A9.67 9.67 0 0 0 16 24.75c5.36 0 9.75-4.39 9.75-9.75S21.36 5.25 16 5.25Z"
              fill="#fff"
            />
            <path
              d="M20.7 18.3c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.88-.79-1.47-1.77-1.64-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.44-.52.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.57-.47-.5-.67-.5-.17 0-.37-.02-.57-.02-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.46 0 1.45 1.07 2.85 1.22 3.05.15.2 2.1 3.21 5.1 4.5.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.43-.07-.13-.27-.2-.57-.35Z"
              fill="#25D366"
            />
          </svg>
        </span>
      </a>
    </div>
  );
}

export default Home;
