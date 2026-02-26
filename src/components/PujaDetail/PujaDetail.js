import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPujaList } from "../../data/pujaList";
import "./PujaDetail.css";
import Footer from "../Footer/Footer";
import axiosInstance from "../../lib/instance";

const SECTION_TABS = [
  { id: "about", label: "About Puja" },
  { id: "benefits", label: "Benefits" },
  { id: "process", label: "Process" },
  { id: "temple", label: "Temple Details" },
  { id: "packages", label: "Packages" },
  { id: "reviews", label: "Reviews" },
  { id: "faqs", label: "FAQs" },
];

const PROCESS_STEPS = [
  { title: "Select Puja", text: "Choose from puja packages listed below." },
  {
    title: "Add Offerings",
    text: "Enhance your puja experience with optional offerings like Gau SHRI AAUM, Deep Daan, Vastra SHRI AAUM, and Anna SHRI AAUM.",
  },
  {
    title: "Provide Sankalp details",
    text: "Enter your Name and Gotra for the Sankalp.",
  },
  {
    title: "Puja Day Updates",
    text: "Our experienced pandits perform the sacred puja. All Sri Mandir devotees' pujas will be conducted collectively on the day of the puja. You will receive real-time updates of the puja on your registered WhatsApp number.",
  },
  {
    title: "Puja Video & Divine Aashirwad Box",
    text: "Get the puja video within 3-4 days on WhatsApp. Receive Divine Aashirwad Box delivered to your doorstep within 8-10 days.",
  },
];

const getPackages = (puja) => {
  if (puja?.packageDetails?.length > 0) {
    return puja.packageDetails.map((pkg) => ({
      // packageDetails may come from mapped data (id) or raw API (_id).
      id: pkg.id || pkg._id,
      name: pkg.name,
      price:
        typeof pkg.price === "string"
          ? Number(pkg.price.replace(/[^0-9]/g, ""))
          : Number(pkg.price),
      persons: pkg.persons || 1,
    }));
  }

  return [
    { id: "individual", name: "Individual Puja", price: 851, persons: 1 },
    { id: "partner", name: "Partner Puja", price: 1251, persons: 2 },
    { id: "family", name: "Family + Bhog", price: 2001, persons: 4 },
    {
      id: "joint",
      name: "Joint Family + Bhog + Flower Basket",
      price: 3001,
      persons: 6,
    },
  ];
};

const INCLUDES = [
  "The participant's name and gotra will be recited by an experienced Panditji during the puja.",
  "Participants will receive guided mantras and step-by-step instructions to join the puja from home.",
  "A complete video of the puja and offerings will be shared on your WhatsApp.",
  "A free Aashirwad Box with Tirth Prasad will be delivered to your home if you opt in to receive it.",
];

const TESTIMONIALS = [
  { type: "video", name: "Achutam Nair", location: "Bangalore" },
  {
    text: "So many puja options for all the devotees. Great to get the grace of god from our homes. Most authentic and trustworthy puja service compared to others.",
    name: "Ramesh Chandra Bhatt",
    location: "Nagpur",
  },
  {
    text: "I really like the whole process of puja at Sri Mandir. Puja is conducted properly and customer support is available throughout the process. I asked questions to Mamta Maam and she resolved my queries. Most genuine and authentic.",
    name: "Aperna Mal",
    location: "Puri",
  },
  {
    text: "Liked the fact that we can book puja online else have to travel to get everything done. Felt very nice to hear my name and gotra during the puja of Mahadev. Prasad was also received in time.",
    name: "Shivraj Dobhi",
    location: "Agra",
  },
];

