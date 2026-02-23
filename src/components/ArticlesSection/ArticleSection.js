import './ArticlesSection.css';

function ArticlesSection() {
  const articles = [
    {
      id: 1,
      title: 'Aarti',
      description: 'Find complete lyrics of all the famous Aartis and easily worship your beloved God.',
      imageClass: 'articles-img-aarti',
    },
    {
      id: 2,
      title: 'Chalisa',
      description: "You will get complete Chalisa of all the deities. Read Chalisa during the Pooja of your beloved deities and seek their grace.",
      imageClass: 'articles-img-chalisa',
    },
    {
      id: 3,
      title: 'Mantra',
      description: 'Here you will find all the powerful mantras for peace of mind. Chant these mantras and remove all the obstacles from life.',
      imageClass: 'articles-img-mantra',
    },
    {
      id: 4,
      title: 'Ayurvedic & Home Remedies',
      description: "We have brought the precious knowledge of Ayurveda for you, these remedies will help you lead a healthy life.",
      imageClass: 'articles-img-ayurvedic',
    },
  ];

  return (
    <section className="articles-section">
      <div className="articles-container">
        <h2 className="articles-main-heading">
          Read interesting articles about upcoming fasts, festivals, and everything around Sanatan Dharma.
        </h2>
        <p className="articles-subheading">
          Read interesting articles about upcoming fasts, festivals, and everything around Sanatan Dharma.
        </p>
        <p  className="articles-read-all-top">Read All →</p>

        <div className="articles-cards">
          {articles.map((item) => (
            <div key={item.id} className="articles-card">
              <div className={`articles-card-image ${item.imageClass}`} />
              <h3 className="articles-card-title">{item.title}</h3>
              <p className="articles-card-desc">{item.description}</p>
              <p className="articles-card-link">Read All</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ArticlesSection;