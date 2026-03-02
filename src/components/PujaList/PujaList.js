import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./PujaList.css";
import Footer from "../Footer/Footer";
import { usePujaList, PUJA_LIST } from "../../data/pujaList";

function PujaList() {
  const { pujas: pujaList, loading } = usePujaList();
  const [filteredPujas, setFilteredPujas] = useState(PUJA_LIST);

  // Filter state
  const [filtersOpen, setFiltersOpen] = useState({
    benefits: false,
    location: false,
  });
  const [selectedBenefits, setSelectedBenefits] = useState(new Set());
  const [selectedLocations, setSelectedLocations] = useState(new Set());

  /* ================= FETCH PUJAS handled by usePujaList hook ================= */

  // Build filter option lists from pujaList
  const benefitOptions = Array.from(
    new Set(
      pujaList.flatMap((p) =>
        (p.benefits || [])
          .map((b) => ((typeof b === 'object' ? b?.title : b) || '').trim())
          .filter(Boolean)
      )
    )
  );

  const locationOptions = Array.from(
    new Set(pujaList.map((p) => (p.location || "").trim()))
  ).filter(Boolean);

  // Apply filters whenever selection changes or pujaList updates
  useEffect(() => {
    const filtered = pujaList.filter((p) => {
      // Benefits filter (match any)
      if (selectedBenefits.size > 0) {
        const hasAny = (p.benefits || []).some((b) =>
          selectedBenefits.has(typeof b === 'object' ? b?.title : b)
        );
        if (!hasAny) return false;
      }

      // Location filter
      if (selectedLocations.size > 0 && !selectedLocations.has(p.location))
        return false;

      return true;
    });

    setFilteredPujas(filtered);
  }, [pujaList, selectedBenefits, selectedLocations]);

  const toggleSelection = (setState, value) => {
    setState((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const clearAllFilters = () => {
    setSelectedBenefits(new Set());
    setSelectedLocations(new Set());
  };

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

      {/* FILTERS: row for desktop/tablet, mobile uses modal */}
      <div className="pl-filters-row">
        

        {/* Mobile: single compact filter button that opens modal */}
        <div className="mobile-filters">
          <button
            className="filter-mobile-btn"
            onClick={() => setFiltersOpen((s) => ({ ...s, _modal: !s._modal }))}
          >
            <span className="filter-icon">☰</span> Filters
          </button>
        </div>
      </div>

      {/* Mobile Modal */}
      {filtersOpen._modal && (
        <div className="filter-modal" role="dialog" aria-modal="true">
          <div className="filter-modal-panel">
            <div className="filter-modal-header">
              <h3>Filters</h3>
              <button
                className="filter-modal-close"
                onClick={() => setFiltersOpen((s) => ({ ...s, _modal: false }))}
                aria-label="Close filters"
              >
                ✕
              </button>
            </div>
            <div className="filter-modal-body">
              <div className="filter-section">
                <h4>Benefits</h4>
                {benefitOptions.map((b) => (
                  <label key={b} className="filter-item">
                    <input
                      type="checkbox"
                      checked={selectedBenefits.has(b)}
                      onChange={() => toggleSelection(setSelectedBenefits, b)}
                    />
                    <span>{b}</span>
                  </label>
                ))}
              </div>
              <div className="filter-section">
                <h4>Location</h4>
                {locationOptions.map((l) => (
                  <label key={l} className="filter-item">
                    <input
                      type="checkbox"
                      checked={selectedLocations.has(l)}
                      onChange={() => toggleSelection(setSelectedLocations, l)}
                    />
                    <span>{l}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="filter-modal-footer">
              <button className="filter-clear" onClick={clearAllFilters}>Clear</button>
              <button className="filter-apply" onClick={() => setFiltersOpen((s) => ({ ...s, _modal: false }))}>Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PUJA LIST ================= */}
      <section className="pl-upcoming">
        <h2 className="pl-upcoming-title">
          Upcoming Pujas ({filteredPujas.length})
        </h2>

        <div className="pl-cards">
          {filteredPujas.map((puja) => (
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
                        backgroundSize: "contain",
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
              {puja.description && (
                <p className="pl-card-desc">{puja.description}</p>
              )}
              {/* duration: estimated puja time */}
              {/* <p className="pl-card-meta">Duration: {puja.duration}</p> */}
              <p className="pl-card-meta">🏛 {puja.templeName}</p>
              {/* occasion: auspicious date/event when puja is performed */}
              <p className="pl-card-meta">📅 {puja.date}</p>

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
