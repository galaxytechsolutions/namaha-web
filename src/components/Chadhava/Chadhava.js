import React from 'react';
import { Link } from 'react-router-dom';
import StatsEventUi from '../StatsEventUi/StatsEventUi';
import './Chadhava.css';
import Footer from '../Footer/Footer';

const CHADHAVA_CARDS = [
  {
    id: 1,
    title: 'Pashupatinath “Gana-Tirpti” Pashu Seva',
    date: '9 February to 15 February, 2026',
    description:
      'From Kalashtami till Maha Shivratri, the purohit ji will perform Gana-Tirpti Seva on your name at the respective site on the specific tithi. The video of the seva will be shared on the Sri Mandir app in 24–48 hours of offering.',
    cta: 'Perform Pashu Seva →',
  },
  {
    id: 2,
    title: 'Mahashivratri: 4 Prahars, 4 Jyotirlingas Maha Abhishek',
    date: '16 February 2026, Sunday, Phalguna Krishna Trayodashi',
    description:
      'On the sacred night of Maha Shivratri, each Jyotirlinga will perform the special Abhishek in your name during every prahar. Video proof of each prahar Abhishek will be shared within 24–48 hours.',
    cta: 'Perform 4 Prahar Mahabhishek →',
  },
  {
    id: 3,
    title: 'Triyuginarayan Shiva–Parvati Vivah Mahotsav Path',
    date: '15 February 2026, Sunday, Phalguna Krishna Trayodashi',
    description:
      'Celebrate the divine union of Shiva–Shakti at the very site of their marriage. The path and rituals will be performed in your name at Triyuginarayan Temple and shared on the Sri Mandir app in 24–48 hours.',
    cta: 'Book Vivah Path →',
  },
];

function Chadhava() {
  return (
    <main className="chadhava-page">
      {/* Hero */}
      <section className="ch-hero">
        <div className="ch-hero-inner">
          <div className="ch-hero-content">
            <h1 className="ch-hero-title">
              Offer Chadhava as per Vedic rituals at sacred Hindu Pilgrimages and Temples in India
              through Sri Mandir from anywhere in the world!
            </h1>
            <ul className="ch-hero-points">
              <li>Divine Blessings through Chadhava.</li>
              <li>Vedic Rituals Performed by Purohit ji.</li>
              <li>Offer Chadhava from Anywhere.</li>
              <li>Receive Chadhava Video in 2–3 days.</li>
            </ul>
            <div className="ch-hero-actions">
              <button type="button" className="ch-btn ch-btn-primary">
                View Now
              </button>
              <button type="button" className="ch-btn ch-btn-outline">
                How it works?
              </button>
            </div>
          </div>
          <div className="ch-hero-illustration" aria-hidden="true" />
        </div>
      </section>

      {/* Upcoming Chadhava offerings */}
      <section className="ch-offerings">
        <div className="ch-offerings-header">
          <h2 className="ch-offerings-title">Upcoming Chadhava Offerings on Sri Mandir.</h2>
          <p className="ch-offerings-subtitle">
            Experience the divine with Sri Mandir Chadhava Seva. Offer Chadhava at renowned
            temples across India, receiving blessings and a video recording of the ceremony
            performed by our Purohit ji on your behalf.
          </p>
        </div>

        <div className="ch-card-grid">
          {CHADHAVA_CARDS.map((card) => (
            <article key={card.id} className="ch-card">
              <div className="ch-card-banner" />
              <div className="ch-card-body">
                <h3 className="ch-card-title">{card.title}</h3>
                <p className="ch-card-date">{card.date}</p>
                <p className="ch-card-text">{card.description}</p>
                <Link to={`/chadhava/${card.id}`} className="ch-card-cta">
                  {card.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <StatsEventUi />
      <Footer />
    </main>
  );
}

export default Chadhava;

