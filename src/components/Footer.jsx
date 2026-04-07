import { Link } from "react-router-dom";
import { FaInstagram, FaTiktok, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
        <div style={styles.container}>
          {/* Marque */}
        <div style={styles.col}>
          <h2 style={styles.brand}>Nywaria</h2>
          <p style={styles.text}>
            Gatineau / Ottawa <br />
            Braids • Locs • Protective Styles
          </p>

          <a href="/booking" style={styles.cta}>
            Réserver maintenant
          </a>
        </div>

        {/* Navigation */}
        <div style={styles.col}>
          <h3 style={styles.title}>Navigation</h3>
          <Link to="/" style={styles.link}>Accueil</Link>
          <Link to="/services" style={styles.link}>Services & Prix</Link>
          <Link to="/gallery" style={styles.link}>Galerie</Link>
          <Link to="/reviews" style={styles.link}>Avis</Link>
          <Link to="/contact" style={styles.link}>Contact</Link>
        </div>

        {/* Suivez-nous */}
        <div style={styles.col}>
          <h3 style={styles.title}>Suivez-nous</h3>

          <a
            href="https://www.instagram.com/nywaria/"
            target="_blank"
            rel="noreferrer"
            style={styles.social}
          >
            <FaInstagram size={18} color="#E91E63"/>
            Instagram
          </a>

          <a
            href="https://www.tiktok.com/"
            target="_blank"
            rel="noreferrer"
            style={styles.social}
          >
            <FaTiktok size={18} color="#E91E63" />
            TikTok
          </a>

          <a
            href="mailto:info.nywaria@gmail.com"
            style={styles.social}
          >
            <FaEnvelope size={18} color="#E91E63"/>
            Email
          </a>
        </div>
      </div>

      <div style={styles.bottom}>
        © {year} Nywaria — Tous droits réservés.
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    borderRadius: "10px",
    background: "#111111",
    color: "white",
    paddingTop: "40px",
    marginTop: "60px",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 clamp(12px, 4vw, 20px) 40px",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "clamp(20px, 4vw, 40px)",
  },
  col: {
    flex: "1 1 220px",
    minWidth: 0,
  },
  brand: {
    fontSize: "clamp(1.2rem, 2.4vw, 1.375rem)",
    fontWeight: 900,
    marginBottom: "10px",
    color: "#E91E63",
  },
  text: {
    color: "#cccccc",
    lineHeight: 1.6,
    marginBottom: "20px",
    fontSize: "clamp(0.85rem, 1.8vw, 0.9rem)",
  },
  title: {
    fontSize: "clamp(0.95rem, 1.8vw, 1rem)",
    fontWeight: 700,
    marginBottom: "12px",
  },
  link: {
    display: "block",
    textDecoration: "none",
    color: "#cccccc",
    marginBottom: "8px",
    fontSize: "clamp(0.85rem, 1.8vw, 0.9rem)",
  },
  social: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    color: "#cccccc",
    marginBottom: "12px",
    fontSize: "clamp(0.85rem, 1.8vw, 0.9rem)",
  },
  cta: {
    display: "inline-block",
    background: "#E91E63",
    color: "white",
    padding: "clamp(8px, 1.8vw, 10px) clamp(14px, 2.4vw, 18px)",
    borderRadius: "25px",
    fontWeight: 700,
    textDecoration: "none",
    fontSize: "clamp(0.85rem, 1.8vw, 0.9rem)",
  },
  bottom: {
    borderTop: "1px solid #222",
    textAlign: "center",
    padding: "15px",
    fontSize: "13px",
    color: "#888",
  },
};
