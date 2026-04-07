export default function BookingsTab({ draft, patchBooking, updateArrayItem }) {
  return (
    <section className="admin-section">
      <div className="admin-card">
        <h2>Rendez-vous</h2>
        <div className="admin-list">
          {draft.bookings.map((booking, index) => (
            <article key={booking.id} className="booking-admin-card booking-admin-card--full">
              <div className="booking-admin-card__main">
                <strong>{booking.customer.name}</strong>
                <p>{booking.serviceName} - {booking.date} a {booking.time}</p>
                <p>{booking.customer.phone} {booking.customer.email ? `- ${booking.customer.email}` : ""}</p>
                <p>Equipe: {booking.staffName} - Statut: {booking.status}</p>
                {booking.notes ? <p>Notes client: {booking.notes}</p> : null}
              </div>

              <div className="booking-admin-card__controls">
                <div className="pill-row">
                  {["pending", "confirmed", "completed", "cancelled"].map((status) => (
                    <button
                      key={status}
                      className={`pill ${booking.status === status ? "is-active" : ""}`}
                      type="button"
                      onClick={() => patchBooking(booking.id, { status, adminNotes: booking.adminNotes })}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <textarea
                  rows="3"
                  value={draft.bookings[index].adminNotes}
                  onChange={(event) => updateArrayItem("bookings", index, "adminNotes", event.target.value)}
                  placeholder="Notes internes"
                />

                <button
                  className="button button--ghost"
                  type="button"
                  onClick={() =>
                    patchBooking(booking.id, {
                      status: draft.bookings[index].status,
                      adminNotes: draft.bookings[index].adminNotes,
                    })
                  }
                >
                  Sauver la note
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h2>Clients</h2>
        <div className="customer-table">
          {draft.customers.map((customer) => (
            <article key={customer.id} className="customer-row">
              <div>
                <strong>{customer.name}</strong>
                <p>{customer.phone} {customer.email ? `- ${customer.email}` : ""}</p>
              </div>
              <div>
                <span>{customer.totalBookings} reservations</span>
                <span>{customer.completedBookings} visites</span>
              </div>
              <div>
                <span>{customer.favoriteServices.join(", ")}</span>
                <span>{customer.nextVisit || customer.lastVisit || "Aucune date"}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
