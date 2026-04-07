import { formatCurrency } from "../../../utils/format";
import { Metric } from "./shared";

export default function OverviewTab({ draft }) {
  const upcomingBookings = draft.bookings.filter((booking) =>
    ["pending", "confirmed"].includes(booking.status),
  );

  return (
    <section className="admin-section">
      <div className="admin-grid admin-grid--metrics">
        <Metric label="Avis moyens" value={draft.metrics.averageRating.toFixed(1)} help="Note moyenne publique" />
        <Metric label="Rendez-vous a venir" value={draft.metrics.upcomingBookings} help="Pending + confirmed" />
        <Metric label="Clients recurrents" value={draft.metrics.returningClients} help="Plus d'une visite ou reservation" />
        <Metric
          label="Revenu finalise"
          value={formatCurrency(draft.metrics.totalRevenue, draft.settings.currency)}
          help="Visites marquees completed"
        />
      </div>

      <div className="admin-card">
        <h2>Etat du studio</h2>
        <p>{draft.openStatus.label}</p>
        {draft.nextAvailability ? (
          <p>
            Prochain creneau: {draft.nextAvailability.date} a {draft.nextAvailability.time} pour {draft.nextAvailability.serviceName}
          </p>
        ) : null}
      </div>

      <div className="admin-card">
        <h2>Rendez-vous a venir</h2>
        <div className="admin-list">
          {upcomingBookings.map((booking) => (
            <article key={booking.id} className="booking-admin-card">
              <div>
                <strong>{booking.customer.name}</strong>
                <p>{booking.serviceName}</p>
                <p>{booking.date} - {booking.time} avec {booking.staffName}</p>
              </div>
              <div className="booking-status">{booking.status}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
