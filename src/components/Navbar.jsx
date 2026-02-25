import { Link, NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  textDecoration: "none",
  padding: "10px 12px",
  borderRadius: "10px",
  fontWeight: 600,
  color: isActive ? "white" : "#111",
  background: isActive ? "#111" : "transparent",
});

export default function Navbar() {
  return (
    <header style={{ borderBottom: "1px solid #eee" }}>
      <nav
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "#111" }}>
          <div style={{ fontSize: 18, fontWeight: 900 }}>StyledByNY</div>
          <div style={{ fontSize: 12, color: "#666" }}>Gatineau • Ottawa</div>
        </Link>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <NavLink to="/services" style={linkStyle}>Services</NavLink>
          <NavLink to="/gallery" style={linkStyle}>Galerie</NavLink>
          <NavLink to="/reviews" style={linkStyle}>Avis</NavLink>
          <NavLink to="/booking" style={linkStyle}>Réserver</NavLink>
          <NavLink to="/contact" style={linkStyle}>Contact</NavLink>
        </div>
      </nav>
    </header>
  );
}