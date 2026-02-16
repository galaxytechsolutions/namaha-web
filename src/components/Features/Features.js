import './Features.css';

function Features() {
  const features = [
    {
      id: 1,
      icon: '🔔',
      iconBg: '#1e3a5f',
      title: 'Divine Temple',
      description: 'Set up your temple on your phone, dedicated to your beloved deities and seek their blessings, anytime, anywhere.',
    },
    {
      id: 2,
      icon: '📖',
      iconBg: '#5c4033',
      title: 'Hindu Literature',
      description: 'Get specially curated books, articles and videos based on Sanatan Dharma',
    },
    {
      id: 3,
      icon: '♪',
      iconBg: '#0d5c5c',
      title: 'Devotional Music',
      description: 'Get access to 5000+ Ad-Free Devotional Music. Listen to Aartis, Mantras, Bhajans, Chalisas and immerse yourself in the divine energy.',
    },
    {
      id: 4,
      icon: '✶',
      iconBg: '#8b2500',
      title: 'Panchang, Horoscope & Festivals',
      description: 'Get regular updates on Daily Horoscope, Panchang, and upcoming Fasts- Festivals.',
    },
    {
      id: 5,
      icon: '卐',
      iconBg: '#b8860b',
      title: 'Puja and Chadhava SHRI AAUM',
      description: "Book personalized Puja and Chadhava SHRI AAUM in your and your family,s name at 1000+ renowned temples across India.",
    },
    {
      id: 6,
      icon: 'ॐ',
      iconBg: '#c2410c',
      title: 'Sanatani Community',
      description: "Be a part of India's largest devotional community and connect with Sanatanis worldwide.",
    },
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        <h2 className="features-title">One App for all your devotional needs</h2>
        <p className="features-subtitle">
          Sri Mandir brings these amazing features for you, get these features for free and start your devotional journey now.
        </p>
        <div className="features-grid">
          {features.map((item) => (
            <div key={item.id} className="features-card">
              <div className="features-icon-wrap" style={{ background: item.iconBg }}>
                <span className="features-icon" aria-hidden="true">{item.icon}</span>
              </div>
              <h3 className="features-card-title">{item.title}</h3>
              <p className="features-card-desc">{item.description}</p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}

export default Features;