import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/Approutes";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ minHeight: "80vh", background: "var(--gris)" }}>
        <AppRoutes />
      </div>
      <Footer />
    </BrowserRouter>
  );
}