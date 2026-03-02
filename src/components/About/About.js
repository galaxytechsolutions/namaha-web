import React from 'react';
import './About.css';
import Footer from '../Footer/Footer';

function About() {
  const stats = [
    { id: 1, icon: '🙏', value: '30M+', label: 'Devotees' },
    { id: 2, icon: '⭐', value: '4.5', label: 'Star Rating' },
    { id: 3, icon: '🌐', value: '30+', label: 'Countries' },
    { id: 4, icon: '🔥', value: '3M+', label: 'Services' },
  ];

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
          <h2>Our Mission</h2>
          <p className="about-desc">
            SHRI AAUM has brought religious services to the masses in India by connecting devotees, pandits and temples. Partnering with over 100 renowned temples, we provide exclusive pujas and offerings performed by expert pandits and share videos of the completed puja rituals.
          </p>
          <p className="about-desc">
            Shri AAUM is committed to building the most trusted spiritual destination that serves the devotional needs of millions of devotees across India and abroad, providing them access to pujas and spiritual activities from the comfort of their homes.
          </p>
        </div>
      </section>

      <section className="about-stats-section">
        <div className="about-container">
          <h2>Our Reach</h2>
          <div className="about-stats-grid">
            {stats.map((item) => (
              <div key={item.id} className="about-stat-card">
                <span className="about-stat-icon">{item.icon}</span>
                <span className="about-stat-value">{item.value}</span>
                <span className="about-stat-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="about-container">
          <h2>What We Stand For</h2>
          <div className="about-values-grid">
            <div className="about-value-card">
              <h3>Trust</h3>
              <p>Building the most trusted spiritual destination for devotees across India and the world.</p>
            </div>
            <div className="about-value-card">
              <h3>Access</h3>
              <p>Connecting you to renowned temples and expert pandits, no matter where you are.</p>
            </div>
            <div className="about-value-card">
              <h3>Transparency</h3>
              <p>Sharing videos of completed puja rituals so you can witness the offerings made on your behalf.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default About;
