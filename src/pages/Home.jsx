import { useEffect, useMemo, useState } from "react";
import BookingModal, { INITIAL_BOOKING_FORM } from "../components/site/BookingModal";
import {
  BookingPanel,
  Hero,
  PublicSections,
  SectionNav,
  TopBar,
} from "../components/site/PublicSections";
import { api } from "../lib/api";
import { getLocalDateString } from "../utils/format";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [preferredStaffId, setPreferredStaffId] = useState("");
  const [availabilityDays, setAvailabilityDays] = useState([]);
  const [availabilityState, setAvailabilityState] = useState({
    loading: false,
    error: "",
    slots: [],
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingForm, setBookingForm] = useState(INITIAL_BOOKING_FORM);
  const [bookingState, setBookingState] = useState({
    loading: false,
    error: false,
    message: "",
  });
  const [portfolioExpanded, setPortfolioExpanded] = useState(false);
  const [reviewsExpanded, setReviewsExpanded] = useState(false);

  useEffect(() => {
    let active = true;

    api
      .getBootstrap()
      .then((response) => {
        if (!active) {
          return;
        }
        setData(response);
      })
      .catch((loadError) => {
        if (!active) {
          return;
        }
        setError(loadError.message);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!data) {
      return;
    }

    if (!activeCategoryId) {
      setActiveCategoryId(data.categories[0]?.id || "");
    }

    if (!selectedServiceId) {
      const service = data.services.find((entry) => entry.featured) || data.services[0];
      setSelectedServiceId(service?.id || "");
    }
  }, [activeCategoryId, data, selectedServiceId]);

  const selectedService = useMemo(
    () => data?.services.find((service) => service.id === selectedServiceId) || data?.services[0],
    [data, selectedServiceId],
  );

  const visibleServices = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.services.filter((service) =>
      activeCategoryId === "featured" ? service.featured : service.categoryId === activeCategoryId,
    );
  }, [activeCategoryId, data]);

  const visiblePortfolio = useMemo(
    () => (portfolioExpanded ? data?.portfolio || [] : (data?.portfolio || []).slice(0, 5)),
    [data, portfolioExpanded],
  );

  const visibleReviews = useMemo(
    () => (reviewsExpanded ? data?.reviews || [] : (data?.reviews || []).slice(0, 3)),
    [data, reviewsExpanded],
  );

  useEffect(() => {
    if (!isBookingOpen || !selectedService) {
      return;
    }

    let active = true;

    api
      .getAvailabilityRange(
        selectedService.id,
        getLocalDateString(),
        Math.min(10, data?.settings?.bookingWindowDays || 10),
        preferredStaffId,
      )
      .then((response) => {
        if (!active) {
          return;
        }
        setAvailabilityDays(response.days);
        const firstDate = response.days.find((day) => day.slotCount > 0)?.date || response.days[0]?.date || "";
        setSelectedDate((current) =>
          current && response.days.some((day) => day.date === current) ? current : firstDate,
        );
      })
      .catch((availabilityError) => {
        if (!active) {
          return;
        }
        setAvailabilityDays([]);
        setAvailabilityState((current) => ({ ...current, error: availabilityError.message }));
      });

    return () => {
      active = false;
    };
  }, [data?.settings?.bookingWindowDays, isBookingOpen, preferredStaffId, selectedService]);

  useEffect(() => {
    if (!isBookingOpen || !selectedService || !selectedDate) {
      return;
    }

    let active = true;
    setAvailabilityState({
      loading: true,
      error: "",
      slots: [],
    });

    api
      .getAvailability(selectedService.id, selectedDate, preferredStaffId)
      .then((response) => {
        if (!active) {
          return;
        }
        setAvailabilityState({
          loading: false,
          error: "",
          slots: response.slots || [],
        });
      })
      .catch((availabilityError) => {
        if (!active) {
          return;
        }
        setAvailabilityState({
          loading: false,
          error: availabilityError.message,
          slots: [],
        });
      });

    return () => {
      active = false;
    };
  }, [isBookingOpen, preferredStaffId, selectedDate, selectedService]);

  function openBooking(serviceId = "") {
    if (serviceId) {
      setSelectedServiceId(serviceId);
    }
    setPreferredStaffId("");
    setSelectedSlot(null);
    setBookingState({ loading: false, error: false, message: "" });
    setIsBookingOpen(true);
  }

  async function refreshBootstrap() {
    const response = await api.getBootstrap();
    setData(response);
  }

  async function handleBookingSubmit(event) {
    event.preventDefault();

    if (!selectedService || !selectedDate || !selectedSlot) {
      setBookingState({
        loading: false,
        error: true,
        message: "Choisis d'abord un jour et une heure disponibles.",
      });
      return;
    }

    try {
      setBookingState({ loading: true, error: false, message: "" });
      const response = await api.createBooking({
        serviceId: selectedService.id,
        staffId: preferredStaffId,
        date: selectedDate,
        time: selectedSlot.time,
        customer: {
          name: bookingForm.name,
          phone: bookingForm.phone,
          email: bookingForm.email,
          instagram: bookingForm.instagram,
        },
        notes: bookingForm.notes,
      });

      setBookingForm(INITIAL_BOOKING_FORM);
      setSelectedSlot(null);
      setBookingState({
        loading: false,
        error: false,
        message: `Reservation confirmee pour ${response.confirmation.date} a ${response.confirmation.time}.`,
      });
      await refreshBootstrap();
    } catch (submitError) {
      setBookingState({
        loading: false,
        error: true,
        message: submitError.message,
      });
    }
  }

  if (loading) {
    return <div className="screen-state"><div className="loader-card"><p>Chargement du studio...</p></div></div>;
  }

  if (error || !data) {
    return <div className="screen-state"><div className="loader-card"><p>{error || "Impossible de charger l'application."}</p></div></div>;
  }

  return (
    <>
      <div className="site-shell">
        <TopBar brandName={data.site.brandName} city={data.site.city} onBook={openBooking} selectedServiceId={selectedService?.id} />
        <main className="listing-page">
          <Hero data={data} onBook={openBooking} selectedServiceId={selectedService?.id} />
          <section className="listing-layout">
            <div className="listing-main">
              <SectionNav />
              <PublicSections
                data={data}
                activeCategoryId={activeCategoryId}
                setActiveCategoryId={setActiveCategoryId}
                visibleServices={visibleServices}
                visiblePortfolio={visiblePortfolio}
                visibleReviews={visibleReviews}
                portfolioExpanded={portfolioExpanded}
                setPortfolioExpanded={setPortfolioExpanded}
                reviewsExpanded={reviewsExpanded}
                setReviewsExpanded={setReviewsExpanded}
                onBook={openBooking}
              />
            </div>

            <BookingPanel
              site={data.site}
              openStatus={data.openStatus}
              nextAvailability={data.nextAvailability}
              currency={data.settings.currency}
              selectedService={selectedService}
              onBook={openBooking}
            />
          </section>
        </main>

        <footer className="site-footer">
          <div>
            <strong>{data.site.brandName}</strong>
            <p>{data.site.tagline}</p>
          </div>
          <div>
            <span>{data.site.city}</span>
            <span>{data.metrics.formattedRevenue} deja encaisses sur les visites finalisees</span>
          </div>
        </footer>

        <button className="floating-booking" type="button" onClick={() => openBooking(selectedService?.id)}>
          {data.site.heroPrimaryCta}
        </button>
      </div>

      <BookingModal
        open={isBookingOpen}
        data={data}
        selectedServiceId={selectedServiceId}
        setSelectedServiceId={setSelectedServiceId}
        preferredStaffId={preferredStaffId}
        setPreferredStaffId={setPreferredStaffId}
        availabilityDays={availabilityDays}
        availabilityState={availabilityState}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedSlot={selectedSlot}
        setSelectedSlot={setSelectedSlot}
        bookingForm={bookingForm}
        setBookingForm={setBookingForm}
        bookingState={bookingState}
        onClose={() => setIsBookingOpen(false)}
        onSubmit={handleBookingSubmit}
      />
    </>
  );
}
