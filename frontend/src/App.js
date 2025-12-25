import React from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Courses from './components/Courses';
import Colleges from './components/Colleges';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Courses />
        <Colleges />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;