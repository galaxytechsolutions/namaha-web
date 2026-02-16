import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SpecialPuja.css';
import '../PujaList/PujaList.css';
import { fetchPujaList } from '../../data/pujaList'; // ✅ CHANGED: fetchPujaList

const SP_IMAGE_MAP = { 
  1: 'sp-banner-1', 
  2: 'sp-banner-2', 
  3: 'sp-banner-3' 
};

function SpecialPuja() {
  const [pujas, setPujas] = useState([]); // ✅ NEW: useState
  const [loading, setLoading] = useState(true);

  // ✅ NEW: Fetch API data
  useEffect(() => {
    fetchPujaList()
      .then((apiPujas) => {
        // Map API data to SpecialPuja format
        const specialPujas = apiPujas.map((p) => ({
          ...p,
          imageClass: SP_IMAGE_MAP[p.id] || p.imageClass || `sp-banner-${Math.floor(Math.random() * 3) + 1}`
        }));
        console.log("✅ SpecialPuja mapped:", specialPujas);
        setPujas(specialPujas.slice(0, 4)); // Show top 3 only
      })
      .catch((err) => {
        console.error("❌ SpecialPuja fetch failed:", err);
        setPujas([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="special-puja-section">
        <div className="sp-container">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            🔄 Loading Special Pujas...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="special-puja-section">
      <div className="sp-container">
        <div className="sp-header">
          <h2><span className="sp-title-purple">SHRI AAUM</span> Special Pujas</h2>
          <p className="sp-subtitle">
            Begin 2026 with faith - get special pujas performed in your name at India's powerful temples to achieve peace and protection for your family.
          </p>
        </div>

        <div className="sp-cards">
          {pujas.map((puja) => (
            <div key={puja.id} className="pl-card">
              {/* ✅ USE API IMAGES */}
              <div 
                className={`pl-card-banner ${puja.imageClass}`} 
                style={puja.bannerUrls?.[0] ? {
                  backgroundImage: `url(${puja.bannerUrls[0].url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                } : {}}
              >
                <div className="pl-card-overlay" />
                <span className={`pl-card-tag ${puja.tagColor}`}>{puja.specialTag}</span>
                {/* <Link to={`/puja/${puja.id}`}>
                <button type="button" className="pl-card-book">BOOK PUJA</button>
                </Link> */}
              </div>
              <p className="pl-card-category">{puja.category}</p>
              <h3 className="pl-card-title">{puja.title}</h3>
              {puja.promoText && <p className="pl-card-promo-body">{puja.promoText}</p>}

              <p className="pl-card-purpose">{puja.purpose}</p>
              <p className="pl-card-meta">🏛 {puja.location}</p>
              <p className="pl-card-meta">📅 {puja.date}</p>
              <Link to={`/puja/${puja.id}`} className="pl-card-participate">PARTICIPATE →</Link>
            </div>
          ))}
        </div>

        <div className="sp-footer">
          <Link to="/puja" className="sp-view-all">View All Pujas →</Link>
        </div>
      </div>
    </section>
  );
}

export default SpecialPuja;
