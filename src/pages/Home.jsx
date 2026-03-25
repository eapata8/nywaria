import img1 from "../assets/gallery_pictures/gallery1.png";
import img2 from "../assets/gallery_pictures/gallery2.jpeg";
import img3 from "../assets/gallery_pictures/gallery3.jpeg";

export default function Home() {
  const heuresOuverture = "Lundi au samedi: 10h - 19h";
  const adresse = "Gatineau, QC J8Z 1B7";

  return (
    <div style={{ padding: 20, margin: "0 auto", maxWidth: 1200 }}>
      <h1>Bienvenue chez Nywaria</h1>

      <p>
        <strong>Heures d'ouverture:</strong> {heuresOuverture}
        <strong>  .   </strong>
        <strong>Adresse:</strong> {adresse}{" "}
        <a
          style={{ color: "blue" }}
          href="https://www.google.com/maps/dir/?api=1&destination=Gatineau,+QC+J8Z+1B7"
          target="_blank"
          rel="noopener noreferrer"
        >
          Afficher l'itinéraire
        </a>
      </p>

      {/* Mini gallerie */}
      <div className="gallery-grid">
        <div className="gallery-item large">
          <img src={img1} />
        </div>

        <div className="gallery-item small top">
          <img src={img2} />
        </div>

        <div className="gallery-item small bottom">
          <img src={img3} />
        </div>
      </div>

    </div>
    
  );
}