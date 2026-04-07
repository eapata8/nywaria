import img1 from "../assets/gallery_pictures/gallery1.png";
import img2 from "../assets/gallery_pictures/gallery2.jpeg";
import img3 from "../assets/gallery_pictures/gallery3.jpeg";

export default function Gallery() {
  const images = [
    { src: img1, alt: "Salon Nywaria - prestation racine" },
    { src: img2, alt: "Salon Nywaria - coiffure tresses" },
    { src: img3, alt: "Salon Nywaria - style final" },
  ];

  return (
    <div className="gallery-grid">
      <div className="gallery-item large">
        <img src={images[0].src} alt={images[0].alt} />
      </div>

      <div className="gallery-item small top">
        <img src={images[1].src} alt={images[1].alt} />
      </div>

      <div className="gallery-item small bottom">
        <img src={images[2].src} alt={images[2].alt} />
      </div>
    </div>
  );
}