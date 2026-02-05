import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PujaList.css';
import StatsEventUi from '../StatsEventUi/StatsEventUi';
import Footer from '../Footer/Footer';
import { PUJA_LIST } from '../../data/pujaList';

const PUJA_HERO_SLIDES = [
  {
    id: 1,
    badge: 'Maa Bagalamukhi Special',
    slogan: 'Open the doors to legal justice and victory through this divine puja',
    imageClass: 'puja-hero-1',
  },
  {
    id: 2,
    badge: 'Special Puja',
    slogan: 'Seek blessings at famous temples across India',
    imageClass: 'puja-hero-2',
  },
];

function PujaList() {
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setHeroSlide((s) => (s + 1) % PUJA_HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="puja-list-page">
      <h1 className="pl-main-heading">Perform Puja as per Vedic rituals at Famous Hindu Temples in India</h1>

      <section className="pl-hero">
        <div className="pl-hero-inner">
          {PUJA_HERO_SLIDES.map((slide, i) => (
            <div key={slide.id} className={`pl-hero-slide ${i === heroSlide ? 'active' : ''}`}>
              <div className="pl-hero-content">
                <span className="pl-hero-badge">{slide.badge}</span>
                <p className="pl-hero-slogan">{slide.slogan}</p>
                <button type="button" className="pl-hero-cta">BOOK PUJA</button>
              </div>
              <div className={`pl-hero-image ${slide.imageClass}`} />
            </div>
          ))}
        </div>
        <div className="pl-hero-dots">
          {PUJA_HERO_SLIDES.map((_, i) => (
            <button key={i} type="button" className={i === heroSlide ? 'active' : ''} onClick={() => setHeroSlide(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      </section>

      <section className="pl-upcoming">
        <h2 className="pl-upcoming-title">Upcoming Pujas</h2>
        <p className="pl-upcoming-desc">Book puja online with your name and gotra, receive the puja video along with the Aashirwad Box, and gain blessings from the Divine.</p>
        <div className="pl-filters">
          <span className="pl-filter-icon">☰</span>
          <span className="pl-filter-label">Filter</span>
          <select className="pl-filter-select"><option>Deity</option></select>
          <select className="pl-filter-select"><option>Tithis</option></select>
          <select className="pl-filter-select"><option>Dosha</option></select>
          <select className="pl-filter-select"><option>Benefits</option></select>
          <select className="pl-filter-select"><option>Location</option></select>
        </div>
        <div className="pl-cards">
          {PUJA_LIST.map((puja) => (
            <div key={puja.id} className="pl-card">
              <div className={`pl-card-banner ${puja.imageClass}`}>
                <div className="pl-card-overlay" />
                <span className={`pl-card-tag ${puja.tagColor}`}>{puja.specialTag}</span>
                {puja.topChoice && <span className="pl-card-top-choice">DEVOTEE'S TOP CHOICE</span>}
                <p className="pl-card-promo">{puja.promoText}</p>
                <button type="button" className="pl-card-book">BOOK PUJA</button>
              </div>
              <p className="pl-card-category">{puja.category}</p>
              <h3 className="pl-card-title">{puja.title}</h3>
              <p className="pl-card-purpose">{puja.purpose}</p>
              <p className="pl-card-meta">🏛 {puja.location}</p>
              <p className="pl-card-meta">📅 {puja.date}</p>
              <Link to={`/puja/${puja.id}`} className="pl-card-participate">PARTICIPATE →</Link>
            </div>
          ))}
        </div>
      </section>
      <StatsEventUi/>
      <Footer/>
    </main>
  );
}

export default PujaList;