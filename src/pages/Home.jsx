import { useState } from "react";
import img1 from "../assets/gallery_pictures/gallery1.png";
import img2 from "../assets/gallery_pictures/gallery2.jpeg";
import img3 from "../assets/gallery_pictures/gallery3.jpeg";
import { FaInstagram } from "react-icons/fa";

const portfolio = [img1, img2, img3, img1, img2, img3, img2, img3];
const tabs = ["Prestations", "Portfolio", "Avis", "Adresse"];

export default function Home() {
  const [activeTab, setActiveTab] = useState("Prestations");

  const services = [
    { nom: "Coupe Barbier", duree: "30 min", prix: "28,70 $CA" },
    { nom: "Senior (65 ans et plus)", duree: "30 min", prix: "24,35 $CA" },
    { nom: "Garçon (11 ans et moins)", duree: "30 min", prix: "25,22 $CA" },
    { nom: "Coupe Clipper", duree: "30 min", prix: "20 $CA" },
  ];

  const goTo = (label) => {
    setActiveTab(label);
    document.getElementById(label.toLowerCase())?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="profile-page">
      <aside className="profile-sidebar">
        <div className="avatar-wrap">
          <img src={img1} alt="Logo Nywaria" className="avatar" />
        </div>
        <h1>NYWARIA</h1>
        <p className="muted center">NYWARIA</p>
        <p className="muted center">Gatineau</p>

        <section>
          <h3>À propos de mon profil</h3>
          <p>
            Coiffeuse Nattes, Twists, Braids, Départ et Entretien de locs. 👑 Viens sublimer ta couronne. 🗺️ Ottawa-Gatineau.
          </p>
        </section>

        <section>
          <h3>Langues</h3>
          <div className="chips">
            <span>Anglais</span>
            <span>Français</span>
          </div>
        </section>


        <section>
          <h3>Me trouver</h3>
          <a href="https://www.instagram.com/nywaria/" target="_blank" rel="noreferrer" className="social-circle" aria-label="Instagram">
            <FaInstagram />
          </a>
        </section>

        <p className="muted center member-date">Depuis 2023</p>
      </aside>

      <section className="profile-content">
        <div className="section-tabs" role="tablist" aria-label="Sections du profil">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => goTo(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <section id="prestations" className="content-block">
          <h2>Prestations</h2>
          <p className="muted">Ce professionnel ne fournit aucun service.</p>
        </section>

        <section id="portfolio" className="content-block">
          <h2>Portfolio <span className="count">28</span></h2>
          <div className="portfolio-grid">
            {portfolio.map((img, i) => (
              <div key={i} className={`tile ${i === 0 ? "tile-large" : ""}`}>
                <img src={img} alt={`Portfolio ${i + 1}`} />
                {i === portfolio.length - 1 && <div className="overlay">+19</div>}
              </div>
            ))}
          </div>
        </section>

        <section id="avis" className="content-block">
          <h2>Avis</h2>
          <p className="muted">Ce professionnel n'a pas d'avis pour le moment.</p>
        </section>

        <section id="adresse" className="content-block">
          <h2>Adresse</h2>
          <p className="muted">Ce professionnel ne travaille dans aucun établissement.</p>
        </section>

        <section className="content-block services-like-shot">
          <h2>Prestations</h2>
          <div className="mini-cats">
            {["À la une", "Combo", "Militaire", "Enfant", "Senior", "Coupe", "Rasage"].map((cat) => (
              <button key={cat} type="button" className={`mini-cat ${cat === "À la une" ? "active" : ""}`}>
                {cat}
              </button>
            ))}
          </div>

          {services.map((service) => (
            <article key={service.nom} className="service-row">
              <div>
                <h3>{service.nom}</h3>
                <p>{service.duree}</p>
                <p>{service.prix}</p>
              </div>
              <button type="button" className="book-btn">Réserver</button>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
