import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPujaList } from '../../data/pujaList';
import './PujaDetail.css';
import Footer from '../Footer/Footer';
import axiosInstance from '../../lib/instance';

const SECTION_TABS = [
  { id: 'about', label: 'About Puja' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'process', label: 'Process' },
  { id: 'temple', label: 'Temple Details' },
  { id: 'packages', label: 'Packages' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'faqs', label: 'FAQs' },
];

const BENEFITS = [
  { title: 'For Mental Stability', text: 'In the dasha of Rahu, sometimes thinking and decision-making ability can be affected. By performing 18,000 Rahu Mool Mantra Jaap and related rituals, one can seek mental clarity and stability.' },
  { title: 'For Protection from Negative Energy', text: 'Due to the harmful effect of Rahu, instability or negative energy can be felt in the environment. By performing mantra chanting and Havan, devotees seek protection and positivity.' },
  { title: 'For Ease in Financial Struggle', text: 'During Rahu Mahadasha, financial or professional challenges can increase. Performing mantra chanting and Havan with devotion can help ease these struggles.' },
];

const PROCESS_STEPS = [
  { title: 'Select Puja', text: 'Choose from puja packages listed below.' },
  { title: 'Add Offerings', text: 'Enhance your puja experience with optional offerings like Gau SHRI AAUM, Deep Daan, Vastra SHRI AAUM, and Anna SHRI AAUM.' },
  { title: 'Provide Sankalp details', text: 'Enter your Name and Gotra for the Sankalp.' },
  { title: 'Puja Day Updates', text: "Our experienced pandits perform the sacred puja. All Sri Mandir devotees' pujas will be conducted collectively on the day of the puja. You will receive real-time updates of the puja on your registered WhatsApp number." },
  { title: 'Puja Video & Divine Aashirwad Box', text: 'Get the puja video within 3-4 days on WhatsApp. Receive Divine Aashirwad Box delivered to your doorstep within 8-10 days.' },
];

const PACKAGES = [
  { id: 'individual', name: 'Individual Puja', price: 851, persons: 1 },
  { id: 'partner', name: 'Partner Puja', price: 1251, persons: 2 },
  { id: 'family', name: 'Family + Bhog', price: 2001, persons: 4 },
  { id: 'joint', name: 'Joint Family + Bhog + Flower Basket', price: 3001, persons: 6 },
];

const INCLUDES = [
  'The participant\'s name and gotra will be recited by an experienced Panditji during the puja.',
  'Participants will receive guided mantras and step-by-step instructions to join the puja from home.',
  'A complete video of the puja and offerings will be shared on your WhatsApp.',
  'A free Aashirwad Box with Tirth Prasad will be delivered to your home if you opt in to receive it.',
];

const TESTIMONIALS = [
  { type: 'video', name: 'Achutam Nair', location: 'Bangalore' },
  { text: 'So many puja options for all the devotees. Great to get the grace of god from our homes. Most authentic and trustworthy puja service compared to others.', name: 'Ramesh Chandra Bhatt', location: 'Nagpur' },
  { text: 'I really like the whole process of puja at Sri Mandir. Puja is conducted properly and customer support is available throughout the process. I asked questions to Mamta Maam and she resolved my queries. Most genuine and authentic.', name: 'Aperna Mal', location: 'Puri' },
  { text: 'Liked the fact that we can book puja online else have to travel to get everything done. Felt very nice to hear my name and gotra during the puja of Mahadev. Prasad was also received in time.', name: 'Shivraj Dobhi', location: 'Agra' },
];

const USER_REVIEWS = [
  { name: 'Riya Das', date: '23 July, 2025', stars: 5, text: 'Thank you so much Sri Mandir for conducting the puja for those who can not go to the temple from so far. I am Happy to heard my name and gotra sankalp in the puja video. Jai Sri Gouri Kedareswar Mahadev' },
  { name: 'Suvomoy Bhowmick samarpitaa Bhowmick', date: '22 July, 2025', stars: 5, text: 'Thank you for your support and devotion in this spiritual journey. 🙏' },
  { name: 'Nita Inamdar', date: '22 July, 2025', stars: 5, text: "Gratitude to all the pandit ji's for conducting puja on our behalf." },
];

