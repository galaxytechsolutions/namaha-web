import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../lib/instance';
import { PUJA_LIST_GRID_COLUMNS } from '../../data/pujaList';
import './Chadhava.css';
import Footer from '../Footer/Footer';

const getItemsFromResponse = (data) => {
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data?.items)) return data.data.items;
  if (Array.isArray(data?.result?.items)) return data.result.items;
  if (Array.isArray(data)) return data;
  return [];
};

const normalizeCard = (item = {}) => {
  const rawId = item.id || item._id || item.shortTitle || item.slug || item.title;
  const idOrShortTitle = item.id || item._id || item.shortTitle || item.slug;
  return {
    id: String(rawId || Math.random()),
    idOrShortTitle,
    title: item.title || 'Untitled Chadhava',
    eventdate: item.eventdate || item.eventDate || item.dateText || 'Date will be announced',
    description: item.description || 'Details will be updated soon.',
    bannerImage: item.bannerImage || item.image || item.thumbnail || '',
    buttonText: item.buttonText || item.ctaText || 'View Details',
  };
};

function Chadhava() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCards, setExpandedCards] = useState({});
  const offeringsRef = useRef(null);

  /* Banner sizing lives in `Chadhava.css` — mirrors `PujaList.css` `.pl-card-banner` */

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

  useEffect(() => {
    let mounted = true;

    const loadChadhavaCards = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axiosInstance.get('/chadhava');
        console.log('Chadhava API response (/chadhava):', res?.data);
        const items = getItemsFromResponse(res?.data);
        if (!mounted) return;
        const mapped = items
          .map(normalizeCard)
          .filter((card) => card.idOrShortTitle || card.id);
        setCards(mapped);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || 'Unable to load Chadhava offerings right now.');
        setCards([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadChadhavaCards();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="chadhava-page">
      {/* Hero */}
      <section className="ch-hero">
        <div className="ch-hero-inner">
          <div className="ch-hero-content">
            <h1 className="ch-hero-title">
              Offer Chadhava as per Vedic rituals at sacred Hindu Pilgrimages and Temples in India
              through SHRI AAUM from anywhere in the world!
            </h1>
            <ul className="ch-hero-points">
              <li>Divine Blessings through Chadhava.</li>
              <li>Vedic Rituals Performed by Purohit ji.</li>
              <li>Offer Chadhava from Anywhere.</li>
              <li>Receive Chadhava Video in 2–3 days.</li>
            </ul>
            <div className="ch-hero-actions">
              <button
                type="button"
                className="ch-btn ch-btn-primary"
                onClick={() => offeringsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                View Now
              </button>
            </div>
          </div>
          <div className="ch-hero-illustration">
            <img
              src="/images/chad1.webp"
              alt="Handcrafted Ganesha idol with modaks and flowers representing traditional Hindu Chadhava offerings"
              className="ch-hero-image"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      {/* Upcoming Chadhava offerings */}
      <section className="ch-offerings" ref={offeringsRef}>
        <div className="ch-offerings-header">
          <h2 className="ch-offerings-title">Upcoming Chadhava Offerings on SHRI AAUM.</h2>
          <p className="ch-offerings-subtitle">
            Experience the divine with Shri aaum Chadhava SHRI AAUM. Offer Chadhava at renowned
            temples across India, receiving blessings and a video recording of the ceremony
            performed by our Purohit ji on your behalf.
          </p>
        </div>

        {loading ? (
          <div
            className="ch-card-grid"
            style={{ '--ch-grid-cols': String(PUJA_LIST_GRID_COLUMNS) }}
          >
            {[1, 2, 3].map((n) => (
              <article key={n} className="ch-card">
                <div className="ch-card-banner" />
                <div className="ch-card-body">
                  <h3 className="ch-card-title">Loading...</h3>
                  <p className="ch-card-date">Please wait</p>
                  <p className="ch-card-text">Fetching latest chadhava offerings.</p>
                </div>
              </article>
            ))}
          </div>
        ) : error ? (
          <p className="ch-offerings-subtitle">{error}</p>
        ) : cards.length === 0 ? (
          <p className="ch-offerings-subtitle">No chadhava offerings available currently.</p>
        ) : (
          <div
            className={`ch-card-grid${cards.length === 1 ? ' ch-card-grid--single' : ''}`}
            style={{ '--ch-grid-cols': String(PUJA_LIST_GRID_COLUMNS) }}
          >
            {cards.map((card) => (
              <article key={card.id} className="ch-card">
                <div
                  className="ch-card-banner"
                  style={
                    card.bannerImage
                      ? {
                          backgroundImage: `url(${card.bannerImage})`,
                          backgroundColor: '#000',
                        }
                      : undefined
                  }
                />
                <div className="ch-card-body">
                  <h3 className="ch-card-title">{card.title}</h3>
                  <p className="ch-card-date">{formatEventDate(card.eventdate)}</p>
                  <p className={`ch-card-text ${expandedCards[card.id] ? 'is-expanded' : ''}`}>
                    {card.description}
                  </p>
                  {card.description && card.description.length > 140 && (
                    <button
                      type="button"
                      className="ch-card-readmore"
                      onClick={() =>
                        setExpandedCards((prev) => ({
                          ...prev,
                          [card.id]: !prev[card.id],
                        }))
                      }
                    >
                      {expandedCards[card.id] ? 'Read less' : 'Read more'}
                    </button>
                  )}
                  <Link to={`/chadhava/${encodeURIComponent(card.idOrShortTitle || card.id)}`} className="ch-card-cta">
                    {card.buttonText}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}

export default Chadhava;

