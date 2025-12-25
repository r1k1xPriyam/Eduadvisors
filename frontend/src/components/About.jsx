import React from 'react';
import { Award, Target, Users, TrendingUp } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Award,
      title: 'Experienced Guidance',
      description: 'Shaping student careers since 2019'
    },
    {
      icon: Target,
      title: 'Personalized Support',
      description: 'Tailored counselling for your goals'
    },
    {
      icon: Users,
      title: 'Wide Network',
      description: 'Top ranked colleges across India'
    },
    {
      icon: TrendingUp,
      title: 'Proven Success',
      description: 'Hundreds of students placed'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://customer-assets.emergentagent.com/job_7c233dd2-f1b6-43b7-976c-4fdf6cdbe91b/artifacts/3pbtktgr_WhatsApp%20Image%202025-12-25%20at%2011.47.59%20AM%20%282%29.jpeg"
                alt="Edu Advisor Team Working"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-yellow-500 text-white p-6 rounded-xl shadow-lg">
              <p className="text-4xl font-bold">6+</p>
              <p className="text-sm">Years Excellence</p>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6 order-1 lg:order-2">
            <div>
              <h3 className="text-yellow-500 font-semibold text-sm uppercase tracking-wide mb-2">About Us</h3>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Shaping Careers Since 2019</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                At Edu Advisor, we have been shaping careers since 2019 by offering expert counselling and guidance. Our goal is to help students choose the best courses and colleges to achieve their dreams.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mt-4">
                With a focus on transparency and personalized support, we're committed to turning your vision into success. Contact us to schedule a consultation and start your journey towards educational excellence!
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 pt-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-yellow-500" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;