const FAQ_ITEMS = [
  { q: 'Why should I choose SriMandir for performing a Puja?', a: 'Sri Mandir is an official temple partner with experienced pandits. We offer transparent pricing, real-time puja updates, and delivery of prasad to your doorstep.' },
  { q: "I don't know my Gotra, what should I do?", a: 'You can leave the Gotra field blank or select "Unknown". Our team can also help you find it if you know your family deity or lineage.' },
  { q: 'Who will perform the Puja?', a: 'Experienced and qualified pandits from the temple perform the puja on your behalf. All devotees\' names are recited during the collective puja.' },
  { q: 'What will be done in this Puja?', a: 'The puja includes mantra chanting, havan, and rituals as per the specific puja you select. Details are mentioned in the puja description.' },
  { q: 'How will I know the Puja has been done in my name?', a: 'You will receive real-time updates on your registered WhatsApp number. A complete video of the puja is also shared within 3-4 days.' },
  { q: 'What will I get after the Puja is done?', a: 'You receive the puja video on WhatsApp and an optional Aashirwad Box with Tirth Prasad delivered to your doorstep.' },
  { q: 'What are the other services offered by Sri Mandir?', a: 'We offer various pujas, Gau SHRI AAUM, Deep Daan, Vastra SHRI AAUM, Anna SHRI AAUM, and other devotional services at partner temples.' },
  { q: 'Where can I contact for more information?', a: 'You can reach us via the contact details on our website or through the customer support option during checkout.' },
];

function PujaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [puja, setPuja] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [countdown, setCountdown] = useState({ days: 1, hours: 2, min: 0, secs: 26 });
  const [activeTab, setActiveTab] = useState('about');
  const [selectedPackage, setSelectedPackage] = useState(PACKAGES[0]);
  const [openFaq, setOpenFaq] = useState(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [autoSelectedSlot, setAutoSelectedSlot] = useState(null);
  const [bookingDate, setBookingDate] = useState(null);
  
  


  const sectionRefs = useRef({});
  const sectionNavRef = useRef(null);
  const stickyThresholdRef = useRef(null);

  const slides = puja?.bannerUrls?.map(img => img.url) || [];

  // Auto-fetch first available slot - searches today, then next days if needed
  const getFirstAvailableSlot = async () => {
    if (!puja?.id) return null;
    
    // Try up to 7 days to find available slots
    for (let daysAhead = 0; daysAhead < 7; daysAhead++) {
      const date = new Date();
      date.setDate(date.getDate() + daysAhead);
      const dateStr = date.toLocaleDateString('en-GB');
      
      try {
        console.log(`🔍 Trying date (${daysAhead} days ahead):`, dateStr);
        
        const response = await axiosInstance.post('/bookings/booking', {
          panditId: "6942677920c6344505bfb1c6",
          poojaId: puja.id,
          date: dateStr,
          slots: [],
          mode: "online",
          location: {
            lat: 17.3850,
            lng: 78.4867,
            address: puja.location || "Sri Mandir"
          }
        });
        
        console.log(`📡 Response for ${dateStr}:`, response.data);
        
        if (response.data.success && response.data.availableSlots?.length > 0) {
          const firstSlot = response.data.availableSlots[0];
          
          setAutoSelectedSlot(firstSlot);
          setBookingDate(dateStr);
          setPaymentError('');
          
          console.log(`✅ Found slot on ${dateStr}:`, firstSlot);
          
          return { slot: firstSlot, date: dateStr };
        } else {
          console.log(`⏳ No slots on ${dateStr}, trying next day...`);
        }
      } catch (error) {
        console.error(`❌ Error checking ${dateStr}:`, error.response?.data?.message);
      }
    }
    
    // If no slots found in 7 days
    console.warn('⚠️ No available slots in next 7 days');
    setPaymentError('❌ No slots available in the next 7 days. Please try again later or contact support.');
    return null;
  };

  const handleProceedPayment = async () => {
    // Debug: Check token
    const token = localStorage.getItem('token');
    console.log('🔑 Token in localStorage:', token ? `Exists (${token.length} chars)` : 'NOT FOUND');
    
    if (!token) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    if (!autoSelectedSlot) {
      alert('⚠️ No available slots found. Please try again later.');
      return;
    }

    setLoading(true);
    setPaymentError('');

    try {
      const bookingDateStr = bookingDate || new Date().toLocaleDateString('en-GB');

      const payload = {
        panditId: "6942677920c6344505bfb1c6",
        poojaId: puja.id,
        date: bookingDateStr,
        slots: [autoSelectedSlot],
        mode: "online",
        location: {
          lat: 17.3850,
          lng: 78.4867,
          address: puja.location || "Sri Mandir"
        }
      };

      console.log('🚀 PAYMENT PAYLOAD:', payload);
      console.log('🔑 Authorization header will use token:', token ? `${token.slice(0, 30)}...` : 'NONE');

      const response = await axiosInstance.post('/bookings/booking', payload);
      const { data } = response;

      console.log('✅ RAZORPAY ORDER CREATED:', data);

      if (data.success && data.razorpayOrderId) {
        console.log('🎯 Calling loadRazorpay...');
        loadRazorpay(data.razorpayOrderId, data.amount, selectedPackage);
      } else {
        setPaymentError(data.message || 'Booking failed');
        console.error('❌ Booking error:', data);
      }

    } catch (error) {
      const status = error.response?.status;
      const errorData = error.response?.data;
      const message = errorData?.message || error.message;
      
      console.error(`❌ Payment error (${status}):`, {
        status,
        message,
        fullResponse: errorData,
        errorStack: error.stack
      });
      
      if (status === 401) {
        alert('⚠️ Authentication failed. Please login again.');
        navigate('/login');
        localStorage.removeItem('token');
        return;
      }
      
      // if (status === 500) {
      //   alert(`❌ Server error: ${message}\n\nPlease check backend logs for details.`);
      // }
      
      setPaymentError(message);
    } finally {
      setLoading(false);
    }
  };






  // ⭐ RAZORPAY LOADER
  const loadRazorpay = (orderId, amount, packageInfo) => {
    console.log('💳 loadRazorpay called with:', { orderId, amount, packageName: packageInfo.name });
    
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_RpssxmMuyIDuJC',
      amount: amount * 100, // paise
      currency: 'INR',
      name: 'Sri Mandir Puja SHRI AAUM',
      description: `${puja.title} - ${packageInfo.name}`,
      order_id: orderId,
      image: window.location.origin + '/logo.png',
      handler: async function (response) {
        console.log('✅ Payment successful from Razorpay, response:', response);
        await verifyPayment(response);
      },
      prefill: {
        name: 'Devotee Name',
        email: 'devotee@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#f96b26'
      },
      modal: {
        ondismiss: function () {
          console.log('❌ User dismissed payment modal');
          alert('Payment cancelled');
        }
      }
    };

    console.log('🔧 Razorpay options:', options);
    const rzp = new window.Razorpay(options);
    console.log('🎯 Opening Razorpay modal...');
    rzp.open();
  };

  // ⭐ VERIFY PAYMENT (Webhook handles actual booking)
  const verifyPayment = async (response) => {
    console.log('🔐 verifyPayment called with response:', response);
    try {
      const verifyRes = await axiosInstance.post('/payment/verify', {
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature
      });

      const { data } = verifyRes;
      console.log('✅ Payment verification response:', data);

      if (data.success) {
        alert('✅ Puja booked successfully! Check My Bookings.');
        navigate('/my-bookings');
      } else {
        alert('Payment verified but booking failed. Contact support.');
      }
    } catch (error) {
      console.error('❌ Verification error:', error.response?.data || error.message);
      alert('Verification failed. Your payment is safe - contact support.');
    }
  };


  // ⭐ FIXED: Load puja data using ID from URL params
  useEffect(() => {
    const loadPuja = async () => {
      if (!id) {
        console.error('❌ No puja ID found in URL');
        return;
      }

      console.log('🔍 Loading puja with ID:', id);

      try {
        const pujaList = await fetchPujaList();
        const foundPuja = pujaList.find(puja => puja.id === id);

        if (foundPuja) {
          console.log('✅ Puja found:', foundPuja.title);
          setPuja(foundPuja);
          // Auto-select first package for this puja
          setSelectedPackage(PACKAGES[0]);
        } else {
          console.error('❌ Puja not found with ID:', id);
        }
      } catch (error) {
        console.error('❌ Error loading puja:', error);
      }
    };

    loadPuja();
  }, [id]); // 🔥 Re-run when ID changes!

  // Auto-fetch slot when puja loads
  useEffect(() => {
    if (puja?.id) {
      getFirstAvailableSlot();
    }
  }, [puja?.id]);

  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    const nav = sectionNavRef.current;
    if (nav) {
      const navTop = nav.getBoundingClientRect().top + window.scrollY;
      stickyThresholdRef.current = navTop - 82;
    }
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsNavSticky(true);
  };

  // Always start detail page from the top when navigated to
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
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
        if (stickyThresholdRef.current != null && window.scrollY < stickyThresholdRef.current) {
          setIsNavSticky(false);
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [puja, isNavSticky]);

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown((c) => {
        let { days, hours, min, secs } = c;
        secs--;
        if (secs < 0) {
          secs = 59;
          min--;
          if (min < 0) {
            min = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
              days = Math.max(0, days - 1);
            }
          }
        }
        return { days, hours, min, secs };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((i) => (i + 1) % (puja?.carouselImages?.length || 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [puja]);

  if (!puja) {
    return (
      <main className="puja-detail-page">
        <div className="pd-not-found">
          <p>Loading puja details... (ID: {id})</p>
          <button type="button" onClick={() => navigate('/puja')}>
            Back to Puja list
          </button>
        </div>
      </main>
    );
  }


  return (
    <main className="puja-detail-page">
      <div className="pd-container">
        <div className="pd-grid">
          {/* Left: Image carousel */}
          <div className="pd-carousel-wrap">
            <div className="pd-carousel-frame">
              <div className="pd-carousel-inner">
                {slides.map((imgUrl, i) => (
                  <div
                    key={i}
                    className={`pd-carousel-slide ${i === carouselIndex ? 'active' : ''}`}
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
              {/* <div className="pd-overlay-text">
                <span className="pd-overlay-large">{puja.promoText}</span>
              </div> */}
              <button type="button" className="pd-swipe-btn">
                SWIPE <span className="pd-swipe-arrow">→</span>
              </button>
              <div className="pd-carousel-dots">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={i === carouselIndex ? 'active' : ''}
                    onClick={() => setCarouselIndex(i)}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                className="pd-carousel-next"
                onClick={() => setCarouselIndex((i) => (i + 1) % slides.length)}
                aria-label="Next slide"
              >
                →
              </button>
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
            <p className="pd-countdown-label">Puja booking will close in:</p>
            <div className="pd-countdown">
              <div className="pd-countdown-item">
                <span className="pd-countdown-num">{countdown.days}</span>
                <span className="pd-countdown-label-sm">Day</span>
              </div>
              <div className="pd-countdown-item">
                <span className="pd-countdown-num">{countdown.hours}</span>
                <span className="pd-countdown-label-sm">Hours</span>
              </div>
              <div className="pd-countdown-item">
                <span className="pd-countdown-num">{countdown.min}</span>
                <span className="pd-countdown-label-sm">Min</span>
              </div>
              <div className="pd-countdown-item">
                <span className="pd-countdown-num">{countdown.secs}</span>
                <span className="pd-countdown-label-sm">Secs</span>
              </div>
            </div>
            <div className="pd-participants">
              <div className="pd-avatars">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="pd-avatar" />
                ))}
              </div>
              <span className="pd-rating">⭐ {puja.rating} ({puja.ratingCount} ratings)</span>
            </div>
            <p className="pd-devotees">
              Till now <strong>{puja.devoteesCount} Devotees</strong> have participated in Pujas conducted by Sri Mandir Puja SHRI AAUM.
            </p>
            <button type="button" className="pd-cta" onClick={() => scrollToSection('packages')}>
              Select puja package →
            </button>
          </div>
        </div>

        {/* Section tabs - below hero; fixed (sticky) when scrolled or when a section is selected */}
        <nav
          ref={sectionNavRef}
          className={`pd-section-nav ${isNavSticky ? 'pd-section-nav--fixed' : ''}`}
        >
          <div className="pd-section-nav-inner">
            {SECTION_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`pd-section-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => scrollToSection(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
        {isNavSticky && <div className="pd-section-nav-spacer" aria-hidden="true" />}

        {/* About Puja */}
        {/* About Puja - ⭐ DYNAMIC */}
        <section className="pd-section pd-about" ref={(el) => { sectionRefs.current.about = el; }}>
          <div className="pd-section-content">
            <div className="pd-about-inner">
              <span className="pd-about-icon">🪔</span>
              {/* ⭐ MAP: puja.title */}
              <h2 className="pd-about-heading">{puja.title}</h2>
            </div>
            <div className="pd-about-body">
              {/* ⭐ MAP: puja.promoText */}
              <div dangerouslySetInnerHTML={{ __html: puja.promoText || 'Loading description...' }} />
            </div>
          </div>
        </section>


        {/* Benefits */}
        {/* Benefits Section - DYNAMIC */}
        <section className="pd-section pd-benefits" ref={(el) => { sectionRefs.current.benefits = el; }}>
          <div className="pd-section-content">
            <h2 className="pd-section-title">Puja Benefits</h2>
            <div className="pd-benefits-grid">
              {/* ⭐ 1️⃣ FIRST: purpose field */}
              <div className="pd-benefit-card">
                <div className="pd-benefit-icon">✓</div>
                <h3 className="pd-benefit-title">{puja.purpose}</h3>  {/* ✅ "Family and Community Bonds" */}
                {/* <button type="button" className="pd-read-more">Read more</button> */}
              </div>

              {/* ⭐ 2️⃣ REST: benefits array (if exists) */}
              {puja.benefits?.map((benefit, i) => (
                <div key={i} className="pd-benefit-card">
                  <div className="pd-benefit-icon">✓</div>
                  <h3 className="pd-benefit-title">{benefit}</h3>
                  <button type="button" className="pd-read-more">Read more</button>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Process */}
        <section className="pd-section pd-process" ref={(el) => { sectionRefs.current.process = el; }}>
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

        {/* Temple Details + Packages */}
        {/* Temple Details - ⭐ DYNAMIC */}
        <section className="pd-section pd-temple" ref={(el) => { sectionRefs.current.temple = el; }}>
          <div className="pd-section-content">
            {/* ⭐ MAP: puja.location */}
            <h2 className="pd-temple-name">{puja.location}</h2>
            <div className="pd-temple-grid">
              <div className="pd-temple-image" />
              <div className="pd-temple-text">
                {/* ⭐ MAP: puja.templeDescription */}
                <div dangerouslySetInnerHTML={{ __html: puja.templeDescription || 'Temple details loading...' }} />
              </div>
            </div>
          </div>
        </section>


        <section className="pd-section pd-includes">
          <div className="pd-section-content">
            <h2 className="pd-section-title">All Puja Packages includes</h2>
            <ul className="pd-includes-list">
              {INCLUDES.map((item, i) => (
                <li key={i}><span className="pd-includes-check">✓</span> {item}</li>
              ))}
            </ul>
            <p className="pd-includes-note">Opt for additional offerings like Vastra Daan, Anna Daan, Deep Daan, or Gau SHRI AAUM in your name, available on the payments page.</p>
          </div>
        </section>

        {/* Package selection */}
        <section className="pd-section pd-packages" ref={(el) => { sectionRefs.current.packages = el; }}>
          <div className="pd-section-content">
            <h2 className="pd-section-title">Select your puja package</h2>
            <div className="pd-package-cards">
              {PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  className={`pd-package-card ${selectedPackage.id === pkg.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  {selectedPackage.id === pkg.id && <span className="pd-package-check">✓</span>}
                  <div className="pd-package-info">
                    <span className="pd-package-persons">{pkg.persons} Person{pkg.persons > 1 ? 's' : ''}</span>
                    <h3 className="pd-package-name">{pkg.name}</h3>
                    <span className="pd-package-price">₹{pkg.price}</span>
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
          <div className="pd-sticky-left">
            <span>🛡 No Hidden Cost</span>
            <span>🛡 ISO 27001 Certified Company</span>
            <span>🏛 Official Temple Partner</span>
          </div>
          <div className="pd-sticky-cta-wrap">
            {paymentError && (
              <div style={{ 
                marginBottom: '10px', 
                padding: '10px', 
                backgroundColor: '#ffebee', 
                color: '#d32f2f', 
                borderRadius: '4px',
                fontSize: '12px',
                textAlign: 'center'
              }}>
                {/* {paymentError} */}
              </div>
            )}
            <div className="pd-sticky-price-block">
              <span className="pd-sticky-price">₹{selectedPackage.price}</span>
              <span className="pd-sticky-name">{selectedPackage.name}</span>
            </div>
            <button
              type="button"
              className="pd-sticky-btn"
              onClick={handleProceedPayment}
              disabled={loading}
              title={autoSelectedSlot ? `Booking for slot: ${autoSelectedSlot.start} - ${autoSelectedSlot.end}` : 'Finding available slots...'}
            >
              {loading ? '⏳ Processing...' : 'Proceed to Payment →'}
            </button>
          </div>
        </div>

        {/* Reviews & Ratings */}
        <section className="pd-section pd-reviews-ratings" ref={(el) => { sectionRefs.current.reviews = el; }}>
          <div className="pd-section-content">
            <h2 className="pd-reviews-main-title">Reviews & Ratings</h2>
            <p className="pd-reviews-subtitle">Read what our beloved devotees have to say about Sri Mandir.</p>
            <div className="pd-testimonials-wrap">
              <div className="pd-testimonials-track" style={{ transform: `translateX(-${testimonialIndex * 100}%)` }}>
                {TESTIMONIALS.map((t, i) => (
                  <div key={i} className="pd-testimonial-card">
                    {t.type === 'video' ? (
                      <div className="pd-testimonial-video">
                        <div className="pd-video-placeholder">▶ 0:00 / 1:00</div>
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
                  <button key={i} type="button" className={i === testimonialIndex ? 'active' : ''} onClick={() => setTestimonialIndex(i)} aria-label={`Testimonial ${i + 1}`} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* User Reviews */}
        <section className="pd-section pd-user-reviews">
          <div className="pd-section-content">
            <h2 className="pd-section-title">User Reviews</h2>
            <p className="pd-user-reviews-sub">Reviews from our devotees who booked Puja with us</p>
            <ul className="pd-user-reviews-list">
              {USER_REVIEWS.map((r, i) => (
                <li key={i} className="pd-user-review-item">
                  <div className="pd-user-review-avatar" />
                  <div className="pd-user-review-content">
                    <div className="pd-user-review-meta">
                      <strong>{r.name}</strong>
                      <span>{r.date}</span>
                    </div>
                    <div className="pd-user-review-stars">{'★'.repeat(r.stars)}</div>
                    <p>{r.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button type="button" className="pd-view-more">View More</button>
          </div>
        </section>

        {/* FAQs */}
        <section className="pd-section pd-faqs" ref={(el) => { sectionRefs.current.faqs = el; }}>
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
                    <span className="pd-faq-chevron">{openFaq === i ? '▲' : '▼'}</span>
                  </button>
                  {openFaq === i && <div className="pd-faq-answer">{item.a}</div>}
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
