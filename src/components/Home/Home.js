import React, { useState, useEffect } from 'react';
import './Home.css';

// 🔹 Static images
const Images = [
  {
    id: 1,
    url: "https://imagesvs.oneindia.com/webp/img/2022/10/diwali-puja-1666587240.jpg"
  },
  {
    id: 2,
    url: "https://myborosil.com/cdn/shop/files/my-borosil-puja-thali-7-pc-set-samagri-borosil-puja-thali-34040434819210.jpg"
  },
  {
    id: 3,
    url: "https://shreesarvasiddhi.com/wp-content/uploads/2021/07/Laxmi-puja.jpeg"
  }
];

// 🔹 Static hero text
const HERO_CONTENT = [
  {
    title: 'Sacred Pujas, Performed at Holy Teerth Kshetras',
    subtitle: 'Perform Pujas and watch your names and gotras being chanted from the comfort of your homes',
    twoButtons: false,
  },
  {
    title: 'Temples. Teerth. Tattva. At Your Fingertips',
    subtitle: 'Connect to sacred teerth kshetras and perform pujas from anywhere. Get Prasad at your doorstep.',
    twoButtons: false,
    // singleButtonLabel: 'Explore Now',
  },
  {
    title: 'Your Sankalpa, Performed Where It Truly Matters',
    subtitle: 'Worship the divine deities and receive blessings with recorded videos and Prasad from your homes.',
    twoButtons: false,
    // singleButtonLabel: 'Book Now',
  },
];

const TRUST_STRIP_ITEMS = [
  { id: 1, icon: 'shield', text: 'Pujas Performed by Qualified Veda Pandits' },
  { id: 2, icon: 'shield', text: '100% Refund Policy on No Sankalpa' },
  { id: 3, icon: 'shield', text: 'Puja Recordings within 48 hours' },
  { id: 4, icon: 'shield', text: 'Prasad at your Doorstep' },
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

                {/* Banner */}
                <img
                  src={slide.image}
                  alt="Puja Banner"
                  className="hero-bg-image1"
                />

                {/* Content */}
                <div className="hero-content1">
                  <div className="hero-text-stack">
                    <h1>{slide.title}</h1>
                    <p className="hero-subtitle">{slide.subtitle}</p>
                  </div>

                  {/* <div className="hero-buttons">
                    {slide.twoButtons ? (
                      <button className="hero-btn hero-btn-outline">
                        Install App
                      </button>
                    ) : (
                      <button className="hero-btn hero-btn-solid">
                        {slide.singleButtonLabel || 'Explore Now'}
                      </button>
                    )}
                  </div> */}
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
                  {item.icon === 'shield' && <span className="trust-strip-icon">✓</span>}
                  {item.icon === 'badge' && <span className="trust-strip-icon">1</span>}
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
