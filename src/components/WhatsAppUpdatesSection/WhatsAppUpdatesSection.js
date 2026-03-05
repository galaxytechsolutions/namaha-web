
import React from "react";
import "./WhatsAppUpdates.css";

const WHATSAPP_UPDATES_URL =
  "https://wa.me/9059926363?text=I%20want%20ritual%20updates%20on%20WhatsApp";

const WhatsAppUpdates = () => {
  return (
    <section className="updates-section">
      <div className="updates-container">
        <div className="updates-card">
          <h2 className="updates-title">Get Ritual Updates on WhatsApp</h2>

          <p className="updates-description">
            Stay informed about upcoming temple rituals, auspicious dates, and
            special ceremonies directly on WhatsApp.
          </p>

          <a
            href={WHATSAPP_UPDATES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="updates-button"
          >
           
            <span className="updates-button-label">Join Updates Group</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppUpdates;