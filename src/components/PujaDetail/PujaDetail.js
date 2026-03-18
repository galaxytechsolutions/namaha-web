import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPujaById } from "../../data/pujaList";
import "./PujaDetail.css";
import Footer from "../Footer/Footer";

const SECTION_TABS = [
  { id: "packages", label: "Packages" },
  { id: "benefits", label: "Benefits" },
  { id: "temple", label: "Temple Details" },
  { id: "faqs", label: "FAQs" },
];
const PACKAGE_BULLETS = [
  "The Puja will be performed by qualified Veda Pandits by following the right Puja Vidhi.",
  "The Prasad will be delivered to your door step within 7-10 days and the puja video will be sent to your whatsapp within 24-48 hrs.",
  "Since the Puja will be conducted at an auspicious time (at Shubh Muhurat), you will definitely get good results.",
];

const PACKAGE_IMAGES = {
  Individual: "https://img.freepik.com/premium-photo/indian-girl-dressed-traditional-attire-performing-graceful-dhunuchi-dance-with-clay-incense-burner-vibrant-durga-puja-celebrations_748982-26973.jpg?semt=ais_rp_progressive&w=740&q=80",
  Couple: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrZHdY1aqFNTp-HqB_YjnU6GZXvS2dZEehRQ&s",
  Family: "https://t3.ftcdn.net/jpg/09/48/77/26/360_F_948772697_m5ITrhbmM3FFkI0dNIm78wscg5D8GX6G.jpg",
  "Joint Family": "https://img.freepik.com/premium-photo/indian-family-celebrating-gudi-padwa-ugadi-festival-while-lady-wife-holding-puja-pooja-thali-it-s-new-year-hindu-religion_466689-44362.jpg",
};

const getPackageDisplayName = (pkg) => {
  const id = (pkg.id || "").toLowerCase();
  const name = (pkg.name || "").toLowerCase();
  const persons = pkg.persons ?? 1;
  if (name === "individual" || id.includes("individual") || persons === 1) return "Individual";
  if (name === "two person" || name.includes("partner") || name.includes("couple") || id.includes("partner") || id.includes("couple") || persons === 2) return "Couple";
  if (name === "joint family" || name.includes("joint") || id.includes("joint") || persons >= 6) return "Joint Family";
  return "Family";
};

const getPackages = (puja) => {
  if (puja?.packageDetails?.length > 0) {
    return puja.packageDetails.map((pkg) => {
      const base = {
        id: pkg.id || pkg._id,
        name: pkg.name,
price:
          typeof pkg.price === "string"
            ? Number(pkg.price.replace(/[^0-9]/g, ""))
            : Number(pkg.price),
        persons: pkg.persons || 1,
      };
      return { ...base, name: getPackageDisplayName(base) };
    });
  }

  return [
    { id: "individual", name: "Individual", price: 851, persons: 1 },
    { id: "partner", name: "Couple", price: 1251, persons: 2 },
    { id: "family", name: "Family", price: 2001, persons: 4 },
    { id: "joint", name: "Joint Family", price: 3001, persons: 6 },
  ];
};

const INCLUDES = [
  "The participant's name and gotra will be recited by an experienced Panditji during the puja.",
  "Participants will receive guided mantras and step-by-step instructions to join the puja from home.",
  "A complete video of the puja and offerings will be shared on your WhatsApp.",
  "A free Aashirwad Box with Tirth Prasad will be delivered to your home if you opt in to receive it.",
];

const HOW_IT_WORKS_STEPS = [
  { id: "select", title: "Puja Package", icon: "grid" },
  { id: "name-gotra", title: "Name and Gotra", icon: "form" },
  { id: "watch", title: "Watch Puja Video", icon: "video" },
  { id: "prashad", title: "Prashad Shipped", icon: "box" },
];

