import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ChadhavaDetail.css';
import Footer from '../Footer/Footer';

const CHADHAVA_DETAILS = {
  1: {
    id: 1,
    title: 'Maha Shivratri Pashupatinath "Gana-Tirpti" Pashu Seva Maha Sankalp',
    subtitle:
      "Win the Heart of Mahadev! According to scriptures, Shiva is 'Pashupatinath' (Lord of Animals). Before reaching the Shivling in the inner sanctum, one must first seek permission from Shiva's Ganas.",
    dateRange: '9 February to 15 February, 2026',
    heroImageClass: 'cd-hero-1',
    devoteesCount: '1,50,000+',
  },
  2: {
    id: 2,
    title: 'Mahashivratri: 4 Prahars, 4 Jyotirlingas Maha Abhishek Sankalp',
    subtitle:
      'On the sacred night of Mahashivratri, each Jyotirlinga performs special Abhishek in every prahar so that devotees may receive the supreme blessings of Mahadev.',
    dateRange: '16 February 2026, Sunday, Phalguna Krishna Trayodashi',
    heroImageClass: 'cd-hero-2',
    devoteesCount: '75,000+',
  },
  3: {
    id: 3,
    title: 'Triyuginarayan Shiva–Parvati Vivah Mahotsav Chadhava Sankalp',
    subtitle:
      'Celebrate the divine union of Shiva–Shakti at the sacred Triyuginarayan Temple where their celestial marriage took place.',
    dateRange: '15 February 2026, Sunday, Phalguna Krishna Trayodashi',
    heroImageClass: 'cd-hero-3',
    devoteesCount: '50,000+',
  },
};

const OFFERINGS = [
  {
    id: 1,
    label: 'Special Combo Chadhava',
    title: 'Contribution to Bhairav-Gan (Vahan) Shwaan Seva (Kalashatmi)',
    meta1:
      'Milk (Bhatuk Bhairav) • Kalashtami Monday Shwaan Seva Shri Batuk Bhairav Temple • 9 February, Monday',
    meta2:
      'Roti (Bhatuk Bhairav) • Kalashtami Monday Shwaan Seva Shri Batuk Bhairav Temple • 9 February, Monday',
    price: 91,
    priceDisplay: '₹91',
  },
  {
    id: 2,
    label: 'Special Combo Chadhava',
    title: 'Contribution to Ekadashi Complete Gau Mata Seva',
    meta1:
      '1-Cow-hara-chara-sukha-chara (Shri dham gaushala) • Ekadashi Thursday Gau Seva Shri Dham Gaushala • 13 February, Friday',
    meta2:
      '1-Cow-Roti (Shri dham gaushala) • Ekadashi Thursday Gau Seva Shri Dham Gaushala • 13 February, Friday',
    price: 161,
    priceDisplay: '₹161',
  },
  {
    id: 3,
    label: 'Special Combo Chadhava',
    title: "Contribution to Ultimate 'Gan-Tript' Pashupatinath Mahaseva",
    meta1:
      'Pavroti-Milk (Bhatuk Bhairav) • Kalashtami Monday Shwaan Seva Shri Batuk Bhairav Temple • 9 February, Monday',
    meta2:
      '1-Cow-Roti (Shri dham gaushala) • Ekadashi Thursday Gau Seva Shri Dham Gaushala • 13 February, Friday',
    price: 343,
    priceDisplay: '₹343',
  },
];

const FAQS = [
  'What is Mahaseva?',
  'Will I receive a certificate after booking the service?',
  'How can I check the status of my service?',
  'Can I choose multiple services?',
  'Who should I contact if there is an issue with my Service?',
  'How does it work?',
  'Do I get an 80G certificate?',
];

function ChadhavaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [cart, setCart] = useState({});

  const detail = CHADHAVA_DETAILS[Number(id)];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const updateCart = (offeringId, change) => {
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
      const offering = OFFERINGS.find(o => o.id === Number(offeringId));
      return total + (offering?.price * count || 0);
    }, 0);

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
              <div className="chd-hero-banner">
                <div className={`chd-hero-image ${detail.heroImageClass}`} />
                <div className="chd-hero-dots">
                  {[0, 1, 2, 3, 4].map((dot) => (
                    <span
                      key={dot}
                      className={`chd-dot ${dot === 1 ? 'active' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div className="chd-hero-text">
                <h1 className="chd-title">{detail.title}</h1>
                <p className="chd-subtitle">
                  🕉 {detail.subtitle}
                </p>
                <p className="chd-date">{detail.dateRange}</p>
                <p className="chd-devotees">
                  Till now <strong>{detail.devoteesCount} Devotees</strong> have participated in
                  Chadhava conducted by Sri Mandir Chadhava Seva.
                </p>
              </div>
            </div>
          </section>

          {/* Offerings list */}
          <section className="chd-offerings">
            <h2 className="chd-section-title">Choose an offering</h2>
            <div className="chd-offering-list">
              {OFFERINGS.map((offering) => {
                const count = cart[offering.id] || 0;
                return (
                  <div key={offering.id} className="chd-offering-row">
                    <div className="chd-offering-main">
                      <p className="chd-offering-label">{offering.label}</p>
                      <h3 className="chd-offering-title">{offering.title}</h3>
                      <p className="chd-offering-meta">{offering.meta1}</p>
                      <p className="chd-offering-meta">{offering.meta2}</p>
                      <p className="chd-offering-price">{offering.priceDisplay}</p>
                     
                     
                    </div>
                    <div className="chd-offering-side">
                      <div className="chd-offering-thumb" />
                      <div className="chd-offering-controls">
                        {count > 0 ? (
                          <div className="chd-quantity-controls">
                            <button 
                              type="button"
                              className="chd-qty-btn chd-qty-minus"
                              onClick={() => updateCart(offering.id, -1)}
                            >
                              -
                            </button>
                            <span className="chd-qty-display">{count}</span>
                            <button 
                              type="button"
                              className="chd-qty-btn chd-qty-plus"
                              onClick={() => updateCart(offering.id, 1)}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button 
                            type="button" 
                            className="chd-offering-add"
                            onClick={() => updateCart(offering.id, 1)}
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
          </section>

          {/* FAQs */}
          <section className="chd-faqs">
            <h2 className="chd-section-title">Frequently asked Questions</h2>
            <ul className="chd-faq-list">
              {FAQS.map((q, index) => (
                <li key={q} className="chd-faq-item">
                  <button
                    type="button"
                    className="chd-faq-question"
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  >
                    {q}
                    <span className="chd-faq-chevron">
                      {activeFaq === index ? '▲' : '▼'}
                    </span>
                  </button>
                  {activeFaq === index && (
                    <p className="chd-faq-answer">
                      Detailed information for this question will be provided here based on your
                      backend content.
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
      {getTotalItems() > 0 && (
        <div className="chd-cart-button">
          <div className="chd-cart-info">
            <span className="chd-cart-items">{getTotalItems()} items</span>
            <span className="chd-cart-total">₹{getTotalPrice().toLocaleString()}</span>
          </div>
          <button className="chd-cart-cta">View Cart</button>
        </div>
      )}
    </>
  );
}

export default ChadhavaDetail;
