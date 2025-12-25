import React from 'react';
import { School, CheckCircle } from 'lucide-react';
import { colleges } from '../mockData';

const Colleges = () => {
  return (
    <section id="colleges" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-yellow-500 font-semibold text-sm uppercase tracking-wide mb-2">Our Partners</h3>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Top Colleges & Universities</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We collaborate with NIRF and NAAC ranked institutions across India
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-center justify-center mb-8">
              <School className="h-8 w-8 text-yellow-500 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Partner Institutions</h3>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {colleges.map((college, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-2 p-3 rounded-lg hover:bg-yellow-50 transition-colors group"
                >
                  <CheckCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{college}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Colleges;