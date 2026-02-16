import React, { useState, useEffect } from 'react';
import './Home.css';
import { fetchPujaList } from '../../data/pujaList'; // ✅ adjust path if needed

// 🔹 Static text content for hero slides
const HERO_CONTENT = [
  {
    title: 'Special Chadhava',
    subtitle: 'Offers renewed prayers at sacred temples - from your home',
    twoButtons: true,
  },
  {
    title: 'Special Puja with Shri aaum',
    subtitle: 'Worship your deities at home and receive their divine blessings - only on Sri Mandir.',
    twoButtons: false,
    singleButtonLabel: 'Explore Now',
  },
  {
    title: 'Book Puja at 1000+ Temples',
    subtitle: 'Get exclusive pujas performed by expert pandits and watch the completed rituals.',
    twoButtons: false,
    singleButtonLabel: 'Book Now',
  },
];

const TRUST_STRIP_ITEMS = [
  { id: 1, icon: 'shield', text: '100% Secure' },
  { id: 2, icon: 'badge', text: "India's best App" },
];

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState([]);

  // ✅ Fetch banners from API
  useEffect(() => {
    const loadBanners = async () => {
      const pujas = await fetchPujaList();

      console.log("✅ SpecialPuja mapped:", pujas);

      // 🔥 extract all banner urls from all pujas
      const banners = pujas.flatMap(puja => puja.bannerUrls || []);

      console.log("🖼️ All banners:", banners);

      // map banners to hero slides
      const slides = banners.map((banner, index) => ({
        id: index,
        image: banner,
        ...HERO_CONTENT[index % HERO_CONTENT.length], // rotate content
      }));

      setHeroSlides(slides);
    };

    loadBanners();
  }, []);

  // ✅ Auto slide
  useEffect(() => {
    if (heroSlides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSlides]);

  const goToSlide = (index) => setCurrentSlide(index);

 

  return (
    <div className="App">
      <main>

        {/* ================= HERO ================= */}
        <section id="home" className="hero-section1">



          <div className="hero-carousel-track">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`hero-slide1 ${index === currentSlide ? 'hero-slide-active' : ''}`}
              >
                {/* ✅ Banner Image */}
                <img
                  src={slide.image.url}
                  alt="Puja Banner"
                  className="hero-bg-image1"
                />


                {/* ✅ Overlay Content */}
                <div className="hero-content1">
                  <div className="hero-text-stack">
                    <h1>{slide.title}</h1>
                    <p className="hero-subtitle">{slide.subtitle}</p>
                  </div>

                  <div className="hero-buttons">
                    {slide.twoButtons ? (
                      <>
                        <button className="hero-btn hero-btn-outline">
                          Install App
                        </button>
                        {/* <button className="hero-btn hero-btn-solid">
                          Explore Now
                        </button> */}
                      </>
                    ) : (
                      <button className="hero-btn hero-btn-solid">
                        {slide.singleButtonLabel || 'Explore Now'}
                      </button>
                    )}
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
                className={`hero-dot ${index === currentSlide ? 'hero-dot-active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </section>

        {/* ================= TRUST STRIP ================= */}
        <div className="trust-strip-wrap">
          <div className="trust-strip-scroll">
            <div className="trust-strip-inner">
              {[...TRUST_STRIP_ITEMS, ...TRUST_STRIP_ITEMS].map((item, index) => (
                <span key={index} className="trust-strip-item">
                  {item.icon === 'shield' && (
                    <span className="trust-strip-icon">✓</span>
                  )}
                  {item.icon === 'badge' && (
                    <span className="trust-strip-icon">1</span>
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
