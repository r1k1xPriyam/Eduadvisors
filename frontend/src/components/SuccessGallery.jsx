import React, { useState } from 'react';
import { Trophy, GraduationCap, Building2, Users, Star, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SuccessGallery = () => {
  const { isDark } = useTheme();
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const successStories = [
    {
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80",
      name: "Engineering Dreams",
      achievement: "IIT & NIT Admissions",
      college: "Premium Engineering Colleges",
      description: "Our students excel in JEE Main & Advanced, securing seats in top IITs, NITs, and IIITs across India."
    },
    {
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
      name: "Medical Excellence",
      achievement: "MBBS & BDS Admissions",
      college: "Top Medical Colleges",
      description: "NEET qualified students placed in prestigious government and private medical colleges."
    },
    {
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80",
      name: "Graduation Success",
      achievement: "Career Ready Graduates",
      college: "Leading Universities",
      description: "Watch our students transform from aspirants to successful professionals."
    },
    {
      image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&q=80",
      name: "Campus Life",
      achievement: "University Experience",
      college: "Premier Campuses",
      description: "Experience world-class education in beautiful campus environments."
    },
    {
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
      name: "Future Leaders",
      achievement: "Management Studies",
      college: "Top B-Schools",
      description: "MBA and BBA students placed in renowned management institutes."
    }
  ];

  const stats = [
    { icon: Trophy, value: "2000+", label: "Successful Admissions" },
    { icon: Building2, value: "50+", label: "Partner Colleges" },
    { icon: Users, value: "25+", label: "Expert Counsellors" },
    { icon: Star, value: "4.9", label: "Student Rating" }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(successStories.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(successStories.length / 3)) % Math.ceil(successStories.length / 3));
  };

  const visibleStories = successStories.slice(currentSlide * 3, currentSlide * 3 + 3);

  return (
    <section id="success-gallery" className={`py-20 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-yellow-50 via-white to-gray-50'}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h3 className="text-yellow-500 font-semibold text-sm uppercase tracking-wide mb-2">Success Gallery</h3>
          <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Dreams Turned Into Reality</h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Witness the joy of our students who achieved their educational dreams with our expert guidance
          </p>
        </div>

        {/* Success Images Grid with Navigation */}
        <div className="relative mb-16">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 shadow-lg rounded-full p-3 transition-colors hidden md:block ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-yellow-50'}`}
            aria-label="Previous"
          >
            <ChevronLeft className={`h-6 w-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
          </button>
          <button
            onClick={nextSlide}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 shadow-lg rounded-full p-3 transition-colors hidden md:block ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-yellow-50'}`}
            aria-label="Next"
          >
            <ChevronRight className={`h-6 w-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
          </button>

          <div className="grid md:grid-cols-3 gap-8">
            {visibleStories.map((story, index) => (
              <div
                key={index}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer"
                onClick={() => setSelectedImage(story)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                
                {/* Hover Overlay Effect */}
                <div className="absolute inset-0 bg-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform group-hover:translate-y-0 transition-transform">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm text-yellow-300 font-medium">{story.achievement}</span>
                  </div>
                  <h3 className="text-xl font-bold">{story.name}</h3>
                  <p className="text-gray-300 text-sm">{story.college}</p>
                  
                  {/* Hover Content */}
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <p className="text-sm text-gray-200 border-t border-white/20 pt-3">
                      Click to view details
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(successStories.length / 3) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide === index ? 'bg-yellow-500' : isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className={`rounded-2xl shadow-xl p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group cursor-default">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 group-hover:scale-110 transition-all duration-300 ${isDark ? 'bg-yellow-900/50 group-hover:bg-yellow-900/70' : 'bg-yellow-100 group-hover:bg-yellow-200'}`}>
                    <Icon className="h-7 w-7 text-yellow-600" />
                  </div>
                  <p className={`text-3xl font-bold group-hover:text-yellow-600 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-300 rounded-full blur-2xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Write Your Success Story?
            </h3>
            <p className="text-yellow-100 mb-6 max-w-xl mx-auto">
              Join thousands of students who transformed their careers with our expert guidance
            </p>
            <button
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-yellow-600 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Start Your Journey Today
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className={`rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl transform animate-in zoom-in-95 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedImage.image}
                alt={selectedImage.name}
                className="w-full h-64 md:h-80 object-cover"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="h-5 w-5 text-yellow-400" />
                  <span className="text-yellow-300 font-medium">{selectedImage.achievement}</span>
                </div>
                <h3 className="text-2xl font-bold text-white">{selectedImage.name}</h3>
              </div>
            </div>
            <div className="p-6">
              <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{selectedImage.description}</p>
              <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <Building2 className="h-4 w-4" />
                <span>{selectedImage.college}</span>
              </div>
              <button
                onClick={() => {
                  setSelectedImage(null);
                  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-6 w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
              >
                Get Similar Success - Contact Us
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SuccessGallery;
