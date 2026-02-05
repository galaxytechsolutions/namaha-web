import './Reviews.css';

function Reviews() {
  const reviews = [
    {
      id: 1,
      type: 'video',
      name: 'Achutam Nair',
      location: 'Bangalore',
      avatar: null,
    },
    {
      id: 2,
      type: 'text',
      text: 'So many puja options for all the devotees. Great to get the grace of god from our homes. Most authentic and trustworthy puja service compared to others.',
      name: 'Ramesh Chandra Bhatt',
      location: 'Nagpur',
      avatar: null,
    },
    {
      id: 3,
      type: 'text',
      text: 'I really like the whole process of puja at Sri Mandir. Puja is conducted properly and customer support is available throughout the process. I asked questions to Mamta Maam and she resolved my queries. Most genuine and authentic.',
      name: 'Aperna Mal',
      location: 'Puri',
      avatar: null,
    },
    {
      id: 4,
      type: 'text',
      text: 'Liked the fact that we can book puja online else we have to travel to get everything done. Felt very nice to hear my name and gotra during the puja of Mahadev. Prasad was also received in time.',
      name: 'Shivraj Dobhi',
      location: 'Agra',
      avatar: null,
    },
  ];

  return (
    <section className="reviews-section">
      <div className="reviews-container">
        <h2 className="reviews-title">Reviews & Ratings</h2>
        <p className="reviews-subtitle">
          Read to what our beloved devotees have to say about Sri Mandir.
        </p>
        <div className="reviews-cards">
          {reviews.map((review) => (
            <div key={review.id} className="reviews-card">
              {review.type === 'video' ? (
                <div className="reviews-video-wrap">
                  <div className="reviews-video-placeholder">
                    <button type="button" className="reviews-video-play" aria-label="Play">
                      ▶
                    </button>
                  </div>
                  {/* <div className="reviews-video-controls">
                    <span className="reviews-video-time">0:00</span>
                    <span className="reviews-video-duration">1:00</span>
                    <span className="reviews-video-volume" aria-hidden="true">🔊</span>
                  </div> */}
                </div>
              ) : (
                <div className="reviews-text-box">
                  <p>{review.text}</p>
                </div>
              )}
              <div className="reviews-author">
                <div className="reviews-avatar" />
                <div className="reviews-author-info">
                  <span className="reviews-name">{review.name}</span>
                  <span className="reviews-location">{review.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="reviews-pagination">
          <span className="reviews-dot active" aria-current="true" />
          <span className="reviews-dot" />
        </div>
      </div>
    </section>
  );
}

export default Reviews;