import React, { useState } from 'react';
import { School, ExternalLink } from 'lucide-react';
import { colleges } from '../mockData';
import CollegeModal from './CollegeModal';
import { Card, CardContent } from './ui/card';

const Colleges = () => {
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCollegeClick = (college) => {
    setSelectedCollege(college);
    setIsModalOpen(true);
  };

  return (
    <section id="colleges" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-yellow-500 font-semibold text-sm uppercase tracking-wide mb-2">Our Partners</h3>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Top Colleges & Universities</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Click on any college to explore detailed information, placements, and facilities
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <Card
                key={college.id}
                className="border-2 border-gray-200 hover:border-yellow-400 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => handleCollegeClick(college)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <School className="h-8 w-8 text-yellow-500 flex-shrink-0" />
                    <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-yellow-500 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                    {college.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{college.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                      NIRF Rank: {college.nirf_rank}
                    </span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                      {college.naac_grade}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Average Package</p>
                    <p className="text-lg font-bold text-green-600">{college.placement_stats.average_package}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Show more colleges text */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">And many more partner institutions across India</p>
          </div>
        </div>
      </div>

      <CollegeModal
        college={selectedCollege}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default Colleges;