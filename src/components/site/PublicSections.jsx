import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiPhone,
  FiShield,
  FiStar,
} from "react-icons/fi";
import {
  formatCurrency,
  formatDayLabel,
  formatHoursBlock,
  formatReviewDate,
  getStars,
  smoothScrollTo,
} from "../../utils/format";

export const SECTION_LINKS = [
  { id: "prestations", label: "Prestations" },
  { id: "equipe", label: "Equipe" },
  { id: "avis", label: "Avis" },
  { id: "portfolio", label: "Portfolio" },
  { id: "infos", label: "Infos" },
];

function ServiceCard({ service, categoryName, currency, onBook, staff }) {
  return (
    <article className="service-card">
      <div className="service-card__copy">
        <div className="service-card__eyebrow">{categoryName}</div>
        <h3>{service.name}</h3>
        <p>{service.description}</p>
        <div className="service-card__meta">
          <span>{service.durationMinutes} min</span>
          <span>{formatCurrency(service.price, currency)}</span>
          <span>{staff.map((member) => member.name).join(" · ")}</span>
        </div>
      </div>

      <button className="button button--ghost" type="button" onClick={() => onBook(service.id)}>
        Reserver
      </button>
    </article>
  );
}

function TeamCard({ member }) {
  return (
    <article className="team-card">
      <div className="team-card__avatar" aria-hidden="true">
        {member.initials || member.name.slice(0, 2).toUpperCase()}
      </div>
      <div className="team-card__rating">
        <FiStar />
        <span>{member.rating.toFixed(1)}</span>
      </div>
      <h3>{member.name}</h3>
      <p className="team-card__role">{member.role}</p>
      <p className="team-card__bio">{member.bio}</p>
    </article>
  );
}

function ReviewCard({ review }) {
  return (
    <article className="review-card">
      <div className="review-card__top">
        <div>
          <h3>{review.author}</h3>
          <p>{formatReviewDate(review.createdAt)}</p>
        </div>
        <div className="review-card__stars" aria-label={`Note ${review.rating} sur 5`}>
          {getStars(review.rating).map((filled, index) => (
            <FiStar key={`${review.id}-${index}`} className={filled ? "is-filled" : ""} />
          ))}
        </div>
      </div>
      <p>{review.comment}</p>
    </article>
  );
}

export function TopBar({ brandName, city, onBook, selectedServiceId }) {
  return (
    <header className="topbar">
      <button className="brand-mark" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <img src="/media/logo.png" alt={brandName} />
        <div>
          <p>{brandName}</p>
          <small>{city}</small>
        </div>
      </button>

      <nav className="topbar__nav" aria-label="Sections">
        {SECTION_LINKS.map((link) => (
          <button key={link.id} type="button" onClick={() => smoothScrollTo(link.id)}>
            {link.label}
          </button>
        ))}
      </nav>

      <div className="topbar__actions">
        <Link className="button button--ghost" to="/admin">
          Admin
        </Link>
        <button className="button button--primary" type="button" onClick={() => onBook(selectedServiceId)}>
          Reserver
        </button>
      </div>
    </header>
  );
}

