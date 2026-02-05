import React, { useState, useEffect } from 'react';
import './Home.css';

const HERO_SLIDES = [
  {
    id: 1,
    title: 'Sri Mandir Special Chadhava',
    subtitle: 'Offers renewed prayers at sacred temples - from your home',
    twoButtons: true,
  },
  {
    id: 2,
    title: 'Special Puja with Sri Mandir',
    subtitle: 'Worship your deities at home and receive their divine blessings - only on Sri Mandir.',
    twoButtons: false,
    singleButtonLabel: 'Explore Now',
  },
  {
    id: 3,
    title: 'Book Puja at 1000+ Temples',
    subtitle: 'Get exclusive pujas performed by expert pandits and watch the completed rituals.',
    twoButtons: false,
    singleButtonLabel: 'Book Now',
  },
];

const TRUST_STRIP_ITEMS = [
  { id: 1, icon: null, text: 'Trusted by 30 million+ people' },
  { id: 2, icon: 'shield', text: '100% Secure' },
  { id: 3, icon: 'badge', text: "India's Largest App for Hindu Devotees" },
];


function Home() {
  // const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 10);
  //   };
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const goNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div className="App">
      {/* <header className={isScrolled ? 'header scrolled' : 'header'}>
        <nav className="nav-container">
          <div className="logo">
            <div className="logo-icon">🪔</div>
            <span>Seva</span>
          </div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#puja">Puja</a></li>
            <li><a href="#chadhava">Chadhava</a></li>
            <li><a href="#temples">Temples</a></li>
            <li><a href="#library">Library</a></li>
            <li><a href="#astro">Astro</a></li>
            <li><a href="#tools">Tools</a></li>
          </ul>
          <div className="nav-right">
            <select className="language-selector">
              <option>English</option>
              <option>Hindi</option>
            </select>
            <div className="menu-toggle">☰</div>
          </div>
        </nav>
      </header> */}

      <main>
        <section id="home" className="hero-section">
          <button
            type="button"
            className="hero-carousel-prev"
            onClick={goPrev}
            aria-label="Previous slide"
          >
            ←
          </button>

          <div className="hero-carousel-track">
            {HERO_SLIDES.map((slide, index) => (
              <div
                key={slide.id}
                className={`hero-slide ${index === currentSlide ? 'hero-slide-active' : ''}`}
              >
                <div className="hero-content">
                  <h1>{slide.title}</h1>
                  <p className="hero-subtitle">{slide.subtitle}</p>
                  <div className="hero-buttons">
                    {slide.twoButtons ? (
                      <>
                        <button type="button" className="hero-btn hero-btn-outline">Install App</button>
                        <button type="button" className="hero-btn hero-btn-solid">Explore Now</button>
                      </>
                    ) : (
                      <button type="button" className="hero-btn hero-btn-solid">
                        {slide.singleButtonLabel || 'Explore Now'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="hero-carousel-next"
            onClick={goNext}
            aria-label="Next slide"
          >
            →
          </button>

          <div className="hero-carousel-dots">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={`hero-dot ${index === currentSlide ? 'hero-dot-active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentSlide ? 'true' : undefined}
              />
            ))}
          </div>
        </section>
        <div className="trust-strip-wrap">
          <div className="trust-strip-scroll">
            <div className="trust-strip-inner">
              {[...TRUST_STRIP_ITEMS, ...TRUST_STRIP_ITEMS].map((item) => (
                <span key={`${item.id}-${item.text}`} className="trust-strip-item">
                  {item.icon === 'shield' && (
                    <span className="trust-strip-icon trust-icon-shield" aria-hidden="true">✓</span>
                  )}
                  {item.icon === 'badge' && (
                    <span className="trust-strip-icon trust-icon-badge" aria-hidden="true">1</span>
                  )}
                  <span className="trust-strip-text">{item.text}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;