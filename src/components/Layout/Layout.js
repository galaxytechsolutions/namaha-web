import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

function Layout({ children }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const closeMenu = () => setMenuOpen(false);
    // const closeProfile = () => setProfileOpen(false);

    // Scroll to top when navigating to Home or Puja
    useEffect(() => {
        if (location.pathname === '/' || location.pathname === '/puja' || location.pathname === '/chadhava') {
            window.scrollTo({ top: 0, behavior: 'auto' });
        }
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileOpen && !event.target.closest('.profile-container')) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [profileOpen]);

    return (
        <div className="app-wrap">
            <header className={`header ${isScrolled ? 'scrolled' : ''} ${menuOpen ? 'open' : ''}`}>
                <nav className="nav-container">
                    <Link to="/" className="logo">
                        <span className="logo-icon">🪔</span>
                        <span>Seva</span>
                    </Link>
                    <ul className="nav-links">
                        <li>
                            <Link
                                to="/"
                                className={location.pathname === '/' ? 'active' : ''}
                                onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); closeMenu(); }}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/puja"
                                className={location.pathname === '/puja' ? 'active' : ''}
                                onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); closeMenu(); }}
                            >
                                Puja
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/chadhava"
                                className={location.pathname === '/chadhava' ? 'active' : ''}
                                onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); closeMenu(); }}
                            >
                                Chadhava
                            </Link>
                        </li>
                        <li><a href="#temples" onClick={closeMenu}>Temples</a></li>
                        <li><a href="#library" onClick={closeMenu}>Library</a></li>
                        <li><a href="#astro" onClick={closeMenu}>Astro</a></li>
                        <li><a href="#tools" onClick={closeMenu}>Tools</a></li>
                    </ul>
                    <div className="nav-right">
                        <select className="language-selector">
                            <option>English</option>
                            <option>Hindi</option>
                        </select>
                        
                        {/* Profile Dropdown */}
                        <div className="profile-container">
                            <button 
                                type="button"
                                className="profile-trigger"
                                onClick={() => setProfileOpen(!profileOpen)}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="7" r="4" stroke="#0d0d0d" strokeWidth="2" fill="none"/>
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#0d0d0d" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </button>
                            
                            {profileOpen && (
                                <div className="profile-dropdown">
                                    <div className="profile-header">
                                        <div className="profile-info">
                                            <div className="profile-avatar">
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="profile-name">John Doe</div>
                                                <div className="profile-email">john@example.com</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="profile-menu">
                                        <Link to="/profile" className="profile-item">
                                            <div className="profile-icon">👤</div>
                                            <span>My Profile</span>
                                            <div className="profile-chevron">›</div>
                                        </Link>
                                        
                                        <Link to="/my-puja" className="profile-item">
                                            <div className="profile-icon">🕉</div>
                                            <span>My Puja Bookings</span>
                                            <div className="profile-chevron">›</div>
                                        </Link>
                                        
                                        <Link to="/my-chadhava" className="profile-item">
                                            <div className="profile-icon">🙏</div>
                                            <span>My Chadhava Bookings</span>
                                            <div className="profile-chevron">›</div>
                                        </Link>
                                        
                                        <Link to="/book-puja" className="profile-item new-badge">
                                            <div className="profile-icon">📅</div>
                                            <span>Book a Puja</span>
                                            <div className="profile-badge">New</div>
                                            <div className="profile-chevron">›</div>
                                        </Link>
                                        
                                        <Link to="/book-chadhava" className="profile-item new-badge">
                                            <div className="profile-icon">🔔</div>
                                            <span>Book a Chadhava</span>
                                            <div className="profile-badge">New</div>
                                            <div className="profile-chevron">›</div>
                                        </Link>
                                        
                                        <Link to="/astro-tools" className="profile-item">
                                            <div className="profile-icon">⭐</div>
                                            <span>Astro Tools</span>
                                            <div className="profile-chevron">›</div>
                                        </Link>
                                    </div>
                                    
                                    <div className="profile-support">
                                        <div className="support-title">Help & Support for Puja Booking</div>
                                        <div className="support-contact">
                                            <div className="support-phone">
                                                <span className="phone-icon">📞</span>
                                                <span>769-67-678 | 10AM-7:30PM</span>
                                            </div>
                                            <div className="support-links">
                                                <a href="mailto:test@test.com" className="support-link">Email us</a>
                                                <a href="https://wa.me/0000000000" className="support-link whatsapp">Whatsapp us</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            className="menu-toggle"
                            onClick={() => setMenuOpen((prev) => !prev)}
                            aria-label="Toggle menu"
                        >
                            ☰
                        </button>
                    </div>
                </nav>
            </header>
            {children}
        </div>
    );
}

export default Layout;
