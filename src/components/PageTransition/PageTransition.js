import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

const LOADING_DURATION = 400;

function PageTransition({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const prevPath = useRef(location.pathname);
  const timerRef = useRef(null);

  useEffect(() => {
    if (prevPath.current === location.pathname) return;
    prevPath.current = location.pathname;

    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDisplayChildren(children);
      setLoading(false);
    }, LOADING_DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [location.pathname, children]);

  useEffect(() => {
    if (!loading) {
      setDisplayChildren(children);
    }
  }, [children, loading]);

  return (
    <div className="pt-wrap">
      {loading && (
        <div className="pt-loading">
          <div className="pt-spinner" />
        </div>
      )}
      <div className={`pt-content ${loading ? 'pt-hidden' : 'pt-visible'}`}>
        {displayChildren}
      </div>
    </div>
  );
}

export default PageTransition;
