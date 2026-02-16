import React, { useState } from 'react';
import './StatsEventUi.css';

const OFFERING_CARDS = [
  { id: 1, number: '28657', label: 'Sindoor offerings', colorClass: 'chadhava-card-orange' },
  { id: 2, number: '9467', label: 'Hanuman Bhog offerings', colorClass: 'chadhava-card-purple' },
  { id: 3, number: '5231', label: 'Ramayan Path bookings', colorClass: 'chadhava-card-pink' },
];

const STEPS = [
  {
    id: 1,
    title: 'Choose the event',
    description: 'Choose your Chadhava at your favourite temple',
  },
  {
    id: 2,
    title: 'Your Name',
    description: 'After selecting the Chadhava, Fill in your name in the required field.',
  },
  {
    id: 3,
    title: 'Chadhava Video',
    description: 'The video of your Chadhava completed on your name will be shared here.',
  },
];

function StatsEventUi() {
  const [phoneSlide, setPhoneSlide] = useState(0);

  return (
    <section className="chadhava-section">
      <div className="chadhava-container">
        {/* Top: Journey + Why + Stats */}
        <div className="chadhava-journey-block">
          <h2 className="chadhava-main-title">
            Start your Sacred Journey with SHRI AAUM Chadhava Service
          </h2>
          <p className="chadhava-subtitle">
            Why make offerings through Sri Mandir Chadhava SHRI AAUM?
          </p>
          <div className="chadhava-cards-row">
            {OFFERING_CARDS.map((card) => (
              <div key={card.id} className={`chadhava-offer-card ${card.colorClass}`}>
                <span className="chadhava-offer-number">{card.number}</span>
                <span className="chadhava-offer-label">{card.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: How it works + Steps + Phone mockup */}
        <div className="chadhava-how-block">
          <h2 className="chadhava-how-title">
            How does SHRI AAUM Online Chadhava Works?
          </h2>
          <div className="chadhava-how-grid">
            <div className="chadhava-steps-col">
              {STEPS.map((step) => (
                <div key={step.id} className="chadhava-step">
                  <div className="chadhava-step-num">{step.id}</div>
                  <div className="chadhava-step-content">
                    <h3 className="chadhava-step-title">{step.title}</h3>
                    <p className="chadhava-step-desc">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="chadhava-phone-col">
              <div className="chadhava-phone-mockup">
                <div className="chadhava-phone-screen">
                  <div className="chadhava-screen-content">
                    <div className="chadhava-screen-deity" />
                    <p className="chadhava-screen-event">Suprabhat Mahotsav</p>
                    <p className="chadhava-screen-headline">
                      Participate in Akhand Ramayan Path on the auspicious day of Ram Navami.
                    </p>
                    <p className="chadhava-screen-body">
                      Light a Diya on Ram Navami in Ayodhya. This is the first Ram Navami after consecration of the Ram Lalla. Our purohit will light the diya in your name on the occasion of Ram Janmotsav in the ancient Raj Dwar temple and share the video on the app.
                    </p>
                    <button type="button" className="chadhava-screen-cta">
                      Light Diya →
                    </button>
                  </div>
                  <span className="chadhava-finger-icon" aria-hidden="true">👆</span>
                </div>
                <div className="chadhava-phone-dots">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      type="button"
                      className={`chadhava-phone-dot ${i === phoneSlide ? 'active' : ''}`}
                      onClick={() => setPhoneSlide(i)}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatsEventUi;