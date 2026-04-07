import { FiCalendar } from "react-icons/fi";
import { formatCurrency, formatDayLabel } from "../../utils/format";

export const INITIAL_BOOKING_FORM = {
  name: "",
  phone: "",
  email: "",
  instagram: "",
  notes: "",
};

export default function BookingModal({
  open,
  data,
  selectedServiceId,
  setSelectedServiceId,
  preferredStaffId,
  setPreferredStaffId,
  availabilityDays,
  availabilityState,
  selectedDate,
  setSelectedDate,
  selectedSlot,
  setSelectedSlot,
  bookingForm,
  setBookingForm,
  bookingState,
  onClose,
  onSubmit,
}) {
  if (!open || !data) {
    return null;
  }

  const selectedService = data.services.find((service) => service.id === selectedServiceId) || data.services[0];
  const selectedCategory = data.categories.find((category) => category.id === selectedService?.categoryId);
  const eligibleStaff = data.staff.filter((member) =>
    selectedService?.staffIds?.length ? selectedService.staffIds.includes(member.id) : true,
  );

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="booking-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <header className="booking-modal__header">
          <div>
            <p className="eyebrow">Reservation en ligne</p>
            <h2>{data.site.bookingPanelTitle}</h2>
          </div>
          <button className="button button--ghost" type="button" onClick={onClose}>
            Fermer
          </button>
        </header>

        <div className="booking-modal__grid">
          <div className="booking-modal__summary">
            <div className="booking-summary-card">
              <p>{selectedCategory?.name || "Prestation"}</p>
              <h3>{selectedService?.name}</h3>
              <span>{selectedService?.durationMinutes} min</span>
              <strong>{formatCurrency(selectedService?.price, data.settings.currency)}</strong>
            </div>

            <label className="field">
              <span>Prestation</span>
              <select
                value={selectedServiceId}
                onChange={(event) => {
                  setSelectedServiceId(event.target.value);
                  setPreferredStaffId("");
                  setSelectedSlot(null);
                }}
              >
                {data.services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Equipe</span>
              <select
                value={preferredStaffId}
                onChange={(event) => {
                  setPreferredStaffId(event.target.value);
                  setSelectedSlot(null);
                }}
              >
                <option value="">Premiere disponibilite</option>
                {eligibleStaff.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} - {member.role}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="booking-modal__content">
            <div className="booking-step">
              <div className="booking-step__header">
                <div>
                  <span>1</span>
                  <strong>Choisis un jour</strong>
                </div>
                <p>Les dates affichent uniquement les vrais creneaux calcules par le backend.</p>
              </div>

              <div className="date-grid">
                {availabilityDays.map((day) => (
                  <button
                    key={day.date}
                    className={`date-chip ${selectedDate === day.date ? "is-active" : ""}`}
                    type="button"
                    onClick={() => {
                      setSelectedDate(day.date);
                      setSelectedSlot(null);
                    }}
                  >
                    <span>{formatDayLabel(day.date)}</span>
                    <strong>{day.slotCount ? `${day.slotCount} dispo` : "Complet"}</strong>
                  </button>
                ))}
              </div>
            </div>

            <div className="booking-step">
              <div className="booking-step__header">
                <div>
                  <span>2</span>
                  <strong>Choisis l'heure</strong>
                </div>
                {availabilityState.loading ? <p>Chargement des creneaux...</p> : null}
                {availabilityState.error ? <p>{availabilityState.error}</p> : null}
              </div>

              <div className="time-grid">
                {availabilityState.slots.map((slot) => (
                  <button
                    key={`${slot.time}-${slot.staffId}`}
                    className={`time-chip ${
                      selectedSlot?.time === slot.time && selectedSlot?.staffId === slot.staffId
                        ? "is-active"
                        : ""
                    }`}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <strong>{slot.time}</strong>
                    <span>{slot.staffName}</span>
                  </button>
                ))}

                {!availabilityState.loading && !availabilityState.slots.length ? (
                  <div className="empty-state compact">
                    Aucun creneau libre pour ce jour. Essaie une autre date ou une autre personne.
                  </div>
                ) : null}
              </div>
            </div>

            <form className="booking-form" onSubmit={onSubmit}>
              <div className="booking-step__header">
                <div>
                  <span>3</span>
                  <strong>Confirme tes informations</strong>
                </div>
                <p>Le systeme bloque automatiquement le creneau choisi a l'envoi.</p>
              </div>

              <div className="field-grid">
                <label className="field">
                  <span>Nom complet</span>
                  <input
                    value={bookingForm.name}
                    onChange={(event) =>
                      setBookingForm((current) => ({ ...current, name: event.target.value }))
                    }
                    placeholder="Ton nom"
                    required
                  />
                </label>

                <label className="field">
                  <span>Telephone</span>
                  <input
                    value={bookingForm.phone}
                    onChange={(event) =>
                      setBookingForm((current) => ({ ...current, phone: event.target.value }))
                    }
                    placeholder="Ton numero"
                    required
                  />
                </label>

                <label className="field">
                  <span>Email</span>
                  <input
                    value={bookingForm.email}
                    onChange={(event) =>
                      setBookingForm((current) => ({ ...current, email: event.target.value }))
                    }
                    placeholder="nom@email.com"
                    type="email"
                  />
                </label>

                <label className="field">
                  <span>Instagram</span>
                  <input
                    value={bookingForm.instagram}
                    onChange={(event) =>
                      setBookingForm((current) => ({ ...current, instagram: event.target.value }))
                    }
                    placeholder="@pseudo"
                  />
                </label>
              </div>

              <label className="field">
                <span>Notes</span>
                <textarea
                  rows="4"
                  value={bookingForm.notes}
                  onChange={(event) =>
                    setBookingForm((current) => ({ ...current, notes: event.target.value }))
                  }
                  placeholder="Longueur, inspiration, sensibilites, contraintes..."
                />
              </label>

              {selectedSlot ? (
                <div className="booking-confirmation">
                  <FiCalendar />
                  <div>
                    <strong>{`${selectedService?.name} - ${formatDayLabel(selectedDate)} a ${selectedSlot.time}`}</strong>
                    <p>Affectation actuelle: {selectedSlot.staffName}</p>
                  </div>
                </div>
              ) : null}

              {bookingState.message ? (
                <div className={`form-message ${bookingState.error ? "is-error" : "is-success"}`}>
                  {bookingState.message}
                </div>
              ) : null}

              <button className="button button--primary button--wide" type="submit" disabled={bookingState.loading}>
                {bookingState.loading ? "Reservation en cours..." : "Confirmer la reservation"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
