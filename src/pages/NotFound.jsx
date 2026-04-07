import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="screen-state">
      <div className="loader-card">
        <h1>404</h1>
        <p>La page demandee n'existe pas.</p>
        <Link className="button button--primary" to="/">
          Retour au site
        </Link>
      </div>
    </div>
  );
}
