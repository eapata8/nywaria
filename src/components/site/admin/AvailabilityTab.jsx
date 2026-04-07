export default function AvailabilityTab({
  draft,
  addArrayItem,
  removeArrayItem,
  updateArrayItem,
  updateOpeningHours,
  updateBreak,
  newBlackoutPeriod,
  updateRootField,
}) {
  return (
    <section className="admin-section">
      <div className="admin-card">
        <h2>Reglages de reservation</h2>
        <div className="field-grid">
          <label className="field">
            <span>Intervalle des slots</span>
            <input
              type="number"
              value={draft.settings.slotIntervalMinutes}
              onChange={(event) => updateRootField("settings", "slotIntervalMinutes", Number(event.target.value))}
            />
          </label>
          <label className="field">
            <span>Fenetre de reservation</span>
            <input
              type="number"
              value={draft.settings.bookingWindowDays}
              onChange={(event) => updateRootField("settings", "bookingWindowDays", Number(event.target.value))}
            />
          </label>
          <label className="field">
            <span>Delai minimum en minutes</span>
            <input
              type="number"
              value={draft.settings.bookingLeadMinutes}
              onChange={(event) => updateRootField("settings", "bookingLeadMinutes", Number(event.target.value))}
            />
          </label>
          <label className="field">
            <span>Code admin</span>
            <input value={draft.settings.adminPin} onChange={(event) => updateRootField("settings", "adminPin", event.target.value)} />
          </label>
        </div>
      </div>

      <div className="admin-card">
        <h2>Heures d'ouverture</h2>
        <div className="hours-admin-list">
          {Object.entries(draft.openingHours).map(([dayKey, config]) => (
            <div key={dayKey} className="hours-admin-row">
              <strong>{dayKey}</strong>
              <label>
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={(event) => updateOpeningHours(dayKey, "enabled", event.target.checked)}
                />
                Ouvert
              </label>
              <input type="time" value={config.open} onChange={(event) => updateOpeningHours(dayKey, "open", event.target.value)} />
              <input type="time" value={config.close} onChange={(event) => updateOpeningHours(dayKey, "close", event.target.value)} />
              <input
                type="time"
                value={config.breaks?.[0]?.start || "13:00"}
                onChange={(event) => updateBreak(dayKey, "start", event.target.value)}
              />
              <input
                type="time"
                value={config.breaks?.[0]?.end || "14:00"}
                onChange={(event) => updateBreak(dayKey, "end", event.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__header">
          <h2>Indisponibilites manuelles</h2>
          <button className="button button--ghost" type="button" onClick={() => addArrayItem("blackoutPeriods", newBlackoutPeriod)}>
            Ajouter
          </button>
        </div>
        <div className="admin-list">
          {draft.blackoutPeriods.map((period, index) => (
            <article key={`${period.id || "new"}-${index}`} className="editor-card">
              <div className="field-grid">
                <label className="field">
                  <span>Date</span>
                  <input type="date" value={period.date} onChange={(event) => updateArrayItem("blackoutPeriods", index, "date", event.target.value)} />
                </label>
                <label className="field">
                  <span>Debut</span>
                  <input type="time" value={period.start} onChange={(event) => updateArrayItem("blackoutPeriods", index, "start", event.target.value)} />
                </label>
                <label className="field">
                  <span>Fin</span>
                  <input type="time" value={period.end} onChange={(event) => updateArrayItem("blackoutPeriods", index, "end", event.target.value)} />
                </label>
                <label className="field">
                  <span>Motif</span>
                  <input value={period.label} onChange={(event) => updateArrayItem("blackoutPeriods", index, "label", event.target.value)} />
                </label>
              </div>
              <button className="button button--ghost" type="button" onClick={() => removeArrayItem("blackoutPeriods", index)}>
                Supprimer
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
