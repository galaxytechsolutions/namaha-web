import React, { useState, useEffect } from 'react';
import './Faqs.css';

const benefits = [
  {
    id: 1,
    title: 'Join Pujas From Anywhere',
    description: 'Get access to Pujas in sacred temples and teerth kshetras from anywhere in the world. Distance should never limit your faith.',
    icon: '🌍',
  },
  {
    id: 2,
    title: 'Celebrate Important Festivals Round The Year',
    description: 'Be spiritually aligned with every major festival and sacred muhurat. Offer your devotion on the most powerful days of the year from the comfort of your homes.',
    icon: '🪔',
  },
  {
    id: 3,
    title: 'Personalised Sankalpa and Sacred Prasad Delivery',
    description: 'Your names and Gotras are chanted in the Puja Sankalpa, get recorded Puja videos within 48 hours and Prasad at your doorstep in 7-10 days.',
    icon: '📦',
  },
  {
    id: 4,
    title: 'Qualified and Trusted Veda Pandits',
    description: 'All rituals performed by experienced and devoted Veda Pandits. Authentic procedures as per scriptures and tradition.',
    icon: '📿',
  },
  {
    id: 5,
    title: 'Grand Pujas At Affordable Costs',
    description: 'Participate in grand pujas and rituals without financial burden. We offer divine pujas at affordable costs to make spiritual experiences accessible to all devotees.',
    icon: '💫',
  },
];

function Faqs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goToSlide = (index) => {
    setActiveIndex((index + benefits.length) % benefits.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 4000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % benefits.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  return (
    <section className="faq-section">
      <div className="faq-container">
        <h2 className="faq-heading">
          Benefits of Conducting Pujas With Shri AAUM
        </h2>
        <p className="faq-subtitle">
          Learn from trusted experts how a puja arranged from home with true devotion is as effective as one attended in-person at a temple.
        </p>

        <div className="faq-carousel">
          {/* <button
            type="button"
            className="faq-carousel-btn faq-carousel-prev"
            onClick={() => goToSlide(activeIndex - 1)}
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            type="button"
            className="faq-carousel-btn faq-carousel-next"
            onClick={() => goToSlide(activeIndex + 1)}
            aria-label="Next"
          >
            ›
          </button> */}

          <div className="faq-carousel-track">
            {benefits.map((item, index) => (
              <div
                key={item.id}
                className={`faq-carousel-slide ${index === activeIndex ? 'active' : ''} ${index < activeIndex ? 'prev' : ''} ${index > activeIndex ? 'next' : ''}`}
              >
                <div className="faq-benefit-card">
                  <span className="faq-benefit-icon" aria-hidden="true">{item.icon}</span>
                  <h3 className="faq-benefit-title">{item.title}</h3>
                  <p className="faq-benefit-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="faq-carousel-dots">
            {benefits.map((_, index) => (
              <button
                key={benefits[index].id}
                type="button"
                className={`faq-dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === activeIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Faqs;