const FAQ_ITEMS = [
  {
    q: "Why should I choose Shri aaum for performing a Puja?",
    a: "Shri aaum is an official temple partner with experienced pandits. We offer transparent pricing, real-time puja updates, and delivery of prasad to your doorstep.",
  },
  {
    q: "I don't know my Gotra, what should I do?",
    a: 'You can leave the Gotra field blank or select "Unknown". Our team can also help you find it if you know your family deity or lineage.',
  },
  {
    q: "Who will perform the Puja?",
    a: "Experienced and qualified pandits from the temple perform the puja on your behalf. All devotees' names are recited during the collective puja.",
  },
  {
    q: "What will be done in this Puja?",
    a: "The puja includes mantra chanting, havan, and rituals as per the specific puja you select. Details are mentioned in the puja description.",
  },
  {
    q: "How will I know the Puja has been done in my name?",
    a: "You will receive real-time updates on your registered WhatsApp number. A complete video of the puja is also shared within 3-4 days.",
  },
  {
    q: "What will I get after the Puja is done?",
    a: "You receive the puja video on WhatsApp and an optional Aashirwad Box with Tirth Prasad delivered to your doorstep.",
  },
  {
    q: "What are the other services offered by Shri aaum?",
    a: "We offer various pujas, Gau SHRI AAUM, Deep Daan, Vastra SHRI AAUM, Anna SHRI AAUM, and other devotional services at partner temples.",
  },
  {
    q: "Where can I contact for more information?",
    a: "You can reach us via the contact details on our website or through the customer support option during checkout.",
  },
];

function PujaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [puja, setPuja] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  // Replace static countdown state
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isEventDatePassed, setIsEventDatePassed] = useState(false);

  const [activeTab, setActiveTab] = useState("packages");
  const [openFaq, setOpenFaq] = useState(null);
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [addonQuantities, setAddonQuantities] = useState({});
  const [aboutVisibleLines, setAboutVisibleLines] = useState(() =>
    typeof window !== "undefined" && window.innerWidth <= 768 ? 2 : 7
  );
  const [aboutHasOverflow, setAboutHasOverflow] = useState(false);
  const [isMobileView, setIsMobileView] = useState(typeof window !== "undefined" && window.innerWidth <= 768);
  const collapsedLines = isMobileView ? 2 : 7;
  const [howItWorksHoverIndex, setHowItWorksHoverIndex] = useState(null);
  // Track which package card's "Read more" is expanded by index (per-card)
  const [expandedPackageIndex, setExpandedPackageIndex] = useState(null);

  const sectionRefs = useRef({});
  const sectionNavRef = useRef(null);
  const stickyThresholdRef = useRef(null);
  const aboutTextRef = useRef(null);

  const slides = puja?.bannerUrls?.map((img) => img.url) || [];

  const updateAddonQuantity = (addonId, change) => {
    setAddonQuantities((prev) => ({
      ...prev,
      [addonId]: Math.max(0, (prev[addonId] || 0) + change),
    }));
  };

  const handleBookPujaClick = (pkg) => {
    // Block booking strictly based on event date
    if (isEventDatePassed) {
      alert("Puja booking has closed. The event date has passed.");
      return;
    }

    const selectedAddons = (puja?.addOns || []).length
      ? Object.entries(addonQuantities)
          .filter(([_, qty]) => qty > 0)
          .map(([addonId, quantity]) => {
            const addon = puja.addOns.find(
              (a) => (a.id || `addon-${puja.addOns.indexOf(a)}`) === addonId
            );
            if (!addon) return null;
            const price = parseInt(String(addon.price).replace(/[^0-9]/g, ""), 10) || 0;
            return {
              id: addon.id || addonId,
              name: addon.name,
              price,
              quantity,
              total: price * quantity,
            };
          })
          .filter(Boolean)
      : [];

    const mainImage = puja?.bannerUrls?.[0]?.url || null;
    const addonsTotalAmount = selectedAddons.reduce((sum, a) => sum + a.total, 0);
    const pkgPrice = Number(pkg?.price) || 0;
    const grandTotalVal = pkgPrice + addonsTotalAmount;

    const billingState = {
      puja,
      selectedPackage: pkg,
      image: mainImage,
      addons: selectedAddons,
      addonsTotal: addonsTotalAmount,
      grandTotal: grandTotalVal,
      coupon: puja?.coupon ?? null,
      coupons: puja?.coupons ?? (puja?.coupon ? [puja.coupon] : null),
      mode: puja?.mode,
      prasadam: false, // user selects on BillingPage
    };

    navigate("/billing", { state: billingState });
  };

  useEffect(() => {
    const loadPuja = async () => {
      if (!id) return;
      setLoading(true);
      const foundPuja = await getPujaById(id);
      setPuja(foundPuja);
      if (foundPuja) setSelectedPackage(null);
      setLoading(false);
    };
    loadPuja();
  }, [id]);

  // Sync mobile viewport and collapse lines on resize
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handleChange = (e) => {
      const mobile = e.matches;
      setIsMobileView(mobile);
      setAboutVisibleLines((prev) => {
        if (prev < 999) return mobile ? 2 : 7;
        return prev;
      });
    };
    handleChange(mq);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  // Detect if About Puja content overflows when collapsed (show Read more only when needed)
  useEffect(() => {
    if (!puja?.aboutPuja || aboutVisibleLines > collapsedLines) {
      setAboutHasOverflow(false);
      return;
    }
    const t = setTimeout(() => {
      const el = aboutTextRef.current;
      if (!el) return;
      setAboutHasOverflow(el.scrollHeight > el.clientHeight);
    }, 0);
    return () => clearTimeout(t);
  }, [puja?.aboutPuja, aboutVisibleLines, collapsedLines]);

  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    const nav = sectionNavRef.current;
    if (nav) {
      const navTop = nav.getBoundingClientRect().top + window.scrollY;
      stickyThresholdRef.current = navTop - 82;
    }
    sectionRefs.current[sectionId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setIsNavSticky(true);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const nav = sectionNavRef.current;
      if (!nav) return;
      if (!isNavSticky) {
        const rect = nav.getBoundingClientRect();
        const navTop = rect.top + window.scrollY;
        const threshold = navTop - 82;
        if (window.scrollY >= threshold) {
          stickyThresholdRef.current = threshold;
          setIsNavSticky(true);
        }
      } else {
        if (
          stickyThresholdRef.current != null &&
          window.scrollY < stickyThresholdRef.current
        ) {
          setIsNavSticky(false);
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [puja, isNavSticky]);

  // Countdown to puja event date (use eventDateRaw when available; fallback to parsing puja.date)
  useEffect(() => {
    const eventTimeMs = puja?.eventDateRaw && puja.eventDateRaw > 0
      ? puja.eventDateRaw
      : (() => {
          if (!puja?.date) return 0;
          const d = new Date(puja.date);
          return isNaN(d.getTime()) ? 0 : d.setHours(23, 59, 59, 999);
        })();
    if (!eventTimeMs) {
      setIsEventDatePassed(false);
      return;
    }

    let intervalId;

    const tick = () => {
      const now = Date.now();
      const diff = eventTimeMs - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsEventDatePassed(true);
        clearInterval(intervalId);
        return;
      }
      setIsEventDatePassed(false);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    // Start immediately
    tick();

    // Tick every second
    intervalId = setInterval(tick, 1000);

    return () => clearInterval(intervalId);
  }, [puja]); // ✅ Depend on WHOLE puja object once

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((i) => (i + 1) % (puja?.carouselImages?.length || 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [puja]);

  // Show full-page loading overlay when initial data load is in progress
  if (loading) {
    return (
      <>
        <div className="pd-loading-overlay" role="status" aria-live="polite">
          <div className="pd-loading-spinner" aria-hidden="true" />
          <div className="pd-loading-text">Loading…</div>
        </div>
        <main className="puja-detail-page" aria-hidden="true" />
      </>
    );
  }

  if (!puja) {
    return (
      <main className="puja-detail-page">
        <div className="pd-not-found">
          <p>Unable to find puja details.</p>
          <button type="button" onClick={() => navigate("/puja")}>
            Back to Puja list
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="puja-detail-page">
      <div className="pd-container">
        <div className="pd-section-content pd-grid">
          {/* Left: Image carousel */}
          <div className="pd-carousel-wrap">
            <div className="pd-carousel-frame">
              <div className="pd-carousel-inner">
                {slides.map((imgUrl, i) => (
                  <div
                    key={i}
                    className={`pd-carousel-slide ${
                      i === carouselIndex ? "active" : ""
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Slide ${i + 1}`}
                      className="pd-carousel-image"
                    />
                  </div>
                ))}
              </div>
              {/* <span className="pd-badge">{puja.specialTag}</span> */}
              {isEventDatePassed && (
                <span className="pd-soldout-tag" aria-hidden="true">SOLD OUT</span>
              )}
            </div>

            {/* Add-ons section: show only when add-on data is available from API */}
            {puja?.addOns?.length > 0 && (
              <div className="pd-addons-card">
                <div className="pd-addons-header">
                  <span className="pd-addons-icon">＋</span>
                  <h3>Add-ons</h3>
                </div>

                {!puja?.addOns || puja.addOns.length === 0 ? (
                  <p className="pd-addons-empty">No add-ons available</p>
                ) : (
                  <div className="pd-addons-list">
                    {puja.addOns.map((addon, index) => {
                      const addonId = addon.id || `addon-${index}`;
                      const quantity = addonQuantities[addonId] || 0;

                      return (
                        <div key={addonId} className="pd-addon-item">
                          <div className="pd-addon-info">
                            <div className="pd-addon-info">
                              <p
                                className="pd-addon-name"
                                title={addon.name}
                              >
                                {addon.name}
                              </p>
                            </div>
                          </div>

                          <div className="pd-addon-controls">
                            <span className="pd-addon-price">{addon.price}</span>
                            <div className="pd-quantity-group">
                              <button
                                className="pd-qty-btn pd-minus"
                                onClick={() => updateAddonQuantity(addonId, -1)}
                              >
                                −
                              </button>
                              <span className="pd-qty-display">{quantity}</span>
                              <button
                                className="pd-qty-btn pd-plus"
                                onClick={() => updateAddonQuantity(addonId, 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Event details */}
          <div className="pd-details">
            {/* category: puja type/classification */}
            {/* <p className="pd-category">{puja.category}</p> */}
            <div className="pd-details-header">
              <h1 className="pd-title">{puja.title}</h1>
              <p className="pd-purpose">{puja.purpose}</p>
              <p className="pd-meta">
                <span className="pd-meta-icon">🏛</span>
                {puja.templeName}
              </p>
              <p className="pd-meta">
                <span className="pd-meta-icon">📅</span>
                {puja.date}
              </p>
            </div>

            {/* About Puja - below date, Read more outside clamped area so it stays visible */}
            {puja?.aboutPuja && (
              <div className="pd-details-about">
                <div
                  className="pd-details-about-text"
                  style={{
                    WebkitLineClamp: aboutVisibleLines,
                    lineClamp: aboutVisibleLines,
                  }}
                  ref={aboutTextRef}
                >
                  <span dangerouslySetInnerHTML={{ __html: puja.aboutPuja }} />
                </div>
                <div className="pd-details-about-actions">
                  {aboutVisibleLines <= collapsedLines && aboutHasOverflow && (
                    <button
                      type="button"
                      className="pd-read-more-btn"
                      onClick={() => setAboutVisibleLines(999)}
                    >
                      Read more
                    </button>
                  )}
                  {aboutVisibleLines > collapsedLines && (
                    <button
                      type="button"
                      className="pd-read-more-btn pd-read-less"
                      onClick={() => setAboutVisibleLines(collapsedLines)}
                    >
                      Read less
                    </button>
                  )}
                </div>
              </div>
            )}

            <p className="pd-countdown-label">Puja booking will close in:</p>
            <div className="pd-countdown">
              <div className="pd-countdown-item">
                <span className="pd-countdown-num">{countdown.days}</span>
                <span className="pd-countdown-label-sm">Days</span>
              </div>
              <div className="pd-countdown-item">
                <span className="pd-countdown-num">{countdown.hours}</span>
                <span className="pd-countdown-label-sm">Hours</span>
              </div>
              <div className="pd-countdown-item">
                <span className="pd-countdown-num">{countdown.minutes}</span>
                <span className="pd-countdown-label-sm">Min</span>
              </div>
              <div className="pd-countdown-item">
                <span className="pd-countdown-num">{countdown.seconds}</span>
                <span className="pd-countdown-label-sm">Secs</span>
              </div>
            </div>
            {isEventDatePassed && (
              <div className="pd-booking-closed" role="alert">
                <span className="pd-booking-closed-icon">🔒</span>
                <strong>Booking closed.</strong> The event date has passed. Payment is no longer available.
              </div>
            )}

            {/* <div className="pd-participants">
              <div className="pd-avatars">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="pd-avatar" />
                ))}
              </div>
              <span className="pd-rating">
                ⭐ {puja.rating} ({puja.ratingCount} ratings)
              </span>
            </div> */}
            {/* <p className="pd-devotees">
              Till now <strong>{puja.devoteesCount} Devotees</strong> have
              participated in Pujas conducted by Shri aaum Puja SHRI AAUM.
            </p> */}
            <button
              type="button"
              className={`pd-cta ${isEventDatePassed ? "pd-cta--disabled" : ""}`}
              onClick={() => !isEventDatePassed && scrollToSection("packages")}
              disabled={isEventDatePassed}
            >
              {isEventDatePassed ? "Booking closed" : "Select puja package →"}
            </button>
          </div>
        </div>

        {/* How it Works */}
        <section className="pd-how-it-works">
          <h2 className="pd-how-title">
            <span className="pd-how-ornament">◆</span> How it Works <span className="pd-how-ornament">◆</span>
          </h2>
          <div className="pd-how-steps">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div
                  className="pd-how-step"
                  onMouseEnter={() => setHowItWorksHoverIndex(index)}
                  onMouseLeave={() => setHowItWorksHoverIndex(null)}
                >
                  <div
                    className={`pd-how-icon-wrap ${step.icon === "video" ? "pd-how-icon-video" : ""}`}
                  >
                    {step.icon === "grid" && (
                      <div className="pd-how-icon pd-how-icon-grid">
                        <span /><span /><span /><span className="highlight" />
                      </div>
                    )}
                    {step.icon === "form" && (
                      <div className="pd-how-icon pd-how-icon-form">
                        <div className="pd-how-form-field" />
                        <div className="pd-how-form-check">✓</div>
                      </div>
                    )}
                    {step.icon === "video" && (
                      <div className="pd-how-icon pd-how-icon-video-inner">
                        <div className="pd-how-video-play">▶</div>
                      </div>
                    )}
                    {step.icon === "box" && (
                      <div className="pd-how-icon pd-how-icon-box" />
                    )}
                  </div>
                  <h3 className="pd-how-step-title">{step.title}</h3>
                </div>
                {index < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div className="pd-how-connector" aria-hidden="true">
                    <div
                      className={`pd-how-connector-fill ${howItWorksHoverIndex === index ? "filled" : ""}`}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Section tabs */}
        <nav
          ref={sectionNavRef}
          className={`pd-section-nav ${
            isNavSticky ? "pd-section-nav--fixed" : ""
          }`}
        >
          <div className="pd-section-nav-inner">
            {SECTION_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`pd-section-tab ${
                  activeTab === tab.id ? "active" : ""
                }`}
                onClick={() => scrollToSection(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
        {isNavSticky && (
          <div className="pd-section-nav-spacer" aria-hidden="true" />
        )}

        {/* Package selection - first section */}
        <section
          className="pd-section pd-packages"
          ref={(el) => {
            sectionRefs.current.packages = el;
          }}
        >
          <div className="pd-section-content">
            <h2 className="pd-section-title">Select your puja package</h2>
            <div className="pd-package-cards">
            {getPackages(puja).map((pkg, index) => (
                <div
                  key={pkg.id}
                  className={`pd-package-card ${
                    selectedPackage?.id === pkg.id ? "selected" : ""
                  }`}
                >
                  <div
                    className="pd-package-image-wrap"
                    style={{
                      backgroundImage: `url(${pkg.image || PACKAGE_IMAGES[pkg.name] || "https://www.shutterstock.com/image-photo/modern-women-wear-fancy-saree-260nw-2575893271.jpg"})`,
                    }}
                  />
                  <span className="pd-package-price-tag">₹{pkg.price?.toLocaleString("en-IN")}</span>
                  <div className="pd-package-body">
                    <h3 className="pd-package-name">{pkg.name}</h3>
                    <ul className="pd-package-bullets">
                      {(expandedPackageIndex === index
                        ? PACKAGE_BULLETS
                        : PACKAGE_BULLETS.slice(0, 2)
                      ).map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                    {PACKAGE_BULLETS.length > 2 && (
                      <button
                        type="button"
                        className="pd-package-read-more"
                        onClick={() =>
                          setExpandedPackageIndex((prev) =>
                            prev === index ? null : index
                          )
                        }
                      >
                        {expandedPackageIndex === index ? "Read less" : "Read more"}
                      </button>
                    )}
                    <button
                      type="button"
                      className={`pd-package-btn ${isEventDatePassed ? "pd-package-btn--disabled" : ""}`}
                      onClick={() => handleBookPujaClick(pkg)}
                      disabled={isEventDatePassed}
                    >
                      {isEventDatePassed ? "BOOKING CLOSED" : "BOOK PUJA"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section
          className="pd-section pd-benefits"
          ref={(el) => {
            sectionRefs.current.benefits = el;
          }}
        >
          <div className="pd-section-content">
            <h2 className="pd-section-title">Puja Benefits</h2>
            <div className="pd-benefits-grid">
              {puja.benefits?.map((benefit, i) => {
                const title = typeof benefit === 'object' ? benefit.title : benefit;
                const subtitle = typeof benefit === 'object' ? benefit.subtitle : null;
                const key = typeof benefit === 'object' && benefit._id ? benefit._id : i;
                return (
                  <div key={key} className="pd-benefit-card">
                    <div className="pd-benefit-icon">✓</div>
                    <h3 className="pd-benefit-title">{title}</h3>
                    {subtitle && <p className="pd-benefit-text">{subtitle}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Temple Details */}
        <section
          className="pd-section pd-temple"
          ref={(el) => {
            sectionRefs.current.temple = el;
          }}
        >
          <div className="pd-section-content">
            <h2 className="pd-temple-name">{puja.templeName}</h2>
            <div className="pd-temple-text">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    puja.templeDescription || "Temple details loading...",
                }}
              />
            </div>
          </div>
        </section>

        {/* Includes */}
        <section className="pd-section pd-includes">
          <div className="pd-section-content">
            <h2 className="pd-section-title">All Puja Packages includes</h2>
            <ul className="pd-includes-list">
              {INCLUDES.map((item, i) => (
                <li key={i}>
                  <span className="pd-includes-check">✓</span> {item}
                </li>
              ))}
            </ul>
            <p className="pd-includes-note">
              Opt for additional offerings like Vastra Daan, Anna Daan, Deep
              Daan, or Gau SHRI AAUM in your name, available on the payments
              page.
            </p>
          </div>
        </section>

        {/* Reviews & Ratings */}
        {/* <section
          className="pd-section pd-reviews-ratings"
          ref={(el) => {
            sectionRefs.current.reviews = el;
          }}
        >
          <div className="pd-section-content">
            <h2 className="pd-reviews-main-title">Reviews & Ratings</h2>
            <p className="pd-reviews-subtitle">
              Read what our beloved devotees have to say about Shri aaum.
            </p>
            <div className="pd-testimonials-wrap">
              <div
                className="pd-testimonials-track"
                style={{ transform: `translateX(-${testimonialIndex * 100}%)` }}
              >
                {TESTIMONIALS.map((t, i) => (
                  <div key={i} className="pd-testimonial-card">
                    {t.type === "video" ? (
                      <div className="pd-testimonial-video">
                        <div className="pd-video-placeholder">
                          ▶ 0:00 / 1:00
                        </div>
                        <div className="pd-testimonial-author">
                          <div className="pd-testimonial-avatar" />
                          <div>
                            <strong>{t.name}</strong>
                            <span>{t.location}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="pd-testimonial-text">{t.text}</p>
                        <div className="pd-testimonial-author">
                          <div className="pd-testimonial-avatar" />
                          <div>
                            <strong>{t.name}</strong>
                            <span>{t.location}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="pd-testimonial-dots">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={i === testimonialIndex ? "active" : ""}
                    onClick={() => setTestimonialIndex(i)}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section> */}

        {/* User Reviews */}
        {/* <section className="pd-section pd-user-reviews">
          <div className="pd-section-content">
            <h2 className="pd-section-title">User Reviews</h2>
            <p className="pd-user-reviews-sub">
              Reviews from our devotees who booked Puja with us
            </p>
            <ul className="pd-user-reviews-list">
              {USER_REVIEWS.map((r, i) => (
                <li key={i} className="pd-user-review-item">
                  <div className="pd-user-review-avatar" />
                  <div className="pd-user-review-content">
                    <div className="pd-user-review-meta">
                      <strong>{r.name}</strong>
                      <span>{r.date}</span>
                    </div>
                    <div className="pd-user-review-stars">
                      {"★".repeat(r.stars)}
                    </div>
                    <p>{r.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button type="button" className="pd-view-more">
              View More
            </button>
          </div>
        </section> */}

        {/* FAQs */}
        <section
          className="pd-section pd-faqs"
          ref={(el) => {
            sectionRefs.current.faqs = el;
          }}
        >
          <div className="pd-section-content">
            <div className="pd-faqs-header">
              <h2 className="pd-section-title">Frequently asked Questions</h2>
            </div>
            <ul className="pd-faq-list">
              {FAQ_ITEMS.map((item, i) => (
                <li key={i} className="pd-faq-item">
                  <button
                    type="button"
                    className="pd-faq-question"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {item.q}
                    <span className="pd-faq-chevron">
                      {openFaq === i ? "▲" : "▼"}
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="pd-faq-answer">{item.a}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}

export default PujaDetail;
