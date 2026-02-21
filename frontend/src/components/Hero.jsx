import React from 'react';
import { ArrowRight, GraduationCap, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';

const Hero = () => {
  const { isDark } = useTheme();
  
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openQueryPopup = () => {
    window.dispatchEvent(new CustomEvent('openQueryPopup'));
  };

  return (
    <section id="home" className={`pt-24 pb-16 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-yellow-50 via-white to-gray-50'}`}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${isDark ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-700'}`}>
              <GraduationCap className="h-4 w-4" />
              <span>Trusted Since 2019</span>
            </div>

            <h1 className={`text-5xl lg:text-6xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Expert Counselling for a{' '}
              <span className="text-yellow-500 relative">
                Brighter Future
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="12"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 10C50 5 100 2 150 2C200 2 250 5 298 10"
                    stroke="#EAB308"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className={`text-xl leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Personalized guidance to help students choose the best career path. Get expert advice on selecting top colleges and programs that match your dreams.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={openQueryPopup}
                size="lg"
                className="bg-yellow-500 text-gray-900 hover:bg-yellow-600 font-semibold text-lg px-8 py-6 group animate-pulse hover:animate-none"
                data-testid="get-counselling-now-btn"
              >
                <Phone className="mr-2 h-5 w-5" />
                GET COUNSELLING NOW
              </Button>
              <Button
                onClick={scrollToContact}
                size="lg"
                variant="outline"
                className={`border-2 font-semibold text-lg px-8 py-6 ${isDark ? 'border-gray-600 text-gray-300 hover:border-yellow-500 hover:text-yellow-500' : 'border-gray-300 text-gray-700 hover:border-yellow-500 hover:text-yellow-500'}`}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>2000+</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Students Counselled</p>
              </div>
              <div className={`h-12 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              <div>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>50+</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Partner Colleges</p>
              </div>
              <div className={`h-12 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              <div>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>95%</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Success Rate</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://customer-assets.emergentagent.com/job_7c233dd2-f1b6-43b7-976c-4fdf6cdbe91b/artifacts/2yjqaxce_WhatsApp%20Image%202025-12-25%20at%2011.47.59%20AM%20%281%29.jpeg"
                alt="Edu Advisor Team"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className={`absolute -top-6 -right-6 w-72 h-72 rounded-full blur-3xl opacity-30 -z-10 ${isDark ? 'bg-yellow-600' : 'bg-yellow-200'}`}></div>
            <div className={`absolute -bottom-6 -left-6 w-72 h-72 rounded-full blur-3xl opacity-20 -z-10 ${isDark ? 'bg-yellow-500' : 'bg-yellow-300'}`}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;