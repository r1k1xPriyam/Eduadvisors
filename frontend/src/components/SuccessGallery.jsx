import React from 'react';
import { Trophy, GraduationCap, Building2, Users, Star } from 'lucide-react';

const SuccessGallery = () => {
  const successStories = [
    {
      image: "https://images.unsplash.com/photo-1762438136297-1393f86696bb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZGVudHMlMjBncmFkdWF0aW9uJTIwc3VjY2Vzc3xlbnwwfHx8fDE3NzAzODk0NzZ8MA&ixlib=rb-4.1.0&q=85",
      name: "Successful Graduate",
      achievement: "Dream College Admission",
      college: "Top Engineering College"
    },
    {
      image: "https://images.unsplash.com/photo-1770223914355-76a1f1c8f6fc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwzfHxjb2xsZWdlJTIwc3R1ZGVudHMlMjBncmFkdWF0aW9uJTIwc3VjY2Vzc3xlbnwwfHx8fDE3NzAzODk0NzZ8MA&ixlib=rb-4.1.0&q=85",
      name: "Celebrating Success",
      achievement: "Graduation Day Joy",
      college: "Premier Medical College"
    },
    {
      image: "https://images.unsplash.com/photo-1758270703648-1559ddc68a22?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHw0fHxjb2xsZWdlJTIwc3R1ZGVudHMlMjBncmFkdWF0aW9uJTIwc3VjY2Vzc3xlbnwwfHx8fDE3NzAzODk0NzZ8MA&ixlib=rb-4.1.0&q=85",
      name: "Future Leaders",
      achievement: "Career Success",
      college: "Leading Management Institute"
    }
  ];

  const stats = [
    { icon: Trophy, value: "2000+", label: "Successful Admissions" },
    { icon: Building2, value: "50+", label: "Partner Colleges" },
    { icon: Users, value: "25+", label: "Expert Counsellors" },
    { icon: Star, value: "4.9", label: "Student Rating" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-yellow-50 via-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h3 className="text-yellow-500 font-semibold text-sm uppercase tracking-wide mb-2">Success Gallery</h3>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Dreams Turned Into Reality</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Witness the joy of our students who achieved their educational dreams with our expert guidance
          </p>
        </div>

        {/* Success Images Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {successStories.map((story, index) => (
            <div 
              key={index} 
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <img
                src={story.image}
                alt={story.name}
                className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm text-yellow-300 font-medium">{story.achievement}</span>
                </div>
                <h3 className="text-xl font-bold">{story.name}</h3>
                <p className="text-gray-300 text-sm">{story.college}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-100 rounded-full mb-4">
                    <Icon className="h-7 w-7 text-yellow-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Write Your Success Story?
            </h3>
            <p className="text-yellow-100 mb-6 max-w-xl mx-auto">
              Join thousands of students who transformed their careers with our expert guidance
            </p>
            <button
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-yellow-600 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-50 transition-colors shadow-lg"
            >
              Start Your Journey Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessGallery;
