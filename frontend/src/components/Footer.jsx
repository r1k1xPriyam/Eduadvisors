import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="https://static.prod-images.emergentagent.com/jobs/9e72d044-fd83-4308-bd70-6417dfaebaf8/images/725422b1dccb8b76f317695455f20615e13ed5e74c2344282911621b3474b267.png"
                alt="Edu Advisor Logo"
                className="h-10 w-10 object-contain"
              />
              <div>
                <h3 className="text-xl font-bold text-white">
                  Edu <span className="text-yellow-500">Advisor</span>
                </h3>
              </div>
            </div>
            <p className="text-sm mb-4">Learn Today Earn Tomorrow</p>
            <p className="text-sm leading-relaxed">
              Expert educational counselling helping students achieve their dreams since 2019.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollToSection('home')} className="text-sm hover:text-yellow-500 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('about')} className="text-sm hover:text-yellow-500 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="text-sm hover:text-yellow-500 transition-colors">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('courses')} className="text-sm hover:text-yellow-500 transition-colors">
                  Courses
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('colleges')} className="text-sm hover:text-yellow-500 transition-colors">
                  Colleges
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm">
              <li>Career Counselling</li>
              <li>Education Consultancy</li>
              <li>Entrance Exam Support</li>
              <li>Course Selection</li>
              <li>Admission Assistance</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <Phone className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <a href="tel:9332641552" className="hover:text-yellow-500 transition-colors block">
                    9332641552
                  </a>
                  <a href="tel:9382454940" className="hover:text-yellow-500 transition-colors block">
                    9382454940
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Mail className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <a href="mailto:info.eduadvisor26@gmail.com" className="text-sm hover:text-yellow-500 transition-colors">
                  info.eduadvisor26@gmail.com
                </a>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6">
              <h5 className="text-white font-semibold mb-3 text-sm">Follow Us</h5>
              <div className="flex space-x-3">
                <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-sm">
            © {currentYear} Edu Advisor. All rights reserved. | Shaping careers since 2019
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;