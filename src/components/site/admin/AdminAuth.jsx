import { Link } from "react-router-dom";

export default function AdminAuth({ pin, setPin, loginError, onSubmit }) {
  return (
    <div className="admin-auth">
      <form className="admin-auth__card" onSubmit={onSubmit}>
        <p className="eyebrow">Espace admin</p>
        <h1>Gerer le studio</h1>
        <p>Code par defaut: 2407. Tu pourras le modifier ensuite dans les reglages.</p>

        <label className="field">
          <span>Code admin</span>
          <input value={pin} onChange={(event) => setPin(event.target.value)} placeholder="2407" />
        </label>

        {loginError ? <div className="form-message is-error">{loginError}</div> : null}

        <button className="button button--primary button--wide" type="submit">
          Ouvrir l'admin
        </button>
        <Link className="button button--ghost button--wide" to="/">
          Retour au site
        </Link>
      </form>
    </div>
  );
}
