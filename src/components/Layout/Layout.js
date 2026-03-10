import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate,  NavLink} from 'react-router-dom';
import axiosInstance from '../../lib/instance';
import './Layout.css';

function Layout({ children }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const closeMenu = () => setMenuOpen(false);

    // ⭐ 🔥 FIXED: Check auth on EVERY route change + mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        console.log('🔍 Layout auth check:', token ? 'LOGGED IN ✅' : 'GUEST');
        
        if (!token) {
            setUser(null);
            return;
        }

        // Use stored user as initial display (avoids flash) while we fetch latest profile
        const getImageUrl = (u) =>
            u?.profileImageUrl || u?.profileImage || u?.avatar || u?.profilePic || null;
        if (userStr) {
            try {
                const parsed = JSON.parse(userStr);
                setUser({
                    name: parsed.name,
                    role: parsed.role,
                    mobile: parsed.mobile,
                    profileImageUrl: getImageUrl(parsed),
                });
            } catch {
                setUser(null);
            }
        }

        // Always fetch profile from API when token exists (login API may not return avatar)
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get('/auth/profile');
                if (res.data?.success && res.data?.user) {
                    const u = res.data.user;
                    const imageUrl = getImageUrl(u);
                    const userData = {
                        name: u.name,
                        role: u.role,
                        mobile: u.mobile,
                        profileImageUrl: imageUrl || null,
                    };
                    localStorage.setItem('user', JSON.stringify(u));
                    setUser(userData);
                }
            } catch {
                setUser(null);
            }
        };
        fetchUser();
    }, [location.pathname]); // 🔥 KEY FIX: Re-checks on every navigation!

    // Refetch profile when Profile page updates (e.g. avatar change)
    useEffect(() => {
        const getImageUrl = (u) =>
            u?.profileImageUrl || u?.profileImage || u?.avatar || u?.profilePic || null;
        const onProfileUpdated = () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            axiosInstance.get('/auth/profile').then((res) => {
                if (res.data?.success && res.data?.user) {
                    const u = res.data.user;
                    const userData = {
                        name: u.name,
                        role: u.role,
                        mobile: u.mobile,
                        profileImageUrl: getImageUrl(u) || null,
                    };
                    localStorage.setItem('user', JSON.stringify(u));
                    setUser(userData);
                }
            }).catch(() => {});
        };
        window.addEventListener('profile-updated', onProfileUpdated);
        return () => window.removeEventListener('profile-updated', onProfileUpdated);
    }, []);

    // Scroll to top when navigating to Home or Puja
    useEffect(() => {
        if (['/', '/puja', '/chadhava', '/about', '/contact'].includes(location.pathname)) {
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

    // ⭐ LOGOUT FUNCTION
    const handleLogout = () => {
        console.log('🚪 Logging out...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setProfileOpen(false);
        navigate('/');
    };

    // ⭐ 🔥 SIMPLIFIED: Direct token check
    const isLoggedIn = !!localStorage.getItem('token');
    console.log('🔐 isLoggedIn:', isLoggedIn, 'user:', user); // Debug
    const SHOW_PROFILE_MENU = true; // Show profile dropdown when logged in

    return (
        <div className="app-wrap">
            <header className={`header ${isScrolled ? 'scrolled' : ''} ${menuOpen ? 'open' : ''}`}>
                <nav className="nav-container">
                    <Link to="/" className="logo">
                        <img src="/logo.png" alt="Shri AAUM" className="logo-img" />
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
                            <NavLink
                                to="/puja"
                                className={location.pathname === '/puja' ? 'active' : ''}
                                onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); closeMenu(); }}
                            >
                                Puja
                            </NavLink>
                        </li>
                        <li>
                            <Link
                                to="/about"
                                className={location.pathname === '/about' ? 'active' : ''}
                                onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); closeMenu(); }}
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contact"
                                className={location.pathname === '/contact' ? 'active' : ''}
                                onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); closeMenu(); }}
                            >
                                Contact
                            </Link>
                        </li>
                        {/* <li>
                            <NavLink
                                to="/chadhava"
                                className={location.pathname === '/chadhava' ? 'active' : ''}
                                onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); closeMenu(); }}
                            >
                                Chadhava
                            </NavLink>
                        </li> */}
                        {/* <li><a href="#library" onClick={closeMenu}>Library</a></li> */}
                    </ul>
                    <div className="nav-right">
                        {/* Profile icon always visible; dropdown only when logged in */}
                        <div className="profile-container">
                            <button
                                type="button"
                                className="profile-trigger"
                                onClick={() => {
                                    if (!isLoggedIn) {
                                        setShowLoginModal(true);
                                    } else {
                                        setProfileOpen(!profileOpen);
                                    }
                                }}
                                aria-label="User profile"
                            >
                                {user?.profileImageUrl ? (
                                    <img
                                        src={user.profileImageUrl}
                                        alt="Profile"
                                        className="profile-trigger-avatar"
                                    />
                                ) : (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="7" r="4" stroke="#0d0d0d" strokeWidth="2" fill="none" />
                                        <path d="M20 21v-2a 4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#0d0d0d" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                )}
                            </button>

                            {isLoggedIn && SHOW_PROFILE_MENU && profileOpen && (
                                <div className="profile-dropdown">
                                        <div className="profile-header">
                                            <div className="profile-info">
                                                <div>
                                                    <div className="profile-name">{user?.name}</div>
                                                    <div className="profile-role">{user?.role}</div>
                                                    <div className="profile-email">{user?.mobile}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="profile-menu">
                                            <Link to="/my-bookings" className="profile-item" onClick={() => setProfileOpen(false)}>
                                                <div className="profile-icon">🕉</div>
                                                <span>My Puja Bookings</span>
                                                <div className="profile-chevron">›</div>
                                            </Link>

                                            {/* <Link to="/my-chadhava" className="profile-item" onClick={() => setProfileOpen(false)}>
                                                <div className="profile-icon">🙏</div>
                                                <span>My Chadhava Bookings</span>
                                                <div className="profile-chevron">›</div>
                                            </Link> */}

                                            {/* <Link to="/book-puja" className="profile-item new-badge" onClick={() => setProfileOpen(false)}>
                                                <div className="profile-icon">📅</div>
                                                <span>Book a Puja</span>
                                                <div className="profile-badge">New</div>
                                                <div className="profile-chevron">›</div>
                                            </Link> */}

                                            {/* <Link to="/book-chadhava" className="profile-item new-badge" onClick={() => setProfileOpen(false)}>
                                                <div className="profile-icon">🔔</div>
                                                <span>Book a Chadhava</span>
                                                <div className="profile-badge">New</div>
                                                <div className="profile-chevron">›</div>
                                            </Link> */}

                                           
                                        </div>

                                        {/* ⭐ 🔥 LOGOUT BUTTON */}
                                        <div className="profile-menu">
                                            <button 
                                                className="profile-item logout-item"
                                                onClick={handleLogout}
                                            >
                                                <div className="profile-icon">🚪</div>
                                                <span>Logout</span>
                                                <div className="profile-chevron">›</div>
                                            </button>
                                        </div>

                                        {/* <div className="profile-support">
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
                                        </div> */}
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

            {showLoginModal && (
                <div className="layout-login-modal-backdrop" onClick={() => setShowLoginModal(false)}>
                    <div className="layout-login-modal" onClick={(e) => e.stopPropagation()}>
                        <p className="layout-login-modal-message">Please login first</p>
                        <div className="layout-login-modal-actions">
                            <button
                                type="button"
                                className="layout-login-modal-btn layout-login-modal-btn-cancel"
                                onClick={() => setShowLoginModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="layout-login-modal-btn layout-login-modal-btn-login"
                                onClick={() => {
                                    setShowLoginModal(false);
                                    navigate('/login');
                                }}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Layout;