const USER_REVIEWS = [
  {
    name: "Riya Das",
    date: "23 July, 2025",
    stars: 5,
    text: "Thank you so much Sri Mandir for conducting the puja for those who can not go to the temple from so far. I am Happy to heard my name and gotra sankalp in the puja video. Jai Sri Gouri Kedareswar Mahadev",
  },
  {
    name: "Suvomoy Bhowmick samarpitaa Bhowmick",
    date: "22 July, 2025",
    stars: 5,
    text: "Thank you for your support and devotion in this spiritual journey. 🙏",
  },
  {
    name: "Nita Inamdar",
    date: "22 July, 2025",
    stars: 5,
    text: "Gratitude to all the pandit ji's for conducting puja on our behalf.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Why should I choose SriMandir for performing a Puja?",
    a: "Sri Mandir is an official temple partner with experienced pandits. We offer transparent pricing, real-time puja updates, and delivery of prasad to your doorstep.",
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
    q: "What are the other services offered by Sri Mandir?",
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
  const [paymentError, setPaymentError] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [puja, setPuja] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  // Replace static countdown state
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0, // ✅ Changed from 'min', 'secs'
  });

  const [activeTab, setActiveTab] = useState("about");
  const [openFaq, setOpenFaq] = useState(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [autoSelectedSlot, setAutoSelectedSlot] = useState(null);
  const [bookingDate, setBookingDate] = useState(null);
  const [selectedPanditId, setSelectedPanditId] = useState(null);
  const [selectedPandit, setSelectedPandit] = useState(null); // mode, location from pandit
  const [prasadam, setPrasadam] = useState(false);
  const [addonQuantities, setAddonQuantities] = useState({});

  const sectionRefs = useRef({});
  const sectionNavRef = useRef(null);
  const stickyThresholdRef = useRef(null);

  const slides = puja?.bannerUrls?.map((img) => img.url) || [];

const findPanditForPuja = useCallback(async (pujaId) => {
    try {
      // ✅ Guard: pujaId must be a valid 24-char MongoDB ObjectId

      if (!pujaId || pujaId.length !== 24) {
        console.error(
          "❌ pujaId is not a valid ObjectId — check pujaList.js mapping!"
        );
        console.error("   Expected: full _id like '6942677920c6344505bfd99f'");
        console.error("   Got:", pujaId);
        return null;
      }

      // ✅ Pass poojaId as query param to backend
      const res = await axiosInstance.get("/pandit/by-pooja-id", {
        params: { poojaId: pujaId }, // ← THIS was missing before
      });

      console.log("📡 /by-pooja-id response status:", res.status);
      console.log("📡 /by-pooja-id full response:", res.data);
      console.log("📡 pandits returned:", res.data?.pandits?.length ?? 0);

      const allPandits = res.data?.pandits || [];

      if (allPandits.length === 0) {
        console.warn("⚠️ dummy testing:", pujaId);
        return null;
      }

      // Log each pandit for debugging
      allPandits.forEach((p, i) => {
        console.log(`👤 Pandit[${i}]:`, {
          _id: p._id,
          name: p.name,
          isActive: p.isActive,
          services: p.services,
        });
      });

      // Backend already filtered by service, just return the first active one
      // (isActive check is a safety net in case backend doesn't filter)
      const matched = allPandits.find((p) => p.isActive !== false);

      console.log(
        "✅ Matched pandit:",
        matched
          ? `${matched.name} (${matched._id})`
          : "NONE — all pandits inactive or empty"
      );

      return matched || null;
  } catch (err) {
      console.error("❌ findPanditForPuja API error:");
      console.error("   Status:", err.response?.status);
      console.error("   Message:", err.response?.data?.message || err.message);
      console.error("   Full error:", err.response?.data);
      return null;
    }
  }, []);

const getFirstAvailableSlot = useCallback(async (panditId, pujaId, pujaDate, pujaLocation, panditMode, panditLocation) => {
    console.log("🗓 getFirstAvailableSlot called");
    console.log("   panditId:", panditId);
    console.log("   pujaId:", pujaId);
    console.log("   pujaDate:", pujaDate);

    const normalizePujaDate = (dateStr) => {
      if (!dateStr) return null;

      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;

      const parts = dateStr.split("/");
      if (parts.length === 3) {
        const day = parts[0].padStart(2, "0");
        const month = parts[1].padStart(2, "0");
        const year = parts[2];
        return `${day}/${month}/${year}`;
      }

      try {
        const parsed = new Date(dateStr);
        if (!isNaN(parsed)) {
          return parsed.toLocaleDateString("en-GB");
        }
      } catch (e) {}

      return null;
    };

    const dateStr = normalizePujaDate(pujaDate);

    if (!dateStr) {
      console.error("❌ Could not normalize puja date:", pujaDate);
      return null;
    }

    console.log("📅 Checking slots ONLY for puja date:", dateStr);

    try {
    const payload = {
        panditId,
        poojaId: pujaId,
        date: dateStr,
        slots: [],
        mode: panditMode || "online",
        location: panditLocation
          ? {
              lat: panditLocation.lat,
              lng: panditLocation.long ?? panditLocation.lng,
              address: panditLocation.address || pujaLocation || "Sri Mandir",
            }
          : {
              lat: 17.385,
              lng: 78.4867,
              address: pujaLocation || "Sri Mandir",
            },
      };

      console.log("Payload:", payload);

      const res = await axiosInstance.post("/bookings/booking", payload);

      console.log("   Response:", res.data);
      console.log("   availableSlots:", res.data?.availableSlots);

      if (res.data.success && res.data.availableSlots?.length > 0) {
        const firstSlot = res.data.availableSlots[0];
        console.log("✅ Slot found on puja date:", firstSlot);
        return { slot: firstSlot, date: dateStr };
      }

      // No slots on puja date — do NOT fallback
      console.warn("⚠️ No slots available on puja date:", dateStr);
      return null;
    } catch (err) {
      console.error("❌ Slot check failed for puja date:", dateStr);
      console.error("   Status:", err.response?.status);
      console.error("   Message:", err.response?.data?.message || err.message);
      return null;
    }
  }, []);

  const updateAddonQuantity = (addonId, change) => {
    setAddonQuantities((prev) => ({
      ...prev,
      [addonId]: Math.max(0, (prev[addonId] || 0) + change),
    }));
  };

  // ─────────────────────────────────────────────────────────
  // STEP 3: Auto-run on puja load — find pandit + slot
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!puja?.id) return;

    const autoLoad = async () => {
      try {
        // Use puja.id (should be full ObjectId after pujaList.js fix)
        const matchedPandit = await findPanditForPuja(puja.id);

        if (!matchedPandit) {
          console.warn("⚠️ No pandit found — cannot proceed to booking");
          setPaymentError("No pandit payment gateway available.");
          return;
        }

        console.log("✅ Using pandit:", matchedPandit._id, matchedPandit.name);

        const result = await getFirstAvailableSlot(
          matchedPandit._id,
          puja.id,
          puja.date, // ← actual puja date only
          puja.location,
          matchedPandit.mode,
          matchedPandit.location
        );

        if (!result) {
          setPaymentError(`No slots available for this puja on ${puja.date}.`);
          return;
        }

        // ✅ Store everything in state (including pandit mode & location for payload)
        setAutoSelectedSlot(result.slot);
        setBookingDate(result.date);
        setSelectedPanditId(matchedPandit._id);
        setSelectedPandit(matchedPandit);
        setPaymentError(""); // clear any previous error

        console.log("✅ autoLoad complete:", {
          panditId: matchedPandit._id,
          slot: result.slot,
          date: result.date,
        });
      } catch (err) {
        console.error("❌ autoLoad crashed:", err);
      }
    };

    autoLoad();
  }, [puja?.id, puja?.date, puja?.location, findPanditForPuja, getFirstAvailableSlot]);

  // ─────────────────────────────────────────────────────────
  // STEP 4: Navigate to billing with all collected data
  // ─────────────────────────────────────────────────────────
  const handleGoToBilling = () => {
    if (puja?.soldTag) {
      alert("This puja is SOLD OUT and cannot be booked.");
      return;
    }
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first to proceed");
      navigate("/login");
      return;
    }

    if (!autoSelectedSlot || !bookingDate || !selectedPanditId) {
      alert("Finding available slots... Please wait a moment and try again.");
      return;
    }

    if (paymentError) {
      alert(paymentError);
      return;
    }

    // ✅ BUILD ADDON ITEMS WITH TOTAL AMOUNTS
    const selectedAddons = Object.entries(addonQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([addonId, quantity]) => {
        // Find matching addon from puja.addOns
        const addon = puja.addOns.find(
          (a) => (a.id || `addon-${puja.addOns.indexOf(a)}`) === addonId
        );

        if (!addon) return null;

        const price = parseInt(addon.price.replace(/[^0-9]/g, ""));

        return {
          id: addon.id || addonId,
          name: addon.name,
          price: price,
          quantity: quantity,
          total: price * quantity,
        };
      })
      .filter(Boolean); // Remove nulls

    const mainImage = puja?.bannerUrls?.[0]?.url || null;

    const billingState = {
      puja,
      selectedPackage,
      panditId: selectedPanditId,
      bookingDate,
      slot: autoSelectedSlot,
      image: mainImage,

      // addons
      addons: selectedAddons,
      addonsTotal: selectedAddons.reduce((sum, addon) => sum + addon.total, 0),

      // totals
      grandTotal:
        selectedPackage.price +
        selectedAddons.reduce((sum, addon) => sum + addon.total, 0),

      // coupon data from puja (send full coupon; billing validates isActive)
      coupon: puja?.coupon ?? null,

      // mode from puja (e.g. "hybrid")
      mode: puja?.mode,

      // temple address from puja
      pujaLocation: puja?.location,

      // pandit location (lat/lng) for booking payload
      panditLocation: selectedPandit?.location,

      // prasadam option
      prasadam,
    };

    console.log("✅ Navigating to /billing with state:", {
      ...billingState,
      addons: selectedAddons, // Don't log full puja to avoid clutter
    });

    navigate("/billing", { state: billingState });
  };

  // ✅ REPLACE with this (remove PACKAGES[0])
  useEffect(() => {
    const loadPuja = async () => {
      setLoading(true);
      const pujaList = await fetchPujaList();

      console.log("📋 URL param id:", id);
      console.log(
        "📋 pujaList IDs:",
        pujaList.map((p) => p.id)
      );

      // ✅ TWO-STEP MATCH: full ID first, then last-4 fallback
      const foundPuja =
        pujaList.find((p) => p.id === id) ||
        pujaList.find((p) => p.id.slice(-4) === id) ||
        null;

      console.log("📋 foundPuja:", foundPuja ? foundPuja.title : "NOT FOUND");
      console.log("📋 foundPuja.id:", foundPuja?.id);

      setPuja(foundPuja);

      // ✅ FIX: Use getPackages instead of PACKAGES[0]
      if (foundPuja) {
        // Do not auto-select a package — let the user choose explicitly.
        setSelectedPackage(null);
      }
      setLoading(false);
    };
    loadPuja();
  }, [id]);

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

  // 🔥 BULLETPROOF COUNTDOWN - Copy paste this EXACTLY
  useEffect(() => {
    // Run once when puja loads (empty deps)
    if (!puja?.date) return;

    console.log("🚀 Starting countdown for:", puja.date);

    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split("/").map((n) => parseInt(n));
      return new Date(year, month - 1, day, 23, 59, 59);
    };

    let intervalId;

    const tick = () => {
      const eventTime = parseDate(puja.date).getTime();
      const now = Date.now();
      const diff = eventTime - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(intervalId);
        return;
      }

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
              <span className="pd-badge">{puja.specialTag}</span>
            </div>

            {/* Add-ons section */}
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
                        {/* Name - Left */}
                        <div className="pd-addon-info">
                          <div className="pd-addon-info">
                            <p
                              className="pd-addon-name"
                              title={addon.name} // ✅ Native browser tooltip
                            >
                              {addon.name}
                            </p>
                          </div>
                        </div>

                        {/* Price + Controls - Right */}
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
          </div>

          {/* Right: Event details */}
          <div className="pd-details">
            <p className="pd-category">{puja.category}</p>
            <h1 className="pd-title">{puja.title}</h1>
            <p className="pd-purpose">{puja.purpose}</p>
            <p className="pd-meta">
              <span className="pd-meta-icon">🏛</span>
              {puja.location}
            </p>
            <p className="pd-meta">
              <span className="pd-meta-icon">📅</span>
              {puja.date}
            </p>
            <p className="pd-purpose">Duration: {puja.duration}</p>
            <p className="pd-purpose">Mode: {puja.mode}</p>
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

            <div className="pd-participants">
              <div className="pd-avatars">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="pd-avatar" />
                ))}
              </div>
              <span className="pd-rating">
                ⭐ {puja.rating} ({puja.ratingCount} ratings)
              </span>
            </div>
            <p className="pd-devotees">
              Till now <strong>{puja.devoteesCount} Devotees</strong> have
              participated in Pujas conducted by Sri Mandir Puja SHRI AAUM.
            </p>
            <button
              type="button"
              className="pd-cta"
              onClick={() => scrollToSection("packages")}
            >
              Select puja package →
            </button>
          </div>
        </div>

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

        {/* About Puja */}
        <section
          className="pd-section pd-about"
          ref={(el) => {
            sectionRefs.current.about = el;
          }}
        >
          <div className="pd-section-content">
            <div className="pd-about-inner">
              <span className="pd-about-icon">🪔</span>
              <h2 className="pd-about-heading">{puja.title}</h2>
            </div>
            <div className="pd-about-body">
              <div
                dangerouslySetInnerHTML={{
                  __html: puja.promoText || "Loading description...",
                }}
              />
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
              {puja.benefits?.map((benefit, i) => (
                <div key={i} className="pd-benefit-card">
                  <div className="pd-benefit-icon">✓</div>
                  <h3 className="pd-benefit-title">{benefit}</h3>
                  {/* <button type="button" className="pd-read-more">Read more</button> */}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section
          className="pd-section pd-process"
          ref={(el) => {
            sectionRefs.current.process = el;
          }}
        >
          <div className="pd-section-content">
            <h2 className="pd-section-title">Puja Process</h2>
            <div className="pd-process-list">
              {PROCESS_STEPS.map((step, i) => (
                <div key={i} className="pd-process-step">
                  <div className="pd-process-num">{i + 1}</div>
                  <div>
                    <h3 className="pd-process-step-title">{step.title}</h3>
                    <p className="pd-process-step-text">{step.text}</p>
                  </div>
                </div>
              ))}
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
            <h2 className="pd-temple-name">{puja.location}</h2>
            <div className="pd-temple-grid">
              <img
                src={slides[0] || puja?.bannerUrls?.[0]?.url || "https://via.placeholder.com/800x600"}
                alt={puja.location || "Temple image"}
                className="pd-temple-image"
              />
              <div className="pd-temple-text">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      puja.templeDescription || "Temple details loading...",
                  }}
                />
              </div>
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

        {/* Package selection */}
        <section
          className="pd-section pd-packages"
          ref={(el) => {
            sectionRefs.current.packages = el;
          }}
        >
          <div className="pd-section-content">
            <h2 className="pd-section-title">Select your puja package</h2>
            <div className="pd-package-cards">
              {getPackages(puja).map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  className={`pd-package-card ${
                    selectedPackage?.id === pkg.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  {selectedPackage?.id === pkg.id && (
                    <span className="pd-package-check">✓</span>
                  )}

                  <div className="pd-package-info">
                    <span className="pd-package-persons">
                      {pkg.persons} Person{pkg.persons > 1 ? "s" : ""}
                    </span>
                    <h3 className="pd-package-name">{pkg.name}</h3>
                    <span className="pd-package-price">{pkg.price}</span>
                  </div>

                  <div className="pd-package-image" />
                </button>
              ))}
            </div>
            <div className="pd-trust-badges">
              <span>🛡 ISO 27001 Certified Company</span>
              <span>🏛 Official Temple Partner</span>
              <span>🎧 Customer Support</span>
            </div>
          </div>
        </section>

        {/* Sticky footer CTA */}
        <div className="pd-sticky-footer">
          {paymentError && (
            <div className="pd-error-banner">{paymentError}</div>
          )}

          <div className="pd-sticky-content">
            <div className="pd-sticky-left">
              <div className="pd-sticky-price-block">
                <span className="pd-sticky-price">
                  {selectedPackage?.price?.toLocaleString("en-IN") || "0"}
                </span>
                <span className="pd-sticky-name">
                  {selectedPackage?.name || "Select Package"}
                </span>
              </div>
              <label className="pd-sticky-prasadam">
                <input
                  type="checkbox"
                  checked={prasadam}
                  onChange={(e) => setPrasadam(e.target.checked)}
                />
                <span>Prasadam (Compulementary)</span>
              </label>
            </div>

            <button
              className={`pd-sticky-btn ${puja?.soldTag ? "sold-out" : ""}`}
              onClick={handleGoToBilling}
              disabled={loading || puja?.soldTag}
            >
              {puja?.soldTag ? "SOLD OUT" : loading ? "⏳ Processing..." : "Proceed to Payment →"}
            </button>
          </div>
        </div>

        {/* Reviews & Ratings */}
        <section
          className="pd-section pd-reviews-ratings"
          ref={(el) => {
            sectionRefs.current.reviews = el;
          }}
        >
          <div className="pd-section-content">
            <h2 className="pd-reviews-main-title">Reviews & Ratings</h2>
            <p className="pd-reviews-subtitle">
              Read what our beloved devotees have to say about Sri Mandir.
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
        </section>

        {/* User Reviews */}
        <section className="pd-section pd-user-reviews">
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
        </section>

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
