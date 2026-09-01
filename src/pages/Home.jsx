import Seo from '../components/Seo';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Steps from '../components/Steps';
import Services from '../components/Services';
import Projects from '../components/Projects';
import Gallery from '../components/Gallery';
import FaqDashboard from '../components/FaqDashboard';
import Cta from '../components/Cta';

// The marketing homepage — all the scrolling sections in order.
export default function Home() {
  return (
    <main>
      <Seo page="home" />
      <Hero />
      <Features />
      <Steps />
      <Services />
      <Projects />
      <Gallery />
      <FaqDashboard />
      <Cta />
    </main>
  );
}
