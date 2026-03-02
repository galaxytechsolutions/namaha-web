import React from 'react';
import './About.css';
import Footer from '../Footer/Footer';

function About() {
  // const stats = [
  //   { id: 1, icon: '🙏', value: '10k', label: 'Devotees' },
  //   { id: 2, icon: '⭐', value: '4.5', label: 'Star Rating' },
  //   { id: 4, icon: '🔥', value: '10k+', label: 'Services' },
  // ];

  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero-inner">
          <img src="/logo.png" alt="Shri AAUM" className="about-logo" />
          <h1>About Shri AAUM</h1>
          <p className="about-tagline">
            India's Most Trusted Devotional Platform
          </p>
        </div>
      </section>

      <section className="about-content">
        <div className="about-container">
          <p className="about-desc">
            In a world that moves fast, sacred traditions must not be left behind.
          </p>
          <p className="about-desc">
            Shri Aaum was founded with a singular intention to preserve, structure, and make accessible the living spiritual traditions of Bharat in their most authentic form.
          </p>
          <p className="about-desc">
            <strong>Shri</strong> represents divine abundance, grace, prosperity, and auspicious flow.<br />
            <strong>Aaum (Om)</strong> is the primordial cosmic vibration, the eternal sound from which creation unfolds.
          </p>
          <p className="about-desc">
            Together, Shri Aaum is a conscious invocation of divine order into everyday life.
          </p>
          <p className="about-desc">
            We are a sacred bridge connecting devotees to powerful temples, teerth kshetras, ancient rituals, and scripturally rooted practices that have guided seekers for centuries.
          </p>
        </div>
      </section>

      <section className="about-values">
        <div className="about-container">
          <h2>Our work is rooted in three core principles</h2>
          <div className="about-values-grid">
            <div className="about-value-card">
              <h3>Temple</h3>
              <p>Authentic temple rituals and kshetra-based pujas performed in their traditional lineage.</p>
            </div>
            <div className="about-value-card">
              <h3>Teerth</h3>
              <p>Sacred Kshetras honoring the spiritual power of place, pilgrimage, and energetic sanctity.</p>
            </div>
            <div className="about-value-card">
              <h3>Tattva</h3>
              <p>The deeper spiritual essence ensuring every offering is aligned with scriptural authenticity and philosophical integrity.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-content">
        <div className="about-container">
          <p className="about-desc">
            We collaborate with vedic priests and temple authorities, to ensure every ritual is conducted with precision, purity, and respect for lineage.
          </p>
          <p className="about-desc">
            For those who cannot always travel to ancient kshetras…<br />
            For those seeking structure in their spiritual journey…<br />
            For those who wish to align with divine grace consciously…
          </p>
          <p className="about-desc about-cta">
            Shri Aaum brings Temple • Teerth • Tattva within your reach.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default About;
