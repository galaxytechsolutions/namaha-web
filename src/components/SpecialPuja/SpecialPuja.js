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

  const isEventDatePassed = (p) => {
    const eventTimeMs = p?.eventDateRaw;
    if (!eventTimeMs) return false;
    return eventTimeMs <= Date.now();
  };

  const getBenefitTitle = (benefit) => {
    if (!benefit) return null;
    if (typeof benefit === "string") return benefit;
    if (typeof benefit === "object") return benefit.title || benefit.name || null;
    return null;
  };

  // ✅ NEW: Fetch API data
  useEffect(() => {
    fetchPujaList()
      .then((apiPujas) => {
        // Map API data to SpecialPuja format
        const specialPujas = apiPujas
          .map((p) => ({
            ...p,
            imageClass:
              SP_IMAGE_MAP[p.id] ||
              p.imageClass ||
              `sp-banner-${Math.floor(Math.random() * 3) + 1}`,
          }))
          .sort((a, b) => {
            const dateA = a.eventDateRaw || 0;
            const dateB = b.eventDateRaw || 0;
            if (dateA !== dateB) return dateA - dateB;
            return (a.rank ?? 9999) - (b.rank ?? 9999);
          });
        console.log("✅ SpecialPuja mapped (sorted by date):", specialPujas);
        setPujas(specialPujas.slice(0, 4));
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
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundColor: "#1a1a1a",
                      }
                    : {}
                }
              >
                <div className="pl-card-overlay" />
                {/* <span className={`pl-card-tag ${puja.tagColor}`}>
                  {puja.specialTag}
                </span> */}
                {(puja.soldTag || isEventDatePassed(puja)) ? (
                  <span className="pl-top-choice-tag sold-out">SOLD OUT</span>
                ) : (
                  puja.topChoice && (
                    <span className="pl-top-choice-tag">TOP CHOICE</span>
                  )
                )}
              </div>
              {/* category: puja type/classification */}
              {/* <p className="pl-card-category">{puja.category}</p> */}
              <h3 className="pl-card-title">{puja.title}</h3>

              {Array.isArray(puja.benefits) && puja.benefits.length > 0 && (
                <ul className="pl-card-benefits" aria-label="Benefits">
                  {puja.benefits
                    .map(getBenefitTitle)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((title, idx) => (
                      <li key={idx}>{title}</li>
                    ))}
                </ul>
              )}
              {/* duration: estimated puja time */}
              {/* <p className="pl-card-purpose">Duration: {puja.duration}</p> */}
              {/* templeName: temple/venue where puja is performed */}
              <p className="pl-card-meta">🏛 {puja.templeName}</p>
              {/* occasion: auspicious date/event when puja is performed */}
              <p className="pl-card-meta pl-card-date">📅 {puja.date}</p>
              <Link to={`/puja/${puja.id}`} className="pl-card-participate">
                Book Puja →
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
