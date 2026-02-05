import { Link } from 'react-router-dom';
import './SpecialPuja.css';
import '../PujaList/PujaList.css';
import { PUJA_LIST } from '../../data/pujaList';

const SP_IMAGE_MAP = { 1: 'sp-banner-1', 2: 'sp-banner-2', 3: 'sp-banner-3' };

function SpecialPuja() {
  const pujas = PUJA_LIST.map((p) => ({ ...p, imageClass: SP_IMAGE_MAP[p.id] || p.imageClass }));

  return (
    <section className="special-puja-section">
      <div className="sp-container">
        <div className="sp-header">
          <h2><span className="sp-title-purple">Seva</span> Special Pujas</h2>
          <p className="sp-subtitle">
            Begin 2026 with faith - get special pujas performed in your name at India's powerful temples to achieve peace and protection for your family.
          </p>
        </div>

        <div className="sp-cards">
          {pujas.map((puja) => (
            <div key={puja.id} className="pl-card">
              <div className={`pl-card-banner ${puja.imageClass}`}>
                <div className="pl-card-overlay" />
                <span className={`pl-card-tag ${puja.tagColor}`}>{puja.specialTag}</span>
                {puja.topChoice && <span className="pl-card-top-choice">DEVOTEE'S TOP CHOICE</span>}
                <p className="pl-card-promo">{puja.promoText}</p>
                <button type="button" className="pl-card-book">BOOK PUJA</button>
              </div>
              <p className="pl-card-category">{puja.category}</p>
              <h3 className="pl-card-title">{puja.title}</h3>
              <p className="pl-card-purpose">{puja.purpose}</p>
              <p className="pl-card-meta">🏛 {puja.location}</p>
              <p className="pl-card-meta">📅 {puja.date}</p>
              <Link to={`/puja/${puja.id}`} className="pl-card-participate">PARTICIPATE →</Link>
            </div>
          ))}
        </div>

        <div className="sp-footer">
          <a href="/puja" className="sp-view-all">View All Pujas →</a>
        </div>
      </div>
    </section>
  );
}

export default SpecialPuja;