import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../lib/instance';
import { normalizeApiSoldTag, isPujaUserSoldOut } from '../../data/pujaList';
import './ChadhavaDetail.css';
import Footer from '../Footer/Footer';

const FAQS = [
  {
    question: 'What is Chadhava and how does it benefit devotees?',
    answer:
      'Chadhava is a sacred offering made with devotion at the temple during puja. It helps devotees express sankalp, seek blessings, and spiritually participate in temple rituals even if they are not physically present.',
  },
  {
    question: 'Can I offer multiple Chadhava items in a single booking?',
    answer:
      'Yes. You can select multiple offering items and quantities in one booking. Your total amount is calculated automatically before payment.',
  },
  {
    question: 'How will I know that my Chadhava has been offered?',
    answer:
      'After successful booking, your order is recorded in your account. You can track status updates from your booking details and contact support if you need confirmation.',
  },
  {
    question: 'Can I book Chadhava for a specific date or occasion?',
    answer:
      'Yes. If a specific event date is available for the selected Chadhava, your offering is scheduled accordingly. Please book before the event cut-off time for timely inclusion.',
  },
  {
    question: 'Can I book Chadhava on behalf of my family members?',
    answer:
      'Yes, you can book on behalf of family members or loved ones. Please make sure the sankalp details shared during booking are correct.',
  },
  {
    question: 'What happens if I miss the event date after booking?',
    answer:
      'If your payment is successful before the cut-off, your Chadhava is usually processed for that event. For edge cases or delays, please connect with support to verify the final status.',
  },
  {
    question: 'Whom should I contact for Chadhava booking support?',
    answer:
      'For any issue related to booking, payment, or status, please use the contact options available in the app/site support section. Our team will assist you promptly.',
  },
];

const SECTION_TABS = [
  { id: 'packages', label: 'Packages' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'temple', label: 'Temple Details' },
  { id: 'faqs', label: 'FAQs' },
];

function ChadhavaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [offerings, setOfferings] = useState([]);
  const [activeTab, setActiveTab] = useState('packages');
  const [isNavSticky, setIsNavSticky] = useState(false);
  const aboutTextRef = useRef(null);
  const sectionRefs = useRef({});
  const sectionNavRef = useRef(null);
  const stickyThresholdRef = useRef(null);
  const collapsedLines = 4;
  const [aboutVisibleLines, setAboutVisibleLines] = useState(collapsedLines);
  const [aboutHasOverflow, setAboutHasOverflow] = useState(false);

  const formatEventDate = (value) => {
    if (!value) return 'Date will be announced';
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
    return String(value);
  };

  /** Same as `Chadhava.js` / `pujaList.js`: admin `soldTag` + event date. */
  const { isBookingBlocked } = useMemo(() => {
    if (!detail) return { isBookingBlocked: false };
    const raw = detail.eventdate || detail.eventDate || detail.dateRange;
    let eventDateRaw = 0;
    if (raw) {
      const d = new Date(raw);
      eventDateRaw = Number.isNaN(d.getTime()) ? 0 : d.getTime();
    }
    const soldTagPolicy = normalizeApiSoldTag(detail.soldTag ?? detail.soldTagPolicy);
    const ctx = { eventDateRaw, soldTagPolicy };
    return { isBookingBlocked: isPujaUserSoldOut(ctx) };
  }, [detail]);

  const normalizedBenefits = useMemo(() => {
    const raw = detail?.benefits;
    if (!Array.isArray(raw)) return [];
    return raw
      .map((item) => {
        if (!item || typeof item !== 'object') return null;
        const title = String(item.title || '').trim();
        const subtitle = String(item.subtitle || '').trim();
        if (!title && !subtitle) return null;
        return { title, subtitle };
      })
      .filter(Boolean);
  }, [detail]);

  const templeName = detail?.templeName || 'Shri Aaum Temple';
  const templeDescription = detail?.templeDescription || '';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    document.body.classList.add('hide-whatsapp-fab');
    return () => {
      document.body.classList.remove('hide-whatsapp-fab');
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const getDetail = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/chadhava/${encodeURIComponent(id)}`);
        const item = res?.data?.item || res?.data?.data?.item || res?.data?.data || res?.data;
        if (!mounted) return;
        if (!item || typeof item !== 'object') {
          setDetail(null);
          setOfferings([]);
          return;
        }
        setDetail(item);
        setOfferings(Array.isArray(item.offerings) ? item.offerings : []);
      } catch (e) {
        if (!mounted) return;
        setDetail(null);
        setOfferings([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (id) getDetail();
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    setAboutVisibleLines(collapsedLines);
  }, [detail]);

  useEffect(() => {
    if (!aboutTextRef.current) {
      setAboutHasOverflow(false);
      return;
    }
    const el = aboutTextRef.current;
    setAboutHasOverflow(el.scrollHeight - el.clientHeight > 2);
  }, [detail, aboutVisibleLines]);

  useEffect(() => {
    if (isBookingBlocked) setCart({});
  }, [isBookingBlocked]);

  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    const nav = sectionNavRef.current;
    if (nav) {
      const navTop = nav.getBoundingClientRect().top + window.scrollY;
      stickyThresholdRef.current = navTop - 82;
    }
    sectionRefs.current[sectionId]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    setIsNavSticky(true);
  };

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
      } else if (
        stickyThresholdRef.current != null &&
        window.scrollY < stickyThresholdRef.current
      ) {
        setIsNavSticky(false);
      }

      const sectionOrder = SECTION_TABS.map((t) => t.id);
      let current = activeTab;
      for (const idKey of sectionOrder) {
        const el = sectionRefs.current[idKey];
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= 160) current = idKey;
      }
      if (current !== activeTab) setActiveTab(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [activeTab, isNavSticky]);

  const updateCart = (offeringId, change) => {
    if (isBookingBlocked) return;
    setCart(prev => {
      const currentCount = prev[offeringId] || 0;
      const newCount = Math.max(0, currentCount + change);
      
      if (newCount === 0) {
        const newCart = { ...prev };
        delete newCart[offeringId];
        return newCart;
      }
      
      return {
        ...prev,
        [offeringId]: newCount
      };
    });
  };

  const getTotalItems = () => Object.values(cart).reduce((sum, count) => sum + count, 0);
  const getTotalPrice = () => 
    Object.entries(cart).reduce((total, [offeringId, count]) => {
      const offering = offerings.find((o, i) => String(o._id || o.id || i) === String(offeringId));
      return total + ((Number(offering?.price) || 0) * count || 0);
    }, 0);

  const handleBuyNow = () => {
    if (isBookingBlocked) return;
    const selectedOfferings = Object.entries(cart)
      .filter(([_, qty]) => qty > 0)
      .map(([offeringId, qty]) => {
        const offering = offerings.find((o, i) => String(o._id || o.id || i) === String(offeringId));
        if (!offering) return null;
        const price = Number(offering.price || 0);
        return {
          id: offering._id || offering.id || offeringId,
          name: offering.title || 'Offering',
          price,
          quantity: qty,
          total: price * qty,
        };
      })
      .filter(Boolean);

    const total = selectedOfferings.reduce((sum, item) => sum + item.total, 0);

    const billingState = {
      puja: {
        id: detail?._id || detail?.id || id,
        title: detail?.title || 'Chadhava',
        date: formatEventDate(detail?.eventdate || detail?.eventDate || detail?.dateRange),
      },
      selectedChadhava: {
        id: detail?._id || detail?.id || id,
        title: detail?.title || 'Chadhava',
        date: formatEventDate(detail?.eventdate || detail?.eventDate || detail?.dateRange),
        bannerImage: detail?.bannerImage || null,
        description: detail?.description || '',
      },
      image: detail?.bannerImage || null,
      selectedPackage: {
        id: 'chadhava-offerings',
        name: detail?.title || 'Chadhava',
        price: total,
      },
      addons: selectedOfferings,
      addonsTotal: 0,
      grandTotal: total,
      mode: 'chadhava',
    };

    console.log('Chadhava -> Billing fields being passed:', billingState);

    navigate('/billing', {
      state: billingState,
    });
  };

  if (loading) {
    return (
      <main className="chd-page">
        <div className="chd-not-found">
          <p>Loading chadhava details...</p>
        </div>
      </main>
    );
  }

  if (!detail) {
    return (
      <main className="chd-page">
        <div className="chd-not-found">
          <p>Chadhava not found.</p>
          <button type="button" onClick={() => navigate('/chadhava')}>
            Back to Chadhava list
          </button>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="chd-page">
        <div className="chd-container">
          {/* Hero: banner + text */}
          <section className="chd-hero">
            <div className="chd-hero-grid">
              <div className="chd-hero-wrap">
                <div className="chd-hero-banner">
                  <div className="chd-hero-inner">
                    {detail.bannerImage ? (
                      <img
                        src={detail.bannerImage}
                        alt={detail.title || 'Chadhava'}
                        className="chd-hero-image"
                      />
                    ) : (
                      <div className="chd-hero-image chd-hero-image-fallback" />
                    )}
                    {isBookingBlocked ? (
                      <span className="chd-sold-out-tag">SOLD OUT</span>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="chd-hero-text">
                <div className="chd-details-header">
                  <h1 className="chd-title">{detail.title}</h1>
                  <p className="chd-subtitle">
                    {detail.subtitle || 'Offer this sacred chadhava for divine blessings.'}
                  </p>
                  <p className="chd-meta">
                    <span className="chd-meta-icon">🏛</span>
                    {templeName}
                  </p>
                  <p className="chd-meta">
                    <span className="chd-meta-icon">📅</span>
                    {formatEventDate(detail.eventdate || detail.eventDate || detail.dateRange)}
                  </p>
                </div>
                {detail?.description ? (
                  <div className="chd-details-about">
                    <p
                      className="chd-details-about-text"
                      style={{
                        WebkitLineClamp: aboutVisibleLines,
                        lineClamp: aboutVisibleLines,
                      }}
                      ref={aboutTextRef}
                    >
                      {detail.description}
                    </p>
                    <div className="chd-details-about-actions">
                      {aboutVisibleLines <= collapsedLines && aboutHasOverflow ? (
                        <button
                          type="button"
                          className="chd-read-more-btn"
                          onClick={() => setAboutVisibleLines(999)}
                        >
                          Read more
                        </button>
                      ) : null}
                      {aboutVisibleLines > collapsedLines ? (
                        <button
                          type="button"
                          className="chd-read-more-btn chd-read-less"
                          onClick={() => setAboutVisibleLines(collapsedLines)}
                        >
                          Read less
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                <p className="chd-devotees">
                  Till now <strong>{detail.devoteesCount || 'many'} Devotees</strong> have participated in
                  Chadhava.
                </p>
              </div>
            </div>
          </section>

          <nav
            ref={sectionNavRef}
            className={`chd-section-nav ${isNavSticky ? 'chd-section-nav--fixed' : ''}`}
          >
            <div className="chd-section-nav-inner">
              {SECTION_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`chd-section-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => scrollToSection(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>
          {isNavSticky ? <div className="chd-section-nav-spacer" aria-hidden="true" /> : null}

          {/* Offerings list */}
          <section
            className="chd-offerings chd-section"
            id="packages"
            ref={(el) => {
              sectionRefs.current.packages = el;
            }}
          >
            <h2 className="chd-section-title">Choose an offering</h2>
            {isBookingBlocked ? (
              <p className="chd-booking-closed-banner" role="status">
                <strong>Booking closed.</strong> This chadhava is not available for booking.
              </p>
            ) : null}
            <div className="chd-offering-list">
              {offerings.map((offering, index) => {
                const offeringId = offering._id || offering.id || index;
                const count = cart[offeringId] || 0;
                return (
                  <div key={offeringId} className="chd-offering-row">
                    <div className="chd-offering-main">
                      <p className="chd-offering-label">{offering.special ? 'Special Offering' : 'Offering'}</p>
                      <h3 className="chd-offering-title">{offering.title}</h3>
                      {offering.description && <p className="chd-offering-meta">{offering.description}</p>}
                      <p className="chd-offering-price">₹{Number(offering.price || 0).toLocaleString('en-IN')}</p>
                     
                     
                    </div>
                    <div className="chd-offering-side">
                      <div
                        className="chd-offering-thumb"
                        style={offering.image ? { backgroundImage: `url(${offering.image})` } : undefined}
                      />
                      <div className="chd-offering-controls">
                        {count > 0 ? (
                          <div className="chd-quantity-controls">
                            <button 
                              type="button"
                              className="chd-qty-btn chd-qty-minus"
                              disabled={isBookingBlocked}
                              onClick={() => updateCart(offeringId, -1)}
                            >
                              -
                            </button>
                            <span className="chd-qty-display">{count}</span>
                            <button 
                              type="button"
                              className="chd-qty-btn chd-qty-plus"
                              disabled={isBookingBlocked}
                              onClick={() => updateCart(offeringId, 1)}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button 
                            type="button" 
                            className="chd-offering-add"
                            disabled={isBookingBlocked}
                            onClick={() => updateCart(offeringId, 1)}
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {offerings.length === 0 && (
              <p className="chd-faq-answer">No offerings available for this chadhava yet.</p>
            )}
          </section>

          <section
            className="chd-temple-benefits chd-section"
            id="benefits"
            ref={(el) => {
              sectionRefs.current.benefits = el;
            }}
          >
            <h2 className="chd-section-title">Benefits</h2>
            {normalizedBenefits.length > 0 ? (
              <ul className="chd-benefits-grid">
                {normalizedBenefits.map((benefit, idx) => (
                  <li key={`${benefit.title}-${idx}`} className="chd-benefit-item">
                    <div className="chd-benefit-icon">✓</div>
                    <p className="chd-benefit-title">{benefit.title}</p>
                    {benefit.subtitle ? (
                      <p className="chd-benefit-subtitle">{benefit.subtitle}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="chd-empty-block">Benefits will be announced soon.</p>
            )}
          </section>

          <section
            className="chd-temple-benefits chd-section"
            id="temple"
            ref={(el) => {
              sectionRefs.current.temple = el;
            }}
          >
            <h2 className="chd-section-title">Temple Details</h2>
            {templeDescription ? (
              <div className="chd-temple-block">
                <h3 className="chd-temple-name">{templeName}</h3>
                <div
                  className="chd-temple-text"
                  dangerouslySetInnerHTML={{ __html: templeDescription }}
                />
              </div>
            ) : (
              <p className="chd-empty-block">Temple details will be updated soon.</p>
            )}
          </section>

          {/* FAQs */}
          <section
            className="chd-faqs chd-section"
            id="faqs"
            ref={(el) => {
              sectionRefs.current.faqs = el;
            }}
          >
            <h2 className="chd-section-title">Frequently asked Questions</h2>
            <ul className="chd-faq-list">
              {FAQS.map((faq, index) => (
                <li key={faq.question} className="chd-faq-item">
                  <button
                    type="button"
                    className="chd-faq-question"
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  >
                    {faq.question}
                    <span className="chd-faq-chevron">
                      {activeFaq === index ? '▲' : '▼'}
                    </span>
                  </button>
                  {activeFaq === index && (
                    <p className="chd-faq-answer">
                      {faq.answer}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
        <Footer />
      </main>

      {/* Fixed Cart Button */}
      {!isBookingBlocked && getTotalItems() > 0 && (
        <div className="chd-cart-button">
          <div className="chd-cart-info">
            <span className="chd-cart-items">{getTotalItems()} items</span>
            <span className="chd-cart-total">₹{getTotalPrice().toLocaleString()}</span>
          </div>
          <button type="button" className="chd-cart-cta" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      )}
    </>
  );
}

export default ChadhavaDetail;
