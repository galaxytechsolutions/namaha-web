import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../lib/instance';
import { PUJA_LIST_GRID_COLUMNS } from '../../data/pujaList';
import './Chadhava.css';
import Footer from '../Footer/Footer';

const INITIAL_VISIBLE_CARDS = 4;
const LOAD_MORE_STEP = 4;

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
  const rawDate = item.eventdate || item.eventDate || item.dateText || item.dateRange;
  const ev = rawDate ? new Date(rawDate) : null;
  const eventDateRaw =
    ev && !Number.isNaN(ev.getTime()) ? ev.getTime() : 0;
  return {
    id: String(rawId || Math.random()),
    idOrShortTitle,
    title: item.title || 'Untitled Chadhava',
    eventdate: rawDate || 'Date will be announced',
    eventDateRaw,
    description: item.description || 'Details will be updated soon.',
    bannerImage: item.bannerImage || item.image || item.thumbnail || '',
    buttonText: item.buttonText || item.ctaText || 'View Details',
  };
};

/** Same ordering as Puja list: upcoming events first, then past events by recency (all remain bookable in UI). */
const sortChadhavaByAvailabilityThenDate = (a, b) => {
  const now = Date.now();
  const dateA = Number(a?.eventDateRaw || 0);
  const dateB = Number(b?.eventDateRaw || 0);
  const isPastA = dateA > 0 && dateA <= now;
  const isPastB = dateB > 0 && dateB <= now;
  if (isPastA !== isPastB) return isPastA ? 1 : -1;
  if (!isPastA && !isPastB && dateA !== dateB) return dateA - dateB;
  if (isPastA && isPastB && dateA !== dateB) return dateB - dateA;
  return 0;
};

function Chadhava() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCards, setExpandedCards] = useState({});
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_CARDS);
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
        const sorted = [...mapped].sort(sortChadhavaByAvailabilityThenDate);
        setCards(sorted);
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

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_CARDS);
  }, [cards.length]);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop || 0;
      const viewportHeight = window.innerHeight || 0;
      const fullHeight = document.documentElement.scrollHeight || 0;
      const firstCard = document.querySelector('.ch-card');
      const cardHeight = firstCard?.getBoundingClientRect?.().height || 400;
      const halfCardHeightThreshold = cardHeight / 2;
      const nearBottom =
        scrollTop + viewportHeight >= fullHeight - halfCardHeightThreshold;

      if (!nearBottom) return;
      setVisibleCount((prev) => Math.min(prev + LOAD_MORE_STEP, cards.length));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [cards.length]);

  const visibleCards = cards.slice(0, visibleCount);

  return (
    <main className="chadhava-page">
      {/* Hero */}
      <section className="ch-hero">
        <div className="ch-hero-inner">
          <div className="ch-hero-content">
            <h1 className="ch-hero-title">
              Offer Chadhava as per Vedic rituals at sacred Hindu Pilgrimages and Temples in India
            </h1>
          </div>
        </div>
      </section>

      {/* Upcoming Chadhava offerings */}
      <section className="ch-offerings" ref={offeringsRef}>
        <div className="ch-offerings-header">
          <h2 className="ch-offerings-title">
            Upcoming Chadhava Offerings ({cards.length})
          </h2>
          {/* <p className="ch-offerings-subtitle">
            Experience the divine with Shri aaum Chadhava SHRI AAUM. Offer Chadhava at renowned
            temples across India, receiving blessings and a video recording of the ceremony
            performed by our Purohit ji on your behalf.
          </p> */}
        </div>

        {loading ? (
          <div className="ch-loading-state" role="status" aria-live="polite">
            <div className="ch-loading-spinner" aria-hidden="true" />
            <p className="ch-loading-text">Loading chadhava offerings...</p>
          </div>
        ) : error ? (
          <p className="ch-offerings-subtitle">{error}</p>
        ) : cards.length === 0 ? (
          <p className="ch-offerings-subtitle">No chadhava offerings available currently.</p>
        ) : (
          <div
            className={`ch-card-grid${visibleCards.length === 1 ? ' ch-card-grid--single' : ''}`}
            style={{ '--ch-grid-cols': String(PUJA_LIST_GRID_COLUMNS) }}
          >
            {visibleCards.map((card) => (
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
                  <Link
                    to={`/chadhava/${encodeURIComponent(card.idOrShortTitle || card.id)}`}
                    className="ch-card-cta"
                  >
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

