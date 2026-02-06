import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ConsultantLogin from './components/ConsultantLogin';
import ConsultantDashboard from './components/ConsultantDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedConsultantRoute from './components/ProtectedConsultantRoute';
import QueryPopup from './components/QueryPopup';
import { Toaster } from './components/ui/sonner';

const Home = () => {
  return (
    <div>
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
      <QueryPopup />
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Consultant Routes */}
          <Route path="/consultant" element={<ConsultantLogin />} />
          <Route 
            path="/consultant/dashboard" 
            element={
              <ProtectedConsultantRoute>
                <ConsultantDashboard />
              </ProtectedConsultantRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;