import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Mail, Lock, Users } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg py-3' : 'bg-white/95 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src="https://static.prod-images.emergentagent.com/jobs/9e72d044-fd83-4308-bd70-6417dfaebaf8/images/725422b1dccb8b76f317695455f20615e13ed5e74c2344282911621b3474b267.png"
              alt="Edu Advisor Logo"
              className="h-12 w-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Edu <span className="text-yellow-500">Advisor</span>
              </h1>
              <p className="text-xs text-gray-600 hidden sm:block">Learn Today Earn Tomorrow</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-yellow-500 transition-colors font-medium">
              Home
            </button>
            <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-yellow-500 transition-colors font-medium">
              About
            </button>
            <button onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-yellow-500 transition-colors font-medium">
              Services
            </button>
            <button onClick={() => scrollToSection('courses')} className="text-gray-700 hover:text-yellow-500 transition-colors font-medium">
              Courses
            </button>
            <button onClick={() => scrollToSection('colleges')} className="text-gray-700 hover:text-yellow-500 transition-colors font-medium">
              Colleges
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-yellow-500 transition-colors font-medium">
              Contact
            </button>
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <a href="tel:9332641552" className="flex items-center text-sm text-gray-700 hover:text-yellow-500 transition-colors">
              <Phone className="h-4 w-4 mr-1" />
              9332641552
            </a>
            <Button
              onClick={() => scrollToSection('contact')}
              className="bg-yellow-500 text-gray-900 hover:bg-yellow-600 font-semibold"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-gray-700 hover:text-yellow-500 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <nav className="flex flex-col space-y-3">
              <button onClick={() => scrollToSection('home')} className="text-left text-gray-700 hover:text-yellow-500 transition-colors font-medium">
                Home
              </button>
              <button onClick={() => scrollToSection('about')} className="text-left text-gray-700 hover:text-yellow-500 transition-colors font-medium">
                About
              </button>
              <button onClick={() => scrollToSection('services')} className="text-left text-gray-700 hover:text-yellow-500 transition-colors font-medium">
                Services
              </button>
              <button onClick={() => scrollToSection('courses')} className="text-left text-gray-700 hover:text-yellow-500 transition-colors font-medium">
                Courses
              </button>
              <button onClick={() => scrollToSection('colleges')} className="text-left text-gray-700 hover:text-yellow-500 transition-colors font-medium">
                Colleges
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-left text-gray-700 hover:text-yellow-500 transition-colors font-medium">
                Contact
              </button>
              <div className="pt-3 border-t border-gray-200">
                <a href="tel:9332641552" className="flex items-center text-sm text-gray-700 mb-2">
                  <Phone className="h-4 w-4 mr-2" />
                  9332641552
                </a>
                <a href="mailto:info.eduadvisor26@gmail.com" className="flex items-center text-sm text-gray-700">
                  <Mail className="h-4 w-4 mr-2" />
                  info.eduadvisor26@gmail.com
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;