import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SpecialPuja.css";
import "../PujaList/PujaList.css";
import { fetchPujaList } from "../../data/pujaList"; // ✅ CHANGED: fetchPujaList

const SP_IMAGE_MAP = {
  1: "sp-banner-1",
  2: "sp-banner-2",
  3: "sp-banner-3",
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
          imageClass:
            SP_IMAGE_MAP[p.id] ||
            p.imageClass ||
            `sp-banner-${Math.floor(Math.random() * 3) + 1}`,
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
      <section className="special-puja-section" aria-busy="true">
        <div className="sp-container">
          <div className="pl-loading-overlay" role="status" aria-live="polite">
            <div className="pl-loading-spinner" aria-hidden="true" />
            <div className="pl-loading-text">Loading…</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="special-puja-section">
      <div className="sp-container">
        <div className="sp-header">
          <h2>
            <span className="sp-title-purple">Join Sacred Pujas</span> From
            Anywhere
          </h2>
          <p className="sp-subtitle">
            Deepen your spiritual journey by offering sacred pujas at India’s
            most revered Teerth Kshetras. Get your family’s names and gotras
            chanted in Pujas performed by qualified Veda Pandits to attain peace
            and protection for your family.
          </p>
        </div>

        <div className="sp-cards">
          {pujas.map((puja) => (
            <div key={puja.id} className="pl-card">
              {/* ✅ USE API IMAGES */}
              <div
                className={`pl-card-banner ${puja.imageClass}`}
                style={
                  puja.bannerUrls?.[0]
                    ? {
                        backgroundImage: `url(${puja.bannerUrls[0].url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {}
                }
              >
                <div className="pl-card-overlay" />
                {/* <span className={`pl-card-tag ${puja.tagColor}`}>
                  {puja.specialTag}
                </span> */}
                {puja.soldTag ? (
                  <span className="pl-top-choice-tag sold-out">SOLD OUT</span>
                ) : (
                  puja.topChoice && (
                    <span className="pl-top-choice-tag">TOP CHOICE</span>
                  )
                )}
              </div>
              <p className="pl-card-category">{puja.category}</p>
              <h3 className="pl-card-title">{puja.title}</h3>
              {/* {puja.promoText && <p className="pl-card-promo-body">{puja.promoText}</p>} */}

              <p className="pl-card-purpose">Duration: {puja.duration}</p>
              <p className="pl-card-meta">🏛 {puja.templeName}</p>
              <p className="pl-card-meta">📅 {puja.date}</p>
              <Link to={`/puja/${puja.id}`} className="pl-card-participate">
                PARTICIPATE →
              </Link>
            </div>
          ))}
        </div>

        <div className="sp-footer">
          <Link to="/puja" className="sp-view-all">
            View All Pujas →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default SpecialPuja;
