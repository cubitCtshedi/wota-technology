import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Contact from './pages/Contact';

// On every route change: jump to the top, unless the URL carries a #hash
// (then scroll that section into view once the page has painted).
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </>
  );
}
