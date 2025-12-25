import React from 'react';
import { Target, GraduationCap, BookOpen, Lightbulb, Shield } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { services } from '../mockData';

const iconMap = {
  Target,
  GraduationCap,
  BookOpen,
  Lightbulb,
  Shield
};

const Services = () => {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-yellow-500 font-semibold text-sm uppercase tracking-wide mb-2">Our Services</h3>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How We Help You Succeed</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive guidance and support to help you make the right educational decisions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            return (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white group"
              >
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 transition-colors">
                    <Icon className="h-8 w-8 text-yellow-500 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
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