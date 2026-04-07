export default function ContentTab({
  draft,
  addArrayItem,
  removeArrayItem,
  updateArrayItem,
  updateRootField,
  newPortfolioItem,
  newReview,
}) {
  return (
    <section className="admin-section">
      <div className="admin-card">
        <h2>Contenu du site</h2>
        <div className="field-grid">
          <label className="field"><span>Nom</span><input value={draft.site.brandName} onChange={(event) => updateRootField("site", "brandName", event.target.value)} /></label>
          <label className="field"><span>Ville</span><input value={draft.site.city} onChange={(event) => updateRootField("site", "city", event.target.value)} /></label>
          <label className="field"><span>CTA principal</span><input value={draft.site.heroPrimaryCta} onChange={(event) => updateRootField("site", "heroPrimaryCta", event.target.value)} /></label>
          <label className="field"><span>CTA secondaire</span><input value={draft.site.heroSecondaryCta} onChange={(event) => updateRootField("site", "heroSecondaryCta", event.target.value)} /></label>
        </div>
        <label className="field"><span>Headline</span><textarea rows="3" value={draft.site.headline} onChange={(event) => updateRootField("site", "headline", event.target.value)} /></label>
        <label className="field"><span>Subheadline</span><textarea rows="3" value={draft.site.subheadline} onChange={(event) => updateRootField("site", "subheadline", event.target.value)} /></label>
        <label className="field"><span>A propos</span><textarea rows="4" value={draft.site.aboutBody} onChange={(event) => updateRootField("site", "aboutBody", event.target.value)} /></label>
        <div className="field-grid">
          <label className="field"><span>Email</span><input value={draft.site.email} onChange={(event) => updateRootField("site", "email", event.target.value)} /></label>
          <label className="field"><span>Instagram</span><input value={draft.site.instagram} onChange={(event) => updateRootField("site", "instagram", event.target.value)} /></label>
          <label className="field"><span>Adresse ligne 1</span><input value={draft.site.addressLine1} onChange={(event) => updateRootField("site", "addressLine1", event.target.value)} /></label>
          <label className="field"><span>Adresse ligne 2</span><input value={draft.site.addressLine2} onChange={(event) => updateRootField("site", "addressLine2", event.target.value)} /></label>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__header">
          <h2>Portfolio</h2>
          <button className="button button--ghost" type="button" onClick={() => addArrayItem("portfolio", newPortfolioItem)}>
            Ajouter
          </button>
        </div>
        <div className="admin-list">
          {draft.portfolio.map((item, index) => (
            <article key={`${item.id || "new"}-${index}`} className="editor-card">
              <div className="field-grid">
                <label className="field"><span>Titre</span><input value={item.title} onChange={(event) => updateArrayItem("portfolio", index, "title", event.target.value)} /></label>
                <label className="field"><span>Image</span><input value={item.imageUrl} onChange={(event) => updateArrayItem("portfolio", index, "imageUrl", event.target.value)} /></label>
                <label className="field">
                  <span>Service lie</span>
                  <select value={item.serviceId} onChange={(event) => updateArrayItem("portfolio", index, "serviceId", event.target.value)}>
                    <option value="">Aucun</option>
                    {draft.services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
                  </select>
                </label>
              </div>
              <label><input type="checkbox" checked={item.featured} onChange={(event) => updateArrayItem("portfolio", index, "featured", event.target.checked)} /> Mettre en avant</label>
              <button className="button button--ghost" type="button" onClick={() => removeArrayItem("portfolio", index)}>Supprimer</button>
            </article>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__header">
          <h2>Avis</h2>
          <button className="button button--ghost" type="button" onClick={() => addArrayItem("reviews", newReview)}>
            Ajouter
          </button>
        </div>
        <div className="admin-list">
          {draft.reviews.map((review, index) => (
            <article key={`${review.id || "new"}-${index}`} className="editor-card">
              <div className="field-grid">
                <label className="field"><span>Auteur</span><input value={review.author} onChange={(event) => updateArrayItem("reviews", index, "author", event.target.value)} /></label>
                <label className="field"><span>Note</span><input type="number" step="0.1" value={review.rating} onChange={(event) => updateArrayItem("reviews", index, "rating", Number(event.target.value))} /></label>
              </div>
              <label className="field"><span>Commentaire</span><textarea rows="3" value={review.comment} onChange={(event) => updateArrayItem("reviews", index, "comment", event.target.value)} /></label>
              <button className="button button--ghost" type="button" onClick={() => removeArrayItem("reviews", index)}>Supprimer</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
