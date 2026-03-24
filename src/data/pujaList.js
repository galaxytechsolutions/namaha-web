import axiosInstance from "../lib/instance";
import  { useState, useEffect } from "react";

const sortByAvailabilityThenDate = (a, b) => {
  const now = Date.now();
  const dateA = Number(a?.eventDateRaw || 0);
  const dateB = Number(b?.eventDateRaw || 0);
  const isSoldOutA = dateA > 0 && dateA <= now;
  const isSoldOutB = dateB > 0 && dateB <= now;

  // Upcoming (not sold out) first so bookable pujas are visible first.
  if (isSoldOutA !== isSoldOutB) return isSoldOutA ? 1 : -1;

  // Upcoming group: nearest event first.
  if (!isSoldOutA && !isSoldOutB && dateA !== dateB) return dateA - dateB;

  // Sold-out group: most recently ended first.
  if (isSoldOutA && isSoldOutB && dateA !== dateB) return dateB - dateA;

  return (a.rank ?? 9999) - (b.rank ?? 9999);
};

/* =====================================================
   MAP API RESPONSE → UI FORMAT
===================================================== */
const mapApiPujaToPUJA_LIST = (apiPuja) => {
  const ev = apiPuja.eventDate ? new Date(apiPuja.eventDate) : null;
  const fallback = apiPuja.createdAt ? new Date(apiPuja.createdAt) : null;
  const d =
    ev && !isNaN(ev.getTime())
      ? ev
      : fallback && !isNaN(fallback.getTime())
      ? fallback
      : null;

  const eventPieces = (() => {
    if (!d) return { eventDate: null, eventDateRaw: 0, date: "—" };
    const formatted = d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return { eventDate: formatted, eventDateRaw: d.getTime(), date: formatted };
  })();

  return {
  id: apiPuja._id,
  rank: apiPuja.rank ?? 9999,
  specialTag: apiPuja.category?.category || `${apiPuja.section} Special`,
  tagColor:
    apiPuja.section === "others"
      ? "blue"
      : apiPuja.section === "wealth"
      ? "red"
      : "green",
  topChoice: apiPuja.isTagRequired,
  promoText: `${apiPuja.name} Puja - ${
    apiPuja.description || "Divine Blessings"
  }`,
  // category: puja type/classification (e.g. GENERAL PUJA, FESTIVAL, WEALTH)
  category: apiPuja.category?.category?.toUpperCase() || "GENERAL PUJA",
  title: apiPuja.name,
  location:
    apiPuja.customSection ||
    `${
      apiPuja.section?.charAt(0).toUpperCase() + apiPuja.section?.slice(1)
    } Temple, India`,
  ...eventPieces,
  addOns:
    apiPuja.addOns?.map((addon) => ({
      name: addon.name,
      price: `₹${addon.price}`,
      id: addon._id,
    })) || [],
  packageDetails:
    apiPuja.packageDetails?.map((pkg) => ({
      persons: pkg.persons,
      name: pkg.name,
      price: `₹${pkg.price}`,
      id: pkg._id,
    })) || [],
  imageClass: `pl-card-${Math.floor(Math.random() * 3) + 1}`,
  // templeName: temple/venue name (API may return as temple.name, temple.templeName, or templeName)
  templeName: apiPuja.temple?.name || apiPuja.temple?.templeName || apiPuja.templeName || apiPuja.customSection || null,
  templeDescription: apiPuja.templeDescription,
  aboutPuja: apiPuja.aboutPuja,
  description: apiPuja.description || null,
  rating: "4.9",
  ratingCount: `${Math.floor(Math.random() * 6 + 2)}K+`,
  devoteesCount: `${Math.floor(Math.random() * 4 + 1)}0,000+`,
  carouselImages: apiPuja.bannerUrls?.map(() => "pl-card-1") || [
    "pl-card-1",
    "pl-card-1",
    "pl-card-1",
  ],
  bannerUrls: apiPuja.bannerUrls,
  // duration: estimated time for the puja (e.g. "1-2 hours", "30 mins")
  duration: apiPuja.duration,
  mode: apiPuja.mode,
  benefits: apiPuja.benefits,
  isActive: apiPuja.isActive,
  section: apiPuja.section,
  // occasion: auspicious event/festival when puja is performed (e.g. Ram Navami, Diwali)
  occasion: apiPuja.occasion || apiPuja.eventOccasion || apiPuja.specialTag || null,
  // SOLD OUT purely from event date — if event date/time has passed, mark as sold
  soldTag: !!(eventPieces.eventDateRaw && eventPieces.eventDateRaw <= Date.now()),
  coupon: apiPuja.coupon
    ? {
        code: apiPuja.coupon.code,
        discountType: apiPuja.coupon.discountType,
        discountValue: apiPuja.coupon.discountValue,
        maxDiscountAmount: apiPuja.coupon.maxDiscountAmount,
        expiryDate: apiPuja.coupon.expiryDate
          ? new Date(apiPuja.coupon.expiryDate).toLocaleDateString("en-IN")
          : null,
        isActive: apiPuja.coupon.isActive,
      }
    : null,
  // Multiple coupons per pooja (backend); legacy single coupon as one-item list
  coupons:
    apiPuja.coupons?.length > 0
      ? apiPuja.coupons.map((c) => ({
          code: c.code,
          discountType: c.discountType,
          discountValue: c.discountValue,
          maxDiscountAmount: c.maxDiscountAmount,
          expiryDate: c.expiryDate
            ? new Date(c.expiryDate).toLocaleDateString("en-IN")
            : null,
          isActive: c.isActive !== false,
        }))
      : apiPuja.coupon
        ? [
            {
              code: apiPuja.coupon.code,
              discountType: apiPuja.coupon.discountType,
              discountValue: apiPuja.coupon.discountValue,
              maxDiscountAmount: apiPuja.coupon.maxDiscountAmount,
              expiryDate: apiPuja.coupon.expiryDate
                ? new Date(apiPuja.coupon.expiryDate).toLocaleDateString("en-IN")
                : null,
              isActive: apiPuja.coupon.isActive !== false,
            },
          ]
        : [],
  };
};

/* =====================================================
   🔥 DUMMY DATA (USED IF API FAILS)
===================================================== */
export const PUJA_LIST = [
  {
    id: "1001",
    rank: 1,
    eventDateRaw: new Date("2026-02-12").getTime(),
    specialTag: "MOST POPULAR",
    tagColor: "red",
    topChoice: true,
    promoText: "Maha Ganapathi Puja - Remove obstacles and gain success",
    category: "GANESHA PUJA",
    title: "Maha Ganapathi Homam",
    description: "Removes obstacles and brings prosperity.",
    benefits: [
      { title: "Removes obstacles from your path" },
      { title: "Brings success and prosperity" },
    ],
    purpose: "Removes obstacles and brings prosperity",
    location: "Tirupati Temple, India",
    templeName: "Tirupati Temple",
    date: "12 Feb 2026",
    imageClass: "pl-card-1",
    rating: "4.9",
    ratingCount: "5K+",
    devoteesCount: "50,000+",
    carouselImages: ["pl-card-1", "pl-card-1", "pl-card-1"],
    bannerUrls: [
      {
        url: "https://images.unsplash.com/photo-1604608672516-3b5c9b1c6b14",
      },
      {
        url: "https://images.unsplash.com/photo-1593697820988-9b9f0f9b1d8b",
      },
    ],
    duration: "2 hours",
    mode: "online",
  },
  {
    id: "1002",
    rank: 2,
    eventDateRaw: new Date("2026-02-15").getTime(),
    specialTag: "WEALTH SPECIAL",
    tagColor: "green",
    topChoice: false,
    promoText: "Lakshmi Kubera Puja - Attract wealth and abundance",
    category: "LAKSHMI PUJA",
    title: "Lakshmi Kubera Homam",
    description: "Attract wealth and abundance through sacred offerings.",
    benefits: [
      { title: "Attracts wealth and abundance" },
      { title: "Improves financial stability" },
    ],
    purpose: "Financial growth and prosperity",
    location: "Chennai Temple, India",
    templeName: "Chennai Temple",
    date: "15 Feb 2026",
    imageClass: "pl-card-2",
    rating: "4.8",
    ratingCount: "3K+",
    devoteesCount: "30,000+",
    carouselImages: ["pl-card-1", "pl-card-1", "pl-card-1"],
    bannerUrls: [
      {
        url: "https://images.unsplash.com/photo-1619441207975-6d4d1a7e676f",
      },
    ],
    duration: "3 hours",
    mode: "online",
  },
];

/* =====================================================
   FETCH PUJA LIST FROM API (WITH FALLBACK)
===================================================== */
export const fetchPujaList = async () => {
  try {
    console.log("🔄 Fetching pujas from API...");
    const response = await axiosInstance.get("/pooja");

    console.log("✅ Full API Response:", response.data);

    let poojasArray = [];

    if (Array.isArray(response.data)) {
      poojasArray = response.data;
    } else if (response.data?.poojas && Array.isArray(response.data.poojas)) {
      poojasArray = response.data.poojas;
    } else {
      console.warn("⚠️ Invalid API format — using dummy data");
      return PUJA_LIST;
    }

    const mapped = poojasArray
      .map(mapApiPujaToPUJA_LIST)
      .sort(sortByAvailabilityThenDate);

    if (!mapped.length) {
      console.warn("⚠️ API returned empty — using dummy data");
      return PUJA_LIST;
    }

    console.log("✅ Using API pujas:", mapped);
    return mapped;
  } catch (error) {
    console.error("❌ API failed — using dummy data");
    return [...PUJA_LIST].sort(sortByAvailabilityThenDate);
  }
};

// React hook: usePujaList provides pujas + loading + error for components
export function usePujaList() {
  const [pujas, setPujas] = useState(PUJA_LIST);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchPujaList();
        if (!mounted) return;
        setPujas(data);
        setLoading(false);
      } catch (err) {
        if (!mounted) return;
        setError(err);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { pujas, loading, error };
}
/* =====================================================
   FETCH SINGLE PUJA BY ID - uses GET /api/pooja/:id
===================================================== */
export const fetchPujaById = async (id) => {
  if (!id) return null;
  try {
    const response = await axiosInstance.get(`/pooja/${id}`);
    const raw = response.data;
    if (!raw) return null;
    // Handle wrapped responses: { pooja }, { data }, or raw array/object
    let apiPuja = raw;
    if (raw.pooja && typeof raw.pooja === "object") apiPuja = raw.pooja;
    else if (raw.data && typeof raw.data === "object") apiPuja = raw.data;
    const arr = Array.isArray(apiPuja) ? apiPuja : [apiPuja];
    const mapped = arr.map(mapApiPujaToPUJA_LIST);
    return mapped[0] || null;
  } catch (error) {
    if (error?.response?.status === 404) return null;
    console.error("fetchPujaById failed:", error);
    return null;
  }
};

export const getPujaById = async (id) => {
  try {
    const puja = await fetchPujaById(id);
    if (puja) return puja;
    // Fallback: fetch list and match (for legacy/short IDs)
    const allPujas = await fetchPujaList();
    return (
      allPujas.find((p) => p.id === id) ||
      allPujas.find((p) => p.id && p.id.slice(-4) === id) ||
      null
    );
  } catch (error) {
    console.error("getPujaById failed:", error);
    return null;
  }
};
