import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";

export default function SeedServices() {

  const services = [
    {
      nom: "Consultation capillaire",
      duree: "30 min",
      prix: "20 $",
      categorie: "Consultation",
      featured: true,
      ordre: 1
    },
    {
      nom: "Knotless braids",
      duree: "2 h 30",
      prix: "à partir de 120 $",
      categorie: "Tresses",
      featured: true,
      ordre: 2
    },
    {
      nom: "Knotless braids",
      duree: "3 h 30",
      prix: "à partir de 150 $",
      categorie: "Tresses",
      ordre: 3
    },
    {
      nom: "Starter locs",
      duree: "3 h",
      prix: "à partir de 180 $",
      categorie: "Loks",
      featured: true,
      ordre: 4
    },
    {
      nom: "Retwist",
      duree: "2 h",
      prix: "à partir de 90 $",
      categorie: "Loks",
      ordre: 5
    },
    {
      nom: "Traitement hydratant",
      duree: "1 h",
      prix: "70 $",
      categorie: "Soins",
      ordre: 6
    },
    {
      nom: "Cornrows homme",
      duree: "1 h 30",
      prix: "60 $",
      categorie: "Gentlemen",
      ordre: 7
    },
  ];

  const peupler = async () => {
    try {
      for (let service of services) {
        await addDoc(collection(db, "services"), service);
      }
      alert("Services ajoutés avec succès !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout.");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Peupler la base de données</h1>
      <button onClick={peupler} style={{
        background: "var(--rose)",
        color: "white",
        padding: "12px 20px",
        borderRadius: "25px",
        fontWeight: 800
      }}>
        Ajouter les services
      </button>
    </div>
  );
}