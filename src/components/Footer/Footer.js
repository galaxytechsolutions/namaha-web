import './Footer.css';

function Footer() {
    const companyLinks = [
        { label: 'About Us', href: '#' },
        { label: 'Contact Us', href: '#' },
    ];
    const serviceLinks = [
        { label: 'Puja', href: '#' },
        { label: 'Chadhava', href: '#' },
        { label: 'Panchang', href: '#' },
        { label: 'Temples', href: '#' },
    ];
    const socialLinks = [
        { name: 'YouTube', href: '#', icon: '▶' },
        { name: 'Instagram', href: '#', icon: '📷' },
        { name: 'LinkedIn', href: '#', icon: 'in' },
        { name: 'WhatsApp', href: '#', icon: '💬' },
        { name: 'X', href: '#', icon: '𝕏' },
        { name: 'Facebook', href: '#', icon: 'f' },
    ];

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-col footer-brand">
                        <div className="footer-logo-wrap">
                            <div className="footer-logo" />
                            <span className="footer-brand-name">SHRI AAUM</span>
                        </div>
                        <p className="footer-desc">
                            SHRI AAUM has brought religious services to the masses in India by connecting devotees, pandits and temples. Partnering with over 100 renowned temples, we provide exclusive pujas and offerings performed by expert pandits and share videos of the completed puja rituals.
                        </p>
                    </div>
                    <div className="footer-col">
                        <h4 className="footer-heading">Company</h4>
                        <ul className="footer-links">
                            {companyLinks.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href}>{link.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4 className="footer-heading">Our Services</h4>
                        <ul className="footer-links">
                            {serviceLinks.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href}>{link.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="footer-col footer-address-col">
                        <h4 className="footer-heading">Our Address</h4>
                        <p className="footer-address"> 2-342, Ground Floor, New Vadapalani, Madhapur,Hyderabad - 500081
                        </p>
                        <div className="footer-social">
                            {socialLinks.map((s) => (
                                <a key={s.name} href={s.href} className="footer-social-icon" aria-label={s.name}>
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="footer-divider" />

                <div className="footer-bottom">
                    <div className="footer-store-badges">
                        <a  className="footer-badge footer-google-play">GET IT ON Google Play</a>
                        <a  className="footer-badge footer-app-store">Download on the App Store</a>
                    </div>
                    <div className="footer-trust-logos">
                        <span className="footer-trust-item">Digital India</span>
                        <span className="footer-trust-item">ISO 27001</span>
                        <span className="footer-trust-item">Razorpay</span>
                    </div>
                    <div className="footer-legal">
                        <a >Privacy Policy</a>
                        <span className="footer-legal-sep">•</span>
                        <a >Terms and Conditions</a>
                        <p className="footer-copyright">© 2026 SriMandir, Inc. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;