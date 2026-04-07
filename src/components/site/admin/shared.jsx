import { Link } from "react-router-dom";

export const TABS = [
  { id: "overview", label: "Apercu" },
  { id: "bookings", label: "Rendez-vous" },
  { id: "availability", label: "Disponibilites" },
  { id: "catalog", label: "Catalogue" },
  { id: "content", label: "Vitrine" },
];

export function Metric({ label, value, help }) {
  return (
    <article className="admin-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{help}</p>
    </article>
  );
}

export function AdminTopbar({ brandName, saving, onSave, onLogout }) {
  return (
    <header className="admin-topbar">
      <div>
        <p className="eyebrow">Admin</p>
        <h1>{brandName}</h1>
      </div>
      <div className="admin-topbar__actions">
        <Link className="button button--ghost" to="/">
          Voir le site
        </Link>
        <button className="button button--primary" type="button" onClick={onSave} disabled={saving}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
        <button className="button button--ghost" type="button" onClick={onLogout}>
          Deconnexion
        </button>
      </div>
    </header>
  );
}
