import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    const companyLinks = [
        { label: 'About Us', href: '/about' },
        { label: 'Contact Us', href: '/contact' },
    ];
    const serviceLinks = [
        { label: 'Puja', href: '#' },
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
                            <img src="/logo.png" alt="Shri AAUM" className="footer-logo" />
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
                                    <Link to={link.href}>{link.label}</Link>
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
                        <p className="footer-address">
                            F.No.703, 7th Flr, Block-B, SVC Tree Walk,<br />
                            Kondapur, Kondapur, Serilingampally,<br />
                            K.V.Rangareddy, Telangana - 500084.
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


               
            </div>
        </footer>
    );
}

export default Footer;