export function Hero({ data, onBook, selectedServiceId }) {
  return (
    <section className="hero">
      <div className="hero__copy">
        <div className="eyebrow eyebrow--row">
          <span>Studio premium</span>
          <span>Booking temps reel</span>
          <span>{data.site.city}</span>
        </div>

        <h1>{data.site.headline}</h1>
        <p>{data.site.subheadline}</p>

        <div className="hero__meta">
          <div>
            <FiStar />
            <span>{data.metrics.averageRating.toFixed(1)} / 5</span>
          </div>
          <div>
            <FiShield />
            <span>{data.metrics.reviewCount} avis verifies</span>
          </div>
          <div>
            <FiCalendar />
            <span>{data.metrics.upcomingBookings} rendez-vous a venir</span>
          </div>
        </div>

        <div className="hero__actions">
          <button className="button button--primary" type="button" onClick={() => onBook(selectedServiceId)}>
            {data.site.heroPrimaryCta}
          </button>
          <button className="button button--ghost" type="button" onClick={() => smoothScrollTo("portfolio")}>
            {data.site.heroSecondaryCta}
          </button>
        </div>
      </div>

      <div className="hero__gallery">
        {data.portfolio.slice(0, 3).map((item, index) => (
          <figure key={item.id} className={`hero__gallery-item hero__gallery-item--${index + 1}`}>
            <img src={item.imageUrl} alt={item.title} />
            <figcaption>{item.title}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function SectionNav() {
  return (
    <nav className="section-nav" aria-label="Navigation secondaire">
      {SECTION_LINKS.map((link) => (
        <button key={link.id} type="button" onClick={() => smoothScrollTo(link.id)}>
          {link.label}
        </button>
      ))}
    </nav>
  );
}

export function BookingPanel({ site, openStatus, nextAvailability, currency, selectedService, onBook }) {
  return (
    <aside className="booking-panel">
      <div className="booking-panel__brand">
        <img src="/media/logo.png" alt={site.brandName} />
        <div>
          <p>{site.city}</p>
          <h2>{site.brandName}</h2>
        </div>
      </div>

      <button className="button button--primary button--wide" type="button" onClick={() => onBook(selectedService?.id)}>
        {site.heroPrimaryCta}
      </button>

      <div className="booking-panel__rows">
        <div className="booking-panel__row">
          <FiClock />
          <span>{openStatus?.label || "Horaires a definir"}</span>
        </div>
        <div className="booking-panel__row">
          <FiMapPin />
          <span>{site.addressLine1}</span>
        </div>
        {site.email ? (
          <a className="booking-panel__row booking-panel__row--link" href={`mailto:${site.email}`}>
            <FiMail />
            <span>{site.email}</span>
          </a>
        ) : null}
        {site.phone ? (
          <a className="booking-panel__row booking-panel__row--link" href={`tel:${site.phone}`}>
            <FiPhone />
            <span>{site.phone}</span>
          </a>
        ) : null}
      </div>

      {nextAvailability ? (
        <div className="booking-panel__next">
          <span>Prochain creneau</span>
          <strong>{`${formatDayLabel(nextAvailability.date)} a ${nextAvailability.time}`}</strong>
          <p>
            {nextAvailability.serviceName} avec {nextAvailability.staffName}
          </p>
        </div>
      ) : null}

      {selectedService ? (
        <div className="booking-panel__service">
          <p>Service suggere</p>
          <strong>{selectedService.name}</strong>
          <span>{selectedService.durationMinutes} min</span>
          <span>{formatCurrency(selectedService.price, currency)}</span>
        </div>
      ) : null}

      <button className="button button--ghost button--wide" type="button" onClick={() => smoothScrollTo("prestations")}>
        Voir les prestations
      </button>
    </aside>
  );
}

export function PublicSections({
  data,
  activeCategoryId,
  setActiveCategoryId,
  visibleServices,
  visiblePortfolio,
  visibleReviews,
  portfolioExpanded,
  setPortfolioExpanded,
  reviewsExpanded,
  setReviewsExpanded,
  onBook,
}) {
  return (
    <>
      <section className="content-section" id="prestations">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Catalogue</p>
            <h2>Prestations reservables maintenant</h2>
          </div>
          <p>Chaque service affiche sa vraie duree, son vrai prix et des creneaux calcules en direct.</p>
        </div>

        <div className="pill-row">
          {data.categories.map((category) => (
            <button
              key={category.id}
              className={`pill ${activeCategoryId === category.id ? "is-active" : ""}`}
              type="button"
              onClick={() => setActiveCategoryId(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="service-list">
          {visibleServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              categoryName={data.categories.find((category) => category.id === service.categoryId)?.name || "Prestation"}
              currency={data.settings.currency}
              staff={data.staff.filter((member) =>
                service.staffIds?.length ? service.staffIds.includes(member.id) : true,
              )}
              onBook={onBook}
            />
          ))}
        </div>
      </section>

      <section className="content-section" id="equipe">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Equipe</p>
            <h2>Des profils visibles avant de reserver</h2>
          </div>
          <p>Le back-office gere les membres de l'equipe, leurs fiches et les services qu'ils couvrent.</p>
        </div>

        <div className="team-grid">
          {data.staff.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      <section className="content-section" id="avis">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Preuve sociale</p>
            <h2>Avis recents</h2>
          </div>
          <button className="button button--ghost" type="button" onClick={() => setReviewsExpanded((value) => !value)}>
            {reviewsExpanded ? "Voir moins" : "Voir plus"}
          </button>
        </div>

        <div className="reviews-grid">
          {visibleReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      <section className="content-section" id="portfolio">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Portfolio</p>
            <h2>Resultats mis en avant</h2>
          </div>
          <button className="button button--ghost" type="button" onClick={() => setPortfolioExpanded((value) => !value)}>
            {portfolioExpanded ? "Voir moins" : "Voir plus"}
          </button>
        </div>

        <div className="portfolio-grid-modern">
          {visiblePortfolio.map((item, index) => (
            <figure key={item.id} className={`portfolio-item ${index === 0 ? "portfolio-item--featured" : ""}`}>
              <img src={item.imageUrl} alt={item.title} />
              <figcaption>
                <strong>{item.title}</strong>
                <span>{data.services.find((service) => service.id === item.serviceId)?.name || "Prestation"}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="content-section content-section--info" id="infos">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Informations</p>
            <h2>{data.site.aboutTitle}</h2>
          </div>
          <p>{data.site.aboutBody}</p>
        </div>

        <div className="info-grid">
          <article className="info-card">
            <div className="info-card__icon">
              <FiMapPin />
            </div>
            <h3>{data.site.addressTitle}</h3>
            <p>{data.site.addressLine1}</p>
            <p>{data.site.addressLine2}</p>
          </article>

          <article className="info-card">
            <div className="info-card__icon">
              <FiClock />
            </div>
            <h3>Horaires d'ouverture</h3>
            <div className="hours-list">
              {Object.entries(data.openingHours).map(([dayKey, config]) => (
                <div key={dayKey}>{formatHoursBlock(dayKey, config)}</div>
              ))}
            </div>
          </article>

          <article className="info-card">
            <div className="info-card__icon">
              <FiArrowRight />
            </div>
            <h3>Contact rapide</h3>
            <div className="contact-links">
              {data.site.email ? (
                <a href={`mailto:${data.site.email}`}>
                  <FiMail />
                  <span>{data.site.email}</span>
                </a>
              ) : null}
              {data.site.instagram ? (
                <a href={data.site.instagram} target="_blank" rel="noreferrer">
                  <FiInstagram />
                  <span>Instagram</span>
                </a>
              ) : null}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
