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

  // Upcoming first, then sold-out; keep date-wise order within each group.
  const sortedPujas = [...pujaList].sort((a, b) => {
    const now = Date.now();
    const dateA = Number(a.eventDateRaw || 0);
    const dateB = Number(b.eventDateRaw || 0);
    const isSoldOutA = dateA > 0 && dateA <= now;
    const isSoldOutB = dateB > 0 && dateB <= now;

    // Upcoming items first (bookable pujas on top).
    if (isSoldOutA !== isSoldOutB) return isSoldOutA ? 1 : -1;

    // Upcoming group: nearest date first.
    if (!isSoldOutA && !isSoldOutB && dateA !== dateB) return dateA - dateB;

    // Sold-out group: most recently ended first.
    if (isSoldOutA && isSoldOutB && dateA !== dateB) return dateB - dateA;

    return (a.rank ?? 9999) - (b.rank ?? 9999);
  });

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
          {sortedPujas.map((puja) => {
            const isPastEvent =
              puja.eventDateRaw && puja.eventDateRaw > 0
                ? puja.eventDateRaw <= Date.now()
                : false;
            return (
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
                {isPastEvent ? (
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

              {isPastEvent ? (
                <div className="pl-card-participate pl-card-participate-disabled">
                  Booking closed
                </div>
              ) : (
                <Link to={`/puja/${puja.id}`} className="pl-card-participate">
                  Book Puja →
                </Link>
              )}
            </div>
          )})}
        </div>
      </section>

      
      <Footer />
    </main>
  );
}

export default PujaList;
