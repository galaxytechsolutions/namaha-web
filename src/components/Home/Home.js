import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

// Images from public/mobile (fallback to public root if mobile not present)
const Images = [
  { id: 1, url: "/banner-fierce-protection.png", mobileUrl: "/mobile/SHRI AAUM WEB BANNER NEW1 - 1.jpg.jpeg" },
  { id: 2, url: "/banner-ram-navami.png", mobileUrl: "/mobile/ram-navami-special.png" },
  { id: 3, url: "/banner-durga.png", mobileUrl: "/mobile/durga.png" },
];

const HERO_CONTENT = [
  {
    title: "Awaken Fierce Protection",
    subtitle: "Powerful temple Mahapujas from sacred Ujjain kshetras to remove doshas, negativity and planetary obstacles.",
  },
  {
    title: "Ram Navami Special",
    subtitle: "Shri Ram Janmotsav & Hanuman Sankat Mochan Mahapuja at Ram Janmabhoomi & Hanuman Garhi, Ayodhya.",
  },
  {
    title: "Awaken Your Shakti Celebrate Chaitra Navratri",
    subtitle: "Lalita Gadhkalika Vindhyavasini. Receive the blessings of Adi Shakti.",
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

  useEffect(() => {
    const slides = Images.map((img, index) => ({
      id: img.id,
      image: img.url,
      mobileImage: img.mobileUrl || img.url, // prefer mobile; fallback to url
      ...HERO_CONTENT[index % HERO_CONTENT.length],
    }));
    setHeroSlides(slides);
  }, []);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides]);

  const goToSlide = (index) => setCurrentSlide(index);
  const slide = heroSlides[currentSlide];

  return (
    <div className="App">
      <main>
        <div className="home-hero-viewport">
          {/* ================= HERO ================= */}
          <section id="home" className="home-hero-section">
            <div className="home-hero-inner">
              {/* Div 1: content — desktop: left | mobile: bottom */}
              <div className="home-hero-content">
                <div className="home-hero-text-stack">
                  <h1>{slide?.title || ""}</h1>
                  <p className="home-hero-subtitle">{slide?.subtitle || ""}</p>
                </div>
                <div className="home-hero-buttons">
                  <Link to="/puja" className="home-hero-btn home-hero-btn-solid">
                    Book Puja
                  </Link>
                </div>
              </div>
              {/* Div 2: image — desktop: right | mobile: top | gradient overlay on image only */}
              <div className="home-hero-image-wrap">
                {heroSlides.map((s, index) => (
                  <img
                    key={s.id}
                    src={s.mobileImage || s.image}
                    alt=""
                    onError={(e) => {
                      if (e.target.src !== s.image) e.target.src = s.image;
                    }}
                    className={`home-hero-bg-image ${index === currentSlide ? "home-hero-bg-image-active" : ""}`}
                  />
                ))}
                <div className="home-hero-gradient-mobile" aria-hidden="true" />
                <div className="home-hero-gradient-desktop" aria-hidden="true" />
              </div>
            </div>

            <div className="home-hero-carousel-dots">
              {heroSlides.map((s, index) => (
                <button
                  key={s.id}
                  className={`home-hero-dot ${index === currentSlide ? "home-hero-dot-active" : ""}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </section>

          <div className="trust-strip-wrap">
            <div className="trust-strip-scroll">
              <div className="trust-strip-inner">
                {[...TRUST_STRIP_ITEMS, ...TRUST_STRIP_ITEMS].map((item, index) => (
                  <span key={index} className="trust-strip-item">
                    {item.icon === "shield" && <span className="trust-strip-icon">✓</span>}
                    {item.icon === "badge" && <span className="trust-strip-icon">1</span>}
                    <span className="trust-strip-text">{item.text}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
