import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./PujaList.css";
import StatsEventUi from "../StatsEventUi/StatsEventUi";
import Footer from "../Footer/Footer";
import { usePujaList, PUJA_LIST } from "../../data/pujaList";

const PUJA_HERO_SLIDES = [
  {
    id: 1,
    badge: "Maa Bagalamukhi Special",
    slogan:
      "Open the doors to legal justice and victory through this divine puja",
    imageClass: "puja-hero-1",
  },
  {
    id: 2,
    badge: "Special Puja",
    slogan: "Seek blessings at famous temples across India",
    imageClass: "puja-hero-2",
  },
];

function PujaList() {
  const [heroSlide, setHeroSlide] = useState(0);
  const { pujas: pujaList, loading } = usePujaList();
  const [filteredPujas, setFilteredPujas] = useState(PUJA_LIST);

  // Filter state
  const [filtersOpen, setFiltersOpen] = useState({
    category: false,
    benefits: false,
    location: false,
  });
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedBenefits, setSelectedBenefits] = useState(new Set());
  const [selectedLocations, setSelectedLocations] = useState(new Set());

  // ✅ selected pujas (cart)
  const [selectedPujas, setSelectedPujas] = useState([]);

  /* ================= HERO AUTO SLIDE ================= */
  useEffect(() => {
    const t = setInterval(() => {
      setHeroSlide((s) => (s + 1) % PUJA_HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  /* ================= FETCH PUJAS handled by usePujaList hook ================= */

  // Build filter option lists from pujaList
  const categoryOptions = Array.from(
    new Set(pujaList.map((p) => (p.category || "").trim()))
  ).filter(Boolean);

  const benefitOptions = Array.from(
    new Set(
      pujaList.flatMap((p) =>
        (p.benefits || []).map((b) => (b || "").trim())
      )
    )
  ).filter(Boolean);

  const locationOptions = Array.from(
    new Set(pujaList.map((p) => (p.location || "").trim()))
  ).filter(Boolean);

  // Apply filters whenever selection changes or pujaList updates
  useEffect(() => {
    const filtered = pujaList.filter((p) => {
      // Category filter
      if (selectedCategories.size > 0 && !selectedCategories.has(p.category))
        return false;

      // Benefits filter (match any)
      if (selectedBenefits.size > 0) {
        const hasAny = (p.benefits || []).some((b) =>
          selectedBenefits.has(b)
        );
        if (!hasAny) return false;
      }

      // Location filter
      if (selectedLocations.size > 0 && !selectedLocations.has(p.location))
        return false;

      return true;
    });

    setFilteredPujas(filtered);
  }, [pujaList, selectedCategories, selectedBenefits, selectedLocations]);

  const toggleSelection = (setState, value) => {
    setState((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const clearAllFilters = () => {
    setSelectedCategories(new Set());
    setSelectedBenefits(new Set());
    setSelectedLocations(new Set());
  };

  /* ================= SELECT / UNSELECT ================= */
  // selection handler for cards (checkbox)
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

  const isSelected = (id) => selectedPujas.some((p) => p.id === id);

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
      {/* ================= CART COUNT ================= */}
      {selectedPujas.length > 0 && (
        <div className="cart-floating">🛒 Cart ({selectedPujas.length})</div>
      )}

      <h1 className="pl-main-heading">
        Perform Puja as per Vedic rituals at Famous Hindu Temples in India
      </h1>

      {/* filters will be shown below hero (desktop: inline row; mobile: modal) */}

      {/* ================= HERO ================= */}
      <section className="pl-hero">
        <div className="pl-hero-inner">
          {PUJA_HERO_SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              className={`pl-hero-slide ${i === heroSlide ? "active" : ""}`}
            >
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
                <h4>Category</h4>
                {categoryOptions.map((c) => (
                  <label key={c} className="filter-item">
                    <input
                      type="checkbox"
                      checked={selectedCategories.has(c)}
                      onChange={() => toggleSelection(setSelectedCategories, c)}
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
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
              className={`pl-card ${
                isSelected(puja.id) ? "selected-card" : ""
              }`}
            >
              {/* ===== CHECKBOX ===== */}
              {/* <input
                type="checkbox"
                className="puja-checkbox"
                checked={isSelected(puja.id)}
                onChange={() => toggleSelectPuja(puja)}
              />  */}

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

              <p className="pl-card-category">{puja.category}</p>
              <h3 className="pl-card-title">{puja.title}</h3>
              <p className="pl-card-meta">Duration: {puja.duration}</p>
              {/* With this */}
              <p className="pl-card-title">Benfits</p>
              <div className="pl-card-purpose space-y-1">
                {puja.benefits?.map((benefit, index) => (
                  <div
                    key={index}
                    className="  flex items-center gap-2 text-sm"
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    {benefit}
                  </div>
                ))}
              </div>
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
