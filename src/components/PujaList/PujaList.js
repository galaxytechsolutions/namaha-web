import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PujaList.css';
import StatsEventUi from '../StatsEventUi/StatsEventUi';
import Footer from '../Footer/Footer';
import { fetchPujaList, PUJA_LIST } from '../../data/pujaList';

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
  const [pujaList, setPujaList] = useState(PUJA_LIST);
  const [loading, setLoading] = useState(true);

  // ✅ selected pujas (cart)
  const [selectedPujas, setSelectedPujas] = useState([]);

  /* ================= HERO AUTO SLIDE ================= */
  useEffect(() => {
    const t = setInterval(() => {
      setHeroSlide((s) => (s + 1) % PUJA_HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  /* ================= FETCH PUJAS ================= */
  useEffect(() => {
    fetchPujaList()
      .then((data) => {
        setPujaList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  /* ================= SELECT / UNSELECT ================= */
  const toggleSelectPuja = (puja) => {
    setSelectedPujas((prev) => {
      const exists = prev.find((p) => p.id === puja.id);

      if (exists) {
        return prev.filter((p) => p.id !== puja.id);
      } else {
        return [...prev, puja];
      }
    });
  };

  const isSelected = (id) =>
    selectedPujas.some((p) => p.id === id);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <main className="puja-list-page">
        <div style={{ textAlign: 'center', padding: '100px' }}>
          🔄 Loading Divine Pujas from backend...
        </div>
      </main>
    );
  }

  return (
    <main className="puja-list-page">

      {/* ================= CART COUNT ================= */}
      {selectedPujas.length > 0 && (
        <div className="cart-floating">
          🛒 Cart ({selectedPujas.length})
        </div>
      )}


      <h1 className="pl-main-heading">
        Perform Puja as per Vedic rituals at Famous Hindu Temples in India
      </h1>

      {/* ================= HERO ================= */}
      <section className="pl-hero">
        <div className="pl-hero-inner">
          {PUJA_HERO_SLIDES.map((slide, i) => (
            <div key={slide.id} className={`pl-hero-slide ${i === heroSlide ? 'active' : ''}`}>
              <div className="pl-hero-content">
                <span className="pl-hero-badge">{slide.badge}</span>
                <p className="pl-hero-slogan">{slide.slogan}</p>
                {/* <button className="pl-hero-cta">BOOK PUJA</button> */}
              </div>
              <div className={`pl-hero-image ${slide.imageClass}`} />
            </div>
          ))}
        </div>
      </section>

      {/* ================= PUJA LIST ================= */}
      <section className="pl-upcoming">
        <h2 className="pl-upcoming-title">
          Upcoming Pujas ({pujaList.length})
        </h2>

        <div className="pl-cards">
          {pujaList.map((puja) => (
            <div
              key={puja.id}
              className={`pl-card ${isSelected(puja.id) ? 'selected-card' : ''}`}
            >

              {/* ===== CHECKBOX ===== */}
              <input
                type="checkbox"
                className="puja-checkbox"
                checked={isSelected(puja.id)}
                onChange={() => toggleSelectPuja(puja)}
              />

              <div
                className={`pl-card-banner ${puja.imageClass}`}
                style={
                  puja.bannerUrls?.[0]
                    ? {
                      backgroundImage: `url(${puja.bannerUrls[0].url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                    : {}
                }
              >
                <div className="pl-card-overlay" />
                <span className={`pl-card-tag ${puja.tagColor}`}>
                  {puja.specialTag}
                </span>
                {/* <Link to={`/puja/${puja.id}`} className="pl-book-btn">
                  BOOK PUJA
                </Link> */}
              </div>

              <p className="pl-card-category">{puja.category}</p>
              <h3 className="pl-card-title">{puja.title}</h3>
              <p className="pl-card-purpose">{puja.purpose}</p>
              <p className="pl-card-meta">🏛 {puja.location}</p>
              <p className="pl-card-meta">📅 {puja.date}</p>

              <Link to={`/puja/${puja.id}`} className="pl-card-participate">
                PARTICIPATE →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <StatsEventUi />
      <Footer />
    </main>
  );
}

export default PujaList;
