import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { ExternalLink, MapPin, Calendar, Award, TrendingUp, Users, Building2 } from 'lucide-react';
import { Button } from './ui/button';

const CollegeModal = ({ college, isOpen, onClose }) => {
  if (!college) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Building2 className="h-8 w-8 text-yellow-500" />
            {college.name}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            {college.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Key Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <p className="text-sm font-semibold text-gray-700">NIRF Rank</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{college.nirf_rank}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-green-500" />
                <p className="text-sm font-semibold text-gray-700">NAAC Grade</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{college.naac_grade}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-blue-500" />
                <p className="text-sm font-semibold text-gray-700">Location</p>
              </div>
              <p className="text-sm font-bold text-gray-900">{college.location}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                <p className="text-sm font-semibold text-gray-700">Established</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{college.established_year}</p>
            </div>
          </div>

          {/* Placement Statistics */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-yellow-500" />
              Placement Statistics
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Package</p>
                <p className="text-2xl font-bold text-gray-900">{college.placement_stats.average_package}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Highest Package</p>
                <p className="text-2xl font-bold text-green-600">{college.placement_stats.highest_package}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Placement Rate</p>
                <p className="text-2xl font-bold text-blue-600">{college.placement_stats.placement_rate}</p>
              </div>
            </div>
          </div>

          {/* Specializations */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Specializations Offered</h3>
            <div className="flex flex-wrap gap-2">
              {college.specializations.map((spec, index) => (
                <Badge key={index} className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-3 py-1">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>

          {/* Top Recruiters */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="h-6 w-6 text-yellow-500" />
              Top Recruiters
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {college.top_recruiters.map((recruiter, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <p className="font-semibold text-gray-800">{recruiter}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Key Facilities</h3>
            <ul className="grid md:grid-cols-2 gap-2">
              {college.facilities.map((facility, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">✓</span>
                  <span className="text-gray-700">{facility}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Website Link */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              onClick={() => window.open(college.website, '_blank')}
              className="bg-yellow-500 text-gray-900 hover:bg-yellow-600 w-full md:w-auto"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Official Website
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollegeModal;