import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// import Home from "./pages/Home";
// import Services from "./pages/Services";
// import Gallery from "./pages/Gallery";
// import Reviews from "./pages/Reviews";
// import Booking from "./pages/Booking";
// import Contact from "./pages/Contact";

export default function App() {
  return (
    <BrowserRouter>
{/* //       <Navbar />
//       <div style={{ minHeight: "80vh" }}>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/services" element={<Services />} />
//           <Route path="/gallery" element={<Gallery />} />
//           <Route path="/reviews" element={<Reviews />} />
//           <Route path="/booking" element={<Booking />} />
//           <Route path="/contact" element={<Contact />} />
//         </Routes>
//       </div> */}
         <Footer />
      </BrowserRouter>
  );
}

// export default function App() {
//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Nywaria fonctionne ✅</h1>
//     </div>
//   );
// }