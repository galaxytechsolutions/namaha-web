import axiosInstance from "../lib/instance";

/* =====================================================
   MAP API RESPONSE → UI FORMAT
===================================================== */
const mapApiPujaToPUJA_LIST = (apiPuja) => ({
  id: apiPuja._id.slice(-4),
  specialTag: apiPuja.category?.category || `${apiPuja.section} Special`,
  tagColor:
    apiPuja.section === "others"
      ? "blue"
      : apiPuja.section === "wealth"
      ? "red"
      : "green",
  topChoice: apiPuja.isActive,
  promoText: `${apiPuja.name} Puja - ${
    apiPuja.description || "Divine Blessings"
  }`,
  category: apiPuja.category?.category?.toUpperCase() || "GENERAL PUJA",
  title: apiPuja.name,
  purpose:
    apiPuja.benefits?.[0] || "Seek Divine Blessings & Prosperity",
  location:
    apiPuja.customSection ||
    `${
      apiPuja.section?.charAt(0).toUpperCase() +
      apiPuja.section?.slice(1)
    } Temple, India`,
  date: new Date(apiPuja.createdAt).toLocaleDateString("en-IN"),
  imageClass: `pl-card-${Math.floor(Math.random() * 3) + 1}`,
  rating: "4.9",
  ratingCount: `${Math.floor(Math.random() * 6 + 2)}K+`,
  devoteesCount: `${Math.floor(Math.random() * 4 + 1)}0,000+`,
  carouselImages:
    apiPuja.bannerUrls?.map(() => "pl-card-1") || [
      "pl-card-1",
      "pl-card-1",
      "pl-card-1",
    ],
  bannerUrls: apiPuja.bannerUrls,
  duration: apiPuja.duration,
  mode: apiPuja.mode,
});

/* =====================================================
   🔥 DUMMY DATA (USED IF API FAILS)
===================================================== */
export const PUJA_LIST = [
  {
    id: "1001",
    specialTag: "MOST POPULAR",
    tagColor: "red",
    topChoice: true,
    promoText:
      "Maha Ganapathi Puja - Remove obstacles and gain success",
    category: "GANESHA PUJA",
    title: "Maha Ganapathi Homam",
    purpose: "Removes obstacles and brings prosperity",
    location: "Tirupati Temple, India",
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
    specialTag: "WEALTH SPECIAL",
    tagColor: "green",
    topChoice: false,
    promoText:
      "Lakshmi Kubera Puja - Attract wealth and abundance",
    category: "LAKSHMI PUJA",
    title: "Lakshmi Kubera Homam",
    purpose: "Financial growth and prosperity",
    location: "Chennai Temple, India",
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
    } else if (
      response.data?.poojas &&
      Array.isArray(response.data.poojas)
    ) {
      poojasArray = response.data.poojas;
    } else {
      console.warn("⚠️ Invalid API format — using dummy data");
      return PUJA_LIST;
    }

    const mapped = poojasArray.map(mapApiPujaToPUJA_LIST);

    if (!mapped.length) {
      console.warn("⚠️ API returned empty — using dummy data");
      return PUJA_LIST;
    }

    console.log("✅ Using API pujas:", mapped);
    return mapped;

  } catch (error) {
    console.error("❌ API failed — using dummy data");
    return PUJA_LIST;
  }
};

/* =====================================================
   GET SINGLE PUJA BY ID
===================================================== */
export const getPujaById = async (id) => {
  try {
    const allPujas = await fetchPujaList();
    return allPujas.find((p) => p.id === id) || null;
  } catch (error) {
    console.error("getPujaById failed:", error);
    return null;
  }
};
