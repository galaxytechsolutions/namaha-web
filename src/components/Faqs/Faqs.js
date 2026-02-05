import './Faqs.css';

function Faqs() {
  const videos = [
    {
      id: 1,
      title: 'Expert perspective',
      thumbClass: 'faq-video-thumb-1',
      hasBadge: false,
    },
    {
      id: 2,
      title: 'Devotion at home',
      thumbClass: 'faq-video-thumb-2',
      hasBadge: true,
    },
  ];

  return (
    <section className="faq-section">
      <div className="faq-container">
        <h2 className="faq-heading">
          Can a puja done on your behalf be effective?
        </h2>
        <p className="faq-subtitle">
          Learn from trusted experts how a puja arranged from home with true devotion is as effective as one attended in-person at a temple.
        </p>
        <div className="faq-videos">
          {videos.map((video) => (
            <div key={video.id} className="faq-video-card">
              <div className={`faq-video-thumb ${video.thumbClass}`}>
                <button type="button" className="faq-play-btn" aria-label="Play video">
                  <span className="faq-play-icon" />
                </button>
                {video.hasBadge && <span className="faq-video-badge" aria-hidden="true" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faqs;