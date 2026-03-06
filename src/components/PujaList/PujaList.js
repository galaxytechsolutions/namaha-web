import React from "react";
import { Link } from "react-router-dom";
import "./PujaList.css";
import Footer from "../Footer/Footer";
import { usePujaList } from "../../data/pujaList";

const normalizeBenefitTitles = (benefits) => {
  if (Array.isArray(benefits)) {
    return benefits
      .map((b) => {
        if (!b) return null;
        if (typeof b === "string") return b;
        if (typeof b === "object") return b.title || b.name || b.benefitTitle || null;
        return null;
      })
      .filter(Boolean)
      .map((t) => String(t).replace(/<[^>]*>/g, "").trim())
      .filter(Boolean);
  }
  if (typeof benefits === "string") {
    return benefits
      .replace(/<[^>]*>/g, "")
      .split(/[\n,•]+/g)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

function PujaList() {
  const { pujas: pujaList, loading } = usePujaList();

  // Sort by date ascending (earliest first)
  const sortedPujas = [...pujaList].sort(
    (a, b) => (a.eventDateRaw || 0) - (b.eventDateRaw || 0)
  );

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <main className="puja-list-page" aria-busy="true">
        <div className="pl-loading-overlay" role="status" aria-live="polite">
          <div className="pl-loading-spinner" aria-hidden="true" />
          <div className="pl-loading-text">Loading Divine Pujas…</div>
        </div>
      </main>
    );
  }

  return (
    <main className="puja-list-page">
      <h1 className="pl-main-heading">
        Perform Puja as per Vedic rituals at Famous Hindu Temples in India
      </h1>

      {/* ================= PUJA LIST ================= */}
      <section className="pl-upcoming">
        <h2 className="pl-upcoming-title">
          Upcoming Pujas ({sortedPujas.length})
        </h2>

        <div className="pl-cards">
          {sortedPujas.map((puja) => (
            <div
              key={puja.id}
              className="pl-card"
            >

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
                  puja.topChoice && <span className="pl-top-choice-tag">TOP CHOICE</span>
                )}
              </div>

              {/* category: puja type/classification */}
              {/* <p className="pl-card-category">{puja.category}</p> */}
              <h3 className="pl-card-title">{puja.title}</h3>
              {(() => {
                const titles = normalizeBenefitTitles(puja.benefits).slice(0, 2);
                if (titles.length === 0) return null;
                return (
                  <ul className="pl-card-benefits" aria-label="Benefits">
                    {titles.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                );
              })()}
              {/* duration: estimated puja time */}
              {/* <p className="pl-card-meta">Duration: {puja.duration}</p> */}
              <p className="pl-card-meta">🏛 {puja.templeName}</p>
              {/* occasion: auspicious date/event when puja is performed */}
              <p className="pl-card-meta pl-card-date">📅 {puja.date}</p>

              <Link to={`/puja/${puja.id}`} className="pl-card-participate">
                PARTICIPATE →
              </Link>
            </div>
          ))}
        </div>
      </section>

      
      <Footer />
    </main>
  );
}

export default PujaList;
