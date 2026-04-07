export default function Contact() {
  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
      <h1>Contactez-nous</h1>
      <p>Pour réserver ou poser une question, utilisez le formulaire ci-dessous ou écrivez-nous à info.nywaria@gmail.com.</p>
      <form style={{ display: "grid", gap: 12 }}>
        <input type="text" placeholder="Nom" required />
        <input type="email" placeholder="Email" required />
        <textarea placeholder="Message" rows={5} required />
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
}