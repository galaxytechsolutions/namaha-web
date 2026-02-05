import './AboutStats.css';

function AboutStats() {
  const stats = [
    {
      id: 1,
      icon: '🙏',
      title: '30M+ Devotees',
      description: 'have trusted us in their devotional journey',
    },
    {
      id: 2,
      icon: '⭐',
      title: '4.5 star rating',
      description: 'Over 1 Lakh devotees express their love for us on playstore',
    },
    {
      id: 3,
      icon: '🌐',
      title: '30+ Countries',
      description: 'We help devotees globally reconnect with their devotional heritage',
    },
    {
      id: 4,
      icon: '🔥',
      title: '3M+ Services',
      description: "Millions of devotees have commenced Pooja and Chadhava at famous temples of India with us to seek God's grace.",
    },
  ];

  return (
    <section className="about-stats-section">
      <div className="about-stats-container">
        <div className="about-stats-content">
          <p className="about-stats-eyebrow">Trusted by Over 30 Million Devotees</p>
          <h2 className="about-stats-title">India's Largest Devotional Platform</h2>
          <p className="about-stats-desc">
            We are committed to building the most trusted destination that serves the devotional needs of millions of devotees in India and abroad, providing them the access they always wanted.
          </p>
        </div>
        <div className="about-stats-grid">
          {stats.map((item) => (
            <div key={item.id} className="about-stats-card">
              <div className="about-stats-icon-wrap">
                <span className="about-stats-icon" aria-hidden="true">{item.icon}</span>
              </div>
              <h3 className="about-stats-card-title">{item.title}</h3>
              <p className="about-stats-card-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutStats;