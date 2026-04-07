export default function CatalogTab({
  draft,
  addArrayItem,
  removeArrayItem,
  updateArrayItem,
  replaceArrayItem,
  newCategory,
  newService,
  newStaff,
}) {
  return (
    <section className="admin-section">
      <div className="admin-card">
        <div className="admin-card__header">
          <h2>Categories</h2>
          <button className="button button--ghost" type="button" onClick={() => addArrayItem("categories", newCategory)}>
            Ajouter
          </button>
        </div>
        <div className="admin-list">
          {draft.categories.map((category, index) => (
            <article key={`${category.id || "new"}-${index}`} className="editor-card">
              <div className="field-grid">
                <label className="field"><span>Nom</span><input value={category.name} onChange={(event) => updateArrayItem("categories", index, "name", event.target.value)} /></label>
                <label className="field"><span>Description</span><input value={category.description} onChange={(event) => updateArrayItem("categories", index, "description", event.target.value)} /></label>
              </div>
              <button className="button button--ghost" type="button" onClick={() => removeArrayItem("categories", index)}>Supprimer</button>
            </article>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__header">
          <h2>Equipe</h2>
          <button className="button button--ghost" type="button" onClick={() => addArrayItem("staff", newStaff)}>
            Ajouter
          </button>
        </div>
        <div className="admin-list">
          {draft.staff.map((member, index) => (
            <article key={`${member.id || "new"}-${index}`} className="editor-card">
              <div className="field-grid">
                <label className="field"><span>Nom</span><input value={member.name} onChange={(event) => updateArrayItem("staff", index, "name", event.target.value)} /></label>
                <label className="field"><span>Role</span><input value={member.role} onChange={(event) => updateArrayItem("staff", index, "role", event.target.value)} /></label>
                <label className="field"><span>Initiales</span><input value={member.initials} onChange={(event) => updateArrayItem("staff", index, "initials", event.target.value)} /></label>
                <label className="field"><span>Note</span><input type="number" step="0.1" value={member.rating} onChange={(event) => updateArrayItem("staff", index, "rating", Number(event.target.value))} /></label>
              </div>
              <label className="field"><span>Bio</span><textarea rows="3" value={member.bio} onChange={(event) => updateArrayItem("staff", index, "bio", event.target.value)} /></label>
              <label><input type="checkbox" checked={member.active} onChange={(event) => updateArrayItem("staff", index, "active", event.target.checked)} /> Actif</label>
              <button className="button button--ghost" type="button" onClick={() => removeArrayItem("staff", index)}>Supprimer</button>
            </article>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__header">
          <h2>Services</h2>
          <button className="button button--ghost" type="button" onClick={() => addArrayItem("services", newService)}>
            Ajouter
          </button>
        </div>
        <div className="admin-list">
          {draft.services.map((service, index) => (
            <article key={`${service.id || "new"}-${index}`} className="editor-card">
              <div className="field-grid">
                <label className="field"><span>Nom</span><input value={service.name} onChange={(event) => updateArrayItem("services", index, "name", event.target.value)} /></label>
                <label className="field">
                  <span>Categorie</span>
                  <select value={service.categoryId} onChange={(event) => updateArrayItem("services", index, "categoryId", event.target.value)}>
                    <option value="">Selectionner</option>
                    {draft.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                </label>
                <label className="field"><span>Duree</span><input type="number" value={service.durationMinutes} onChange={(event) => updateArrayItem("services", index, "durationMinutes", Number(event.target.value))} /></label>
                <label className="field"><span>Prix</span><input type="number" value={service.price} onChange={(event) => updateArrayItem("services", index, "price", Number(event.target.value))} /></label>
              </div>
              <label className="field"><span>Description</span><textarea rows="3" value={service.description} onChange={(event) => updateArrayItem("services", index, "description", event.target.value)} /></label>
              <div className="checkbox-group">
                {draft.staff.map((member) => (
                  <label key={member.id}>
                    <input
                      type="checkbox"
                      checked={service.staffIds.includes(member.id)}
                      onChange={(event) => {
                        const nextStaffIds = event.target.checked
                          ? [...service.staffIds, member.id]
                          : service.staffIds.filter((staffId) => staffId !== member.id);
                        replaceArrayItem("services", index, { ...service, staffIds: nextStaffIds });
                      }}
                    />
                    {member.name}
                  </label>
                ))}
              </div>
              <label><input type="checkbox" checked={service.featured} onChange={(event) => updateArrayItem("services", index, "featured", event.target.checked)} /> Mettre en avant</label>
              <label><input type="checkbox" checked={service.active} onChange={(event) => updateArrayItem("services", index, "active", event.target.checked)} /> Actif</label>
              <button className="button button--ghost" type="button" onClick={() => removeArrayItem("services", index)}>Supprimer</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
