import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './MobileBottomNav.css';

const NAV_ITEMS = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'puja',
    label: 'Puja',
    path: '/puja',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 'bookings',
    label: 'Bookings',
    path: '/my-bookings',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </svg>
    ),
  },
];

function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (item) => {
    if (item.path === '/') return location.pathname === '/';
    return location.pathname.startsWith(item.path);
  };

  const handleTap = (item) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(item.path);
  };

  return (
    <>
      {/* Bottom nav bar */}
      <nav className="mobile-bottom-nav" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`bottom-nav-item ${isActive(item) ? 'active' : ''}`}
            onClick={() => handleTap(item)}
            aria-label={item.label}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
            {isActive(item) && <span className="bottom-nav-dot" />}
          </button>
        ))}
      </nav>
    </>
  );
}

export default MobileBottomNav;
