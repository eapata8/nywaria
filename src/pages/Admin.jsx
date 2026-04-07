import { useEffect, useState } from "react";
import AdminAuth from "../components/site/admin/AdminAuth";
import AvailabilityTab from "../components/site/admin/AvailabilityTab";
import BookingsTab from "../components/site/admin/BookingsTab";
import CatalogTab from "../components/site/admin/CatalogTab";
import ContentTab from "../components/site/admin/ContentTab";
import OverviewTab from "../components/site/admin/OverviewTab";
import { AdminTopbar, TABS } from "../components/site/admin/shared";
import { api } from "../lib/api";

const STORAGE_KEY = "nywaria-admin-token";

function extractEditableData(data) {
  return {
    site: data.site,
    settings: data.settings,
    categories: data.categories,
    staff: data.staff,
    services: data.services,
    portfolio: data.portfolio,
    reviews: data.reviews,
    openingHours: data.openingHours,
    blackoutPeriods: data.blackoutPeriods,
  };
}

const newCategory = () => ({ id: "", name: "", description: "" });
const newStaff = () => ({ id: "", name: "", role: "", bio: "", rating: 5, reviewCount: 0, initials: "", active: true });
const newService = () => ({ id: "", categoryId: "", name: "", description: "", durationMinutes: 60, price: 0, featured: false, active: true, staffIds: [] });
const newPortfolioItem = () => ({ id: "", title: "", imageUrl: "/media/gallery1.png", serviceId: "", featured: false });
const newReview = () => ({ id: "", author: "", rating: 5, comment: "", createdAt: new Date().toISOString() });
const newBlackoutPeriod = () => ({ id: "", date: "", start: "00:00", end: "23:59", label: "" });

export default function Admin() {
  const [token, setToken] = useState(() => window.localStorage.getItem(STORAGE_KEY) || "");
  const [pin, setPin] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(Boolean(token));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    let active = true;
    setLoading(true);

    api.getAdminData(token)
      .then((response) => {
        if (active) {
          setDraft(response);
          setError("");
        }
      })
      .catch((loadError) => {
        if (!active) {
          return;
        }
        setError(loadError.message);
        if (loadError.message.toLowerCase().includes("session")) {
          window.localStorage.removeItem(STORAGE_KEY);
          setToken("");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [token]);

  function updateRootField(section, field, value) {
    setDraft((current) => ({ ...current, [section]: { ...current[section], [field]: value } }));
  }

  function updateArrayItem(section, index, field, value) {
    setDraft((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    }));
  }

  function replaceArrayItem(section, index, nextValue) {
    setDraft((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) => (itemIndex === index ? nextValue : item)),
    }));
  }

  function addArrayItem(section, factory) {
    setDraft((current) => ({ ...current, [section]: [...current[section], factory()] }));
  }

  function removeArrayItem(section, index) {
    setDraft((current) => ({ ...current, [section]: current[section].filter((_, itemIndex) => itemIndex !== index) }));
  }

  function updateOpeningHours(dayKey, field, value) {
    setDraft((current) => ({
      ...current,
      openingHours: {
        ...current.openingHours,
        [dayKey]: { ...current.openingHours[dayKey], [field]: value },
      },
    }));
  }

  function updateBreak(dayKey, field, value) {
    setDraft((current) => {
      const currentBreak = current.openingHours[dayKey].breaks?.[0] || { start: "13:00", end: "14:00" };
      return {
        ...current,
        openingHours: {
          ...current.openingHours,
          [dayKey]: {
            ...current.openingHours[dayKey],
            breaks: [{ ...currentBreak, [field]: value }],
          },
        },
      };
    });
  }

  async function handleLogin(event) {
    event.preventDefault();
    try {
      const response = await api.adminLogin(pin);
      window.localStorage.setItem(STORAGE_KEY, response.token);
      setToken(response.token);
      setPin("");
      setLoginError("");
    } catch (loginFailure) {
      setLoginError(loginFailure.message);
    }
  }

  async function handleSave() {
    if (!draft) {
      return;
    }

    try {
      setSaving(true);
      const response = await api.saveAdminData(token, extractEditableData(draft));
      setDraft(response);
      setMessage("Les modifications ont ete enregistrees.");
      setError("");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  async function patchBooking(bookingId, payload) {
    try {
      const response = await api.updateBooking(token, bookingId, payload);
      setDraft((current) => ({
        ...current,
        bookings: current.bookings.map((booking) => (booking.id === bookingId ? response.booking : booking)),
      }));
      setMessage("Le rendez-vous a ete mis a jour.");
    } catch (bookingError) {
      setError(bookingError.message);
    }
  }

  function logout() {
    window.localStorage.removeItem(STORAGE_KEY);
    setToken("");
    setDraft(null);
  }

  if (!token) {
    return <AdminAuth pin={pin} setPin={setPin} loginError={loginError} onSubmit={handleLogin} />;
  }

  if (loading || !draft) {
    return <div className="screen-state"><div className="loader-card"><p>Chargement de l'admin...</p></div></div>;
  }

  return (
    <div className="admin-shell">
      <AdminTopbar brandName={draft.site.brandName} saving={saving} onSave={handleSave} onLogout={logout} />

      {message ? <div className="form-message is-success">{message}</div> : null}
      {error ? <div className="form-message is-error">{error}</div> : null}

      <div className="admin-layout">
        <aside className="admin-sidebar">
          {TABS.map((tab) => (
            <button key={tab.id} className={`admin-tab ${activeTab === tab.id ? "is-active" : ""}`} type="button" onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </aside>

        <main className="admin-content">
          {activeTab === "overview" ? <OverviewTab draft={draft} /> : null}
          {activeTab === "bookings" ? <BookingsTab draft={draft} patchBooking={patchBooking} updateArrayItem={updateArrayItem} /> : null}
          {activeTab === "availability" ? (
            <AvailabilityTab
              draft={draft}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
              updateArrayItem={updateArrayItem}
              updateOpeningHours={updateOpeningHours}
              updateBreak={updateBreak}
              newBlackoutPeriod={newBlackoutPeriod}
              updateRootField={updateRootField}
            />
          ) : null}
          {activeTab === "catalog" ? (
            <CatalogTab
              draft={draft}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
              updateArrayItem={updateArrayItem}
              replaceArrayItem={replaceArrayItem}
              newCategory={newCategory}
              newService={newService}
              newStaff={newStaff}
            />
          ) : null}
          {activeTab === "content" ? (
            <ContentTab
              draft={draft}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
              updateArrayItem={updateArrayItem}
              updateRootField={updateRootField}
              newPortfolioItem={newPortfolioItem}
              newReview={newReview}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
}
