import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { BookOpen, Clock, TrendingUp, Award, Briefcase, Target, CheckCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const CourseModal = ({ course, isOpen, onClose }) => {
  if (!course) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-yellow-500" />
            {course.full_name} ({course.name})
          </DialogTitle>
          <div className="flex items-center gap-4 mt-2">
            <Badge className="bg-yellow-500 text-gray-900">
              <Clock className="h-3 w-3 mr-1" />
              {course.duration}
            </Badge>
            <Badge variant="outline" className="border-gray-300">
              {course.type === 'undergraduate' ? 'Undergraduate' : 'Postgraduate'}
            </Badge>
          </div>
          <DialogDescription className="text-base text-gray-600 mt-3">
            {course.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Why Choose This Course */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="h-6 w-6 text-yellow-500" />
              Why Choose This Course?
            </h3>
            <p className="text-gray-700 leading-relaxed">{course.why_choose}</p>
          </div>

          {/* Career Prospects */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-yellow-500" />
              Career Prospects
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {course.career_prospects.map((career, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-gray-800">{career}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Colleges with Best Placements */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-yellow-500" />
              Colleges with Best Placements for {course.name}
            </h3>
            <div className="space-y-4">
              {course.colleges_offering.map((college, index) => (
                <Card key={index} className="border-2 border-gray-200 hover:border-yellow-400 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-1">{college.college_name}</h4>
                        <p className="text-sm text-gray-600">{college.specialization}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Avg. Placement</p>
                        <p className="text-2xl font-bold text-green-600">{college.average_placement}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Top Companies:</p>
                      <div className="flex flex-wrap gap-2">
                        {college.top_companies.map((company, idx) => (
                          <Badge key={idx} variant="outline" className="border-gray-300">
                            {company}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        Why Recommended:
                      </p>
                      <p className="text-sm text-gray-700">{college.why_recommended}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gray-50 p-6 rounded-xl text-center">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Interested in {course.name}?</h4>
            <p className="text-gray-600 mb-4">Get personalized guidance from our expert counselors</p>
            <button
              onClick={() => {
                onClose();
                setTimeout(() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }, 300);
              }}
              className="bg-yellow-500 text-gray-900 hover:bg-yellow-600 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Contact Us Now
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseModal;