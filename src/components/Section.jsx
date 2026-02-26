// a redisigner pas tres beau
export default function Section({
  titre,
  sousTitre,
  enfants,
  id,
  fond = "blanc", // "blanc" | "gris" | "noir"
  centre = false,
}) {
  const bg =
    fond === "gris" ? "var(--gris)" : fond === "noir" ? "var(--noir)" : "var(--blanc)";
  const color = fond === "noir" ? "var(--blanc)" : "var(--noir)";
  const subColor = fond === "noir" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.6)";

  return (
    <section id={id} style={{ background: bg, color }}>
      <div style={styles.container}>
        {(titre || sousTitre) && (
          <header style={{ marginBottom: 18, textAlign: centre ? "center" : "left" }}>
            {titre && <h2 style={styles.titre}>{titre}</h2>}
            {sousTitre && <p style={{ ...styles.sousTitre, color: subColor }}>{sousTitre}</p>}
            <div
              style={{
                ...styles.barre,
                marginLeft: centre ? "auto" : 0,
                marginRight: centre ? "auto" : 0,
              }}
            />
          </header>
        )}

        <div>{enfants}</div>
      </div>
    </section>
  );
}

const styles = {
  container: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "48px 18px",
  },
  titre: {
    fontSize: 26,
    fontWeight: 900,
    margin: 0,
  },
  sousTitre: {
    margin: "10px 0 0 0",
    fontSize: 15,
    lineHeight: 1.6,
    maxWidth: 820,
  },
  barre: {
    marginTop: 14,
    width: 72,
    height: 6,
    borderRadius: 999,
    background: "var(--rose)",
  },
};