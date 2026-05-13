// src/pages/home/HomePage.jsx
// Main landing page — composes all home section components
import "../styles/Home.css";
import FeaturesSection from "../components/FeaturesSection";
import Navbar from "../components/Navbar";
import HeroCarousel from "../components/HeroCarousel";
import GeofenceSection from "../components/GeofenceSection";
import ReviewsSection from "../components/ReviewsSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="hn-page">
      <Navbar />
      <HeroCarousel />
      <FeaturesSection />
      <GeofenceSection />
      <ReviewsSection />
      <Footer />
    </div>
  );
}