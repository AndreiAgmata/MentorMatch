import Features from "./Features";
import Stats from "./Stats";
import Testimonials from "./Testimonials";
import Footer from "./Footer";
import Hero from "./Hero";
import Faqs from "./Faqs";

function LandingPage() {
  return (
    <section className="landing-page">
      <Hero />
      <Features />
      <Stats />
      <Testimonials />
      <Faqs />
      <Footer />
    </section>
  );
}

export default LandingPage;
