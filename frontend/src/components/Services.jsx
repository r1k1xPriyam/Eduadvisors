import React from 'react';
import { Target, GraduationCap, BookOpen, Lightbulb, Shield, Video } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { services } from '../mockData';
import { useTheme } from '../context/ThemeContext';

const iconMap = {
  Target,
  GraduationCap,
  BookOpen,
  Lightbulb,
  Shield,
  Video
};

const Services = () => {
  const { isDark } = useTheme();
  
  return (
    <section id="services" className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-yellow-500 font-semibold text-sm uppercase tracking-wide mb-2">Our Services</h3>
          <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>How We Help You Succeed</h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Comprehensive guidance and support to help you make the right educational decisions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            return (
              <Card
                key={index}
                className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group ${isDark ? 'bg-gray-900' : 'bg-white'}`}
              >
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 transition-colors ${isDark ? 'bg-yellow-900/50' : 'bg-yellow-100'}`}>
                    <Icon className="h-8 w-8 text-yellow-500 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{service.title}</h3>
                  <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;