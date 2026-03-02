import React, { useState } from 'react';
import './Contact.css';
import Footer from '../Footer/Footer';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder - you can wire this to an API later
    setSubmitted(true);
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-inner">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Reach out for any queries or support.</p>
        </div>
      </section>

      <section className="contact-main">
        <div className="contact-container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <div className="contact-info-item">
                <span className="contact-icon">📍</span>
                <div>
                  <strong>Our Address</strong>
                  <p>
                    F.No.703, 7th Flr, Block-B, SVC Tree Walk,<br />
                    Kondapur, Kondapur, Serilingampally,<br />
                    K.V.Rangareddy, Telangana - 500084
                  </p>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="contact-icon">📧</span>
                <div>
                  <strong>Email</strong>
                  <p>bhakta@shriaaum.com</p>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="contact-icon">📱</span>
                <div>
                  <strong>Customer Support</strong>
                  <p>Available via app / website</p>
                </div>
              </div>
            </div>

            <div className="contact-form-wrap">
              <h2>Send us a Message</h2>
              {submitted ? (
                <div className="contact-success">
                  <p>Thank you for your message! We'll get back to you soon.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="contact-field">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div className="contact-field">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="contact-field">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                    />
                  </div>
                  <div className="contact-field">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Your message..."
                    />
                  </div>
                  <button type="submit" className="contact-btn">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default Contact;
