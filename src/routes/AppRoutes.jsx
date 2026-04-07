import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Services from "../pages/Services";
import Gallery from "../pages/Gallery";
import Reviews from "../pages/Reviews";
import Booking from "../pages/Booking";
import Contact from "../pages/Contact";
import SeedServices from "../pages/SeedServices";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/seed" element={<SeedServices />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}