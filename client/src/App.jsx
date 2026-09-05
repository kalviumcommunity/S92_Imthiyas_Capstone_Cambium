import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeatureCard from "./components/FeatureCard";
import Auth from "./components/Auth";
import OpportunityManager from "./components/OpportunityManager";
import Footer from "./components/Footer";

import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Auth />
      <FeatureCard />
      <OpportunityManager />
      <Footer />
    </>
  );
}

export default App;