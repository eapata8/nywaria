import { FaInstagram, FaTiktok, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Marque */}
        <div>
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
        <div>
          <h3 style={styles.title}>Navigation</h3>
          <a href="/" style={styles.link}>Accueil</a>
          <a href="/services" style={styles.link}>Services & Prix</a>
          <a href="/gallery" style={styles.link}>Galerie</a>
          <a href="/reviews" style={styles.link}>Avis</a>
          <a href="/contact" style={styles.link}>Contact</a>
        </div>

        {/* Suivez-nous */}
        <div>
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
    background: "#111111",
    color: "white",
    paddingTop: "40px",
    marginTop: "60px",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 20px 40px 20px",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "40px",
  },
  brand: {
    fontSize: "22px",
    fontWeight: 900,
    marginBottom: "10px",
    color: "#E91E63",
  },
  text: {
    color: "#cccccc",
    lineHeight: 1.6,
    marginBottom: "20px",
    fontSize: "14px",
  },
  title: {
    fontSize: "16px",
    fontWeight: 700,
    marginBottom: "12px",
  },
  link: {
    display: "block",
    textDecoration: "none",
    color: "#cccccc",
    marginBottom: "8px",
    fontSize: "14px",
  },
  social: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    color: "#cccccc",
    marginBottom: "12px",
    fontSize: "14px",
  },
  cta: {
    display: "inline-block",
    background: "#E91E63",
    color: "white",
    padding: "10px 18px",
    borderRadius: "25px",
    fontWeight: 700,
    textDecoration: "none",
    fontSize: "14px",
  },
  bottom: {
    borderTop: "1px solid #222",
    textAlign: "center",
    padding: "15px",
    fontSize: "13px",
    color: "#888",
  },
};