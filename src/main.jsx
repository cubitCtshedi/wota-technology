import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* domAnimation loads only the feature subset we use (~half of framer's
        full bundle); reducedMotion="user" honours the OS setting automatically */}
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MotionConfig>
    </LazyMotion>
  </React.StrictMode>
);
