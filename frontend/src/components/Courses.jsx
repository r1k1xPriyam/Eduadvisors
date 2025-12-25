import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent } from './ui/card';
import { BookMarked, Award, MousePointer } from 'lucide-react';
import { coursesData, undergraduateCourses, postgraduateCourses } from '../mockData';
import CourseModal from './CourseModal';

const Courses = () => {
  const [activeTab, setActiveTab] = useState('undergraduate');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCourseClick = (courseName) => {
    // Find detailed course data
    const courseDetail = coursesData.find(
      c => c.name.toLowerCase() === courseName.toLowerCase() || 
           c.full_name.toLowerCase().includes(courseName.toLowerCase())
    );
    
    if (courseDetail) {
      setSelectedCourse(courseDetail);
      setIsModalOpen(true);
    }
  };

  const isCourseDetailed = (courseName) => {
    return coursesData.some(
      c => c.name.toLowerCase() === courseName.toLowerCase() ||
           c.full_name.toLowerCase().includes(courseName.toLowerCase())
    );
  };

  return (
    <section id="courses" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-yellow-500 font-semibold text-sm uppercase tracking-wide mb-2">Courses We Cover</h3>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Wide Range of Programs</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Click on any course to see college recommendations, placements, and career prospects
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger
              value="undergraduate"
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white font-semibold"
            >
              <BookMarked className="h-4 w-4 mr-2" />
              Undergraduate
            </TabsTrigger>
            <TabsTrigger
              value="postgraduate"
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white font-semibold"
            >
              <Award className="h-4 w-4 mr-2" />
              Postgraduate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="undergraduate" className="space-y-4">
            <Card className="border-2 border-gray-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  <BookMarked className="h-6 w-6 text-yellow-500 mr-3" />
                  Undergraduate Courses
                </h3>
                <p className="text-sm text-gray-600 mb-6 flex items-center gap-2">
                  <MousePointer className="h-4 w-4 text-yellow-500" />
                  Click on any course to view details
                </p>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {undergraduateCourses.map((course, index) => {
                    const hasDetails = isCourseDetailed(course);
                    return (
                      <div
                        key={index}
                        onClick={() => hasDetails && handleCourseClick(course)}
                        className={`bg-gray-50 hover:bg-yellow-50 border border-gray-200 hover:border-yellow-300 rounded-lg p-3 text-center transition-all duration-200 ${
                          hasDetails ? 'cursor-pointer hover:shadow-md' : ''
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-700">
                          {course}
                          {hasDetails && <span className="ml-1 text-yellow-500">\u2192</span>}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="postgraduate" className="space-y-4">
            <Card className="border-2 border-gray-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  <Award className="h-6 w-6 text-yellow-500 mr-3" />
                  Postgraduate Courses
                </h3>
                <p className="text-sm text-gray-600 mb-6 flex items-center gap-2">
                  <MousePointer className="h-4 w-4 text-yellow-500" />
                  Click on any course to view details
                </p>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {postgraduateCourses.map((course, index) => {
                    const hasDetails = isCourseDetailed(course);
                    return (
                      <div
                        key={index}
                        onClick={() => hasDetails && handleCourseClick(course)}
                        className={`bg-gray-50 hover:bg-yellow-50 border border-gray-200 hover:border-yellow-300 rounded-lg p-3 transition-all duration-200 ${
                          hasDetails ? 'cursor-pointer hover:shadow-md' : ''
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-700">
                          {course}
                          {hasDetails && <span className="ml-1 text-yellow-500">\u2192</span>}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <CourseModal
        course={selectedCourse}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default Courses;