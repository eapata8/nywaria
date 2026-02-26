import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import Section from "../components/Section";
import { db } from "../firebase/firestore";

const CATEGORIES = [
  "À la une",
  "Consultation",
  "Tresses",
  "Loks",
  "Soins",
  "Gentlemen",
];

export default function Booking() {
  const [categorie, setCategorie] = useState("À la une");
  const [services, setServices] = useState([]);
  const [chargement, setChargement] = useState(true);

  const [modalOuvert, setModalOuvert] = useState(false);
  const [serviceChoisi, setServiceChoisi] = useState(null);

  const [form, setForm] = useState({
    nom: "",
    telephone: "",
    email: "",
    date: "",
    heure: "",
    note: "",
  });

  const [etat, setEtat] = useState({ loading: false, msg: "", error: false });

  // Charger les services depuis Firestore
  useEffect(() => {
    (async () => {
      try {
        setChargement(true);
        const q = query(collection(db, "services"), orderBy("ordre", "asc"));
        const snap = await getDocs(q);
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setServices(items);
      } catch (e) {
        console.error("Erreur chargement services:", e);
      } finally {
        setChargement(false);
      }
    })();
  }, []);

  const servicesFiltres = useMemo(() => {
    if (categorie === "À la une") return services.filter((s) => s.featured === true);
    return services.filter((s) => (s.categorie || "À la une") === categorie);
  }, [services, categorie]);

  const ouvrirReservation = (service) => {
    setServiceChoisi(service);
    setEtat({ loading: false, msg: "", error: false });
    setModalOuvert(true);
  };

  const fermerModal = () => {
    setModalOuvert(false);
    setServiceChoisi(null);
  };

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const reserver = async (e) => {
    e.preventDefault();
    setEtat({ loading: true, msg: "", error: false });

    try {
      if (!serviceChoisi) throw new Error("Service introuvable.");
      if (!form.nom || !form.telephone || !form.date || !form.heure) {
        throw new Error("Remplis au moins : nom, téléphone, date et heure.");
      }

      await addDoc(collection(db, "bookings"), {
        serviceId: serviceChoisi.id,
        serviceNom: serviceChoisi.nom,
        serviceCategorie: serviceChoisi.categorie || "À la une",
        prix: serviceChoisi.prix || "",
        duree: serviceChoisi.duree || "",
        client: {
          nom: form.nom,
          telephone: form.telephone,
          email: form.email || "",
        },
        rendezVous: {
          date: form.date,
          heure: form.heure,
        },
        note: form.note || "",
        status: "nouveau", // nouveau | confirmé | terminé | annulé
        createdAt: serverTimestamp(),
      });

      setEtat({
        loading: false,
        msg: "✅ Réservation envoyée. Je te confirme bientôt.",
        error: false,
      });

      setForm({ nom: "", telephone: "", email: "", date: "", heure: "", note: "" });

      setTimeout(() => fermerModal(), 700);
    } catch (err) {
      setEtat({
        loading: false,
        msg: err?.message || "Erreur. Réessaie.",
        error: true,
      });
    }
  };

  return (
    <Section
      titre="Réserver"
      sousTitre="Choisis un service, puis envoie ta demande de rendez-vous."
      fond="blanc"
    >
      {/* Onglets catégories */}
      <div style={styles.tabsWrap}>
        <div style={styles.tabs}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategorie(cat)}
              style={{
                ...styles.tab,
                ...(categorie === cat ? styles.tabActive : {}),
              }}
              type="button"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des services */}
      <div style={styles.list}>
        {chargement && <div style={{ padding: 12 }}>Chargement des services…</div>}

        {!chargement && servicesFiltres.length === 0 && (
          <div style={{ padding: 12 }}>
            Aucun service dans cette catégorie pour l’instant.
          </div>
        )}

        {servicesFiltres.map((s) => (
          <div key={s.id} style={styles.card}>
            <div>
              <div style={styles.nom}>{s.nom}</div>
              <div style={styles.meta}>{s.duree}</div>
              <div style={styles.prix}>{s.prix}</div>
            </div>

            <button
              style={styles.btnReserver}
              onClick={() => ouvrirReservation(s)}
              type="button"
            >
              Réserver
            </button>
          </div>
        ))}
      </div>

      {/* Modal réservation */}
      {modalOuvert && (
        <div style={styles.backdrop} onClick={fermerModal} role="presentation">
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <div style={styles.modalHeader}>
              <div>
                <div style={styles.modalTitre}>{serviceChoisi?.nom}</div>
                <div style={styles.modalSousTitre}>
                  {serviceChoisi?.duree} • {serviceChoisi?.prix}
                </div>
              </div>

              <button onClick={fermerModal} type="button" style={styles.closeBtn}>
                ✕
              </button>
            </div>

            <form onSubmit={reserver} style={{ display: "grid", gap: 10 }}>
              <input
                name="nom"
                value={form.nom}
                onChange={onChange}
                placeholder="Nom complet *"
              />
              <input
                name="telephone"
                value={form.telephone}
                onChange={onChange}
                placeholder="Téléphone *"
              />
              <input
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="Email (optionnel)"
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input type="date" name="date" value={form.date} onChange={onChange} />
                <input type="time" name="heure" value={form.heure} onChange={onChange} />
              </div>

              <textarea
                name="note"
                value={form.note}
                onChange={onChange}
                rows={4}
                placeholder="Note (inspiration, longueur, etc.)"
              />

              <button type="submit" disabled={etat.loading} style={styles.submit}>
                {etat.loading ? "Envoi..." : "Envoyer la demande"}
              </button>

              {etat.msg && (
                <div
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    background: etat.error ? "#ffe5ea" : "#eaffea",
                    border: etat.error ? "1px solid #ffb3c1" : "1px solid #b7f0b7",
                    fontWeight: 800,
                  }}
                >
                  {etat.msg}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </Section>
  );
}

const styles = {
  tabsWrap: {
    marginTop: 8,
    marginBottom: 18,
    overflowX: "auto",
  },
  tabs: {
    display: "flex",
    gap: 10,
    paddingBottom: 6,
    minWidth: 720,
  },
  tab: {
    background: "var(--blanc)",
    border: "1px solid var(--gris-2)",
    padding: "10px 14px",
    borderRadius: 999,
    fontWeight: 900,
    color: "var(--noir)",
    whiteSpace: "nowrap",
  },
  tabActive: {
    background: "var(--noir)",
    border: "1px solid var(--noir)",
    color: "var(--blanc)",
  },

  list: { display: "grid", gap: 14 },

  card: {
    background: "var(--blanc)",
    border: "1px solid var(--gris-2)",
    borderRadius: 12,
    padding: "18px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  nom: { fontWeight: 900, fontSize: 16, marginBottom: 4 },
  meta: { color: "rgba(0,0,0,0.55)", fontSize: 13, marginBottom: 6 },
  prix: { fontWeight: 900, fontSize: 14 },

  btnReserver: {
    background: "var(--blanc)",
    color: "var(--noir)",
    border: "1px solid var(--gris-2)",
    padding: "10px 16px",
    borderRadius: 999,
    fontWeight: 900,
  },

  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    zIndex: 50,
  },
  modal: {
    width: "100%",
    maxWidth: 560,
    background: "var(--blanc)",
    borderRadius: 16,
    padding: 16,
    border: "1px solid var(--gris-2)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },
  modalTitre: { fontWeight: 900, fontSize: 18 },
  modalSousTitre: { color: "rgba(0,0,0,0.6)", fontSize: 13 },

  closeBtn: {
    background: "transparent",
    border: "1px solid var(--gris-2)",
    color: "var(--noir)",
    borderRadius: 12,
    padding: "8px 10px",
    fontWeight: 900,
  },
  submit: {
    background: "var(--rose)",
    color: "white",
    borderRadius: 999,
    padding: "12px 14px",
    fontWeight: 900,
  },
};