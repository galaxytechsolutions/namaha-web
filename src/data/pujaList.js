import axiosInstance from "../lib/instance";

const mapApiPujaToPUJA_LIST = (apiPuja) => ({
  id: apiPuja._id.slice(-4),
  specialTag: apiPuja.category?.category || `${apiPuja.section} Special`,
  tagColor: apiPuja.section === 'others' ? 'blue' : 
            apiPuja.section === 'wealth' ? 'red' : 'green',
  topChoice: apiPuja.isActive,
  promoText: `${apiPuja.name} Puja - ${apiPuja.description || 'Divine Blessings'}`,
  category: apiPuja.category?.category?.toUpperCase() || 'GENERAL PUJA',
  title: apiPuja.name,
  purpose: apiPuja.benefits?.[0] || 'Seek Divine Blessings & Prosperity',
  location: apiPuja.customSection || `${apiPuja.section?.charAt(0).toUpperCase() + apiPuja.section?.slice(1)} Temple, India`,
  date: new Date(apiPuja.createdAt).toLocaleDateString('en-IN'),
  imageClass: `pl-card-${Math.floor(Math.random() * 3) + 1}`,
  rating: '4.9',
  ratingCount: `${Math.floor(Math.random() * 6 + 2)}K+`,
  devoteesCount: `${Math.floor(Math.random() * 4 + 1)}0,000+`,
  carouselImages: apiPuja.bannerUrls?.map(() => 'pl-card-1') || ['pl-card-1', 'pl-card-1', 'pl-card-1'],
  bannerUrls: apiPuja.bannerUrls,
  duration: apiPuja.duration,
  mode: apiPuja.mode,
});

// 🔥 FIXED: Handle object response with poojas array
export const fetchPujaList = async () => {
  try {
    console.log("🔄 Fetching pujas from API...");
    const response = await axiosInstance.get('/pooja');
    
    console.log("✅ Full API Response:", response.data);
    console.log("✅ response.data type:", typeof response.data);
    
    // ✅ FIX: Handle both direct array AND {poojas: [...]}
    let poojasArray = [];
    
    if (Array.isArray(response.data)) {
      poojasArray = response.data;
    } else if (response.data.poojas && Array.isArray(response.data.poojas)) {
      poojasArray = response.data.poojas;
    } else {
      console.error("❌ Invalid response format:", response.data);
      return [];
    }
    
    console.log("✅ Poojas array length:", poojasArray.length);
    
    const apiPujas = poojasArray.map(mapApiPujaToPUJA_LIST);
    console.log("✅ Mapped PUJA_LIST:", apiPujas);
    
    return apiPujas;
  } catch (error) {
    console.error("❌ API failed:", error.response?.data || error.message);
    return [];
  }
};

export const getPujaById = async (id) => {
  try {
    const allPujas = await fetchPujaList();
    return allPujas.find(p => p.id === id) || null;
  } catch (error) {
    console.error("getPujaById failed:", error);
    return null;
  }
};

export const PUJA_LIST = [];
