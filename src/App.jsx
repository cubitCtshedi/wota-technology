import Nav from './components/Nav';
import Hero from './components/Hero';
import Features from './components/Features';
import Steps from './components/Steps';
import Services from './components/Services';
import Projects from './components/Projects';
import FaqDashboard from './components/FaqDashboard';
import Cta from './components/Cta';
import Footer from './components/Footer';
import { useScrollReveal } from './hooks/useScrollReveal';

export default function App() {
  // Reveal `.reveal` elements on scroll, once everything has mounted.
  useScrollReveal();

  return (
    <>
      <Nav />
      <Hero />
      <Features />
      <Steps />
      <Services />
      <Projects />
      <FaqDashboard />
      <Cta />
      <Footer />
    </>
  );
}
