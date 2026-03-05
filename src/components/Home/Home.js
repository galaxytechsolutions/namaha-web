import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

// 🔹 Static images
const Images = [
  {
    id: 1,
    url: "https://shriaaum.s3.ap-south-1.amazonaws.com/images/shriaaum1.jpeg",
  },
  {
    id: 2,
    url: "https://shriaaum.s3.ap-south-1.amazonaws.com/images/shriaaum2.jpeg",
  },
];

// 🔹 Static hero text
const HERO_CONTENT = [

  {
    title: "Awaken Fierce Protection",
    subtitle:
      "Powerful temple Mahapujas from sacred Ujjain kshetras to remove doshas, negativity and planetary obstacles.",
  },
  {
    title: "Ram Lalla Returns to His Divine Abode, This Ram Navami is historic",
    subtitle:
      "Join the sacred Ram Janmotsav & Hanuman Sankat Mochan Mahapuja",
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
    </div>
  );
}

export default Home;
