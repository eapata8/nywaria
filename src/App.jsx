import { BrowserRouter } from "react-router-dom";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "80vh", background: "#f6f6f6" }}>
        <AppRoutes />
      </div>
      <Footer />
    </BrowserRouter>
  );
}
