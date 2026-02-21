import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { X, GraduationCap, Phone, Mail, User, BookOpen, School, MessageSquare, CheckCircle, Star } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useTheme } from '../context/ThemeContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const QueryPopup = () => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: '',
    current_institution: '',
    message: ''
  });

  useEffect(() => {
    // Check if popup was closed in this session
    const popupClosed = sessionStorage.getItem('queryPopupClosed');
    if (!popupClosed) {
      // Show popup after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for custom event to open popup from anywhere
  useEffect(() => {
    const handleOpenPopup = () => {
      setIsOpen(true);
    };
    window.addEventListener('openQueryPopup', handleOpenPopup);
    return () => window.removeEventListener('openQueryPopup', handleOpenPopup);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('queryPopupClosed', 'true');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API}/queries`, formData);
      if (response.data.success) {
        toast.success('Query Submitted!', {
          description: 'Our counsellor will contact you shortly.',
        });
        setFormData({
          name: '',
          phone: '',
          email: '',
          course: '',
          current_institution: '',
          message: ''
        });
        handleClose();
      }
    } catch (error) {
      console.error('Error submitting query:', error);
      toast.error('Failed to submit query. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <Card className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-yellow-400 ${isDark ? 'bg-gray-800' : ''}`}>
        <div className="grid md:grid-cols-2">
          {/* Left Side - Image & Info */}
          <div className="hidden md:block relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 p-6">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 md:hidden text-white hover:text-gray-200 transition-colors z-10"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* Image */}
            <div className="relative mb-6 rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1565688420536-11a4ddfa246f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwyfHxzdHVkZW50JTIwY291bnNlbGxpbmclMjBlZHVjYXRpb24lMjBndWlkYW5jZSUyMGNhcmVlcnxlbnwwfHx8fDE3NzAzODc1NTN8MA&ixlib=rb-4.1.0&q=85"
                alt="Student Counselling"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-3 left-3 text-white">
                <p className="font-bold text-lg">Expert Guidance</p>
                <p className="text-sm text-yellow-200">For Your Future</p>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-4 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-200" />
                Why Choose Us?
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <CheckCircle className="h-5 w-5 text-yellow-200 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">5000+ Students Guided</p>
                    <p className="text-sm text-yellow-100">Successfully placed in top colleges</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <CheckCircle className="h-5 w-5 text-yellow-200 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">100% Free Counselling</p>
                    <p className="text-sm text-yellow-100">No hidden charges, ever!</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <CheckCircle className="h-5 w-5 text-yellow-200 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Expert Counsellors</p>
                    <p className="text-sm text-yellow-100">Personalized career guidance</p>
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <p className="text-sm italic">"Edu Advisor helped me get into my dream college. Their guidance was invaluable!"</p>
                <p className="text-xs mt-2 text-yellow-200">- Rahul S., B.Tech Student</p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="relative">
            <button
              onClick={handleClose}
              className={`absolute top-4 right-4 transition-colors z-10 ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            <CardHeader className={`pt-8 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <div className="flex items-center gap-3">
                <GraduationCap className="h-8 w-8 text-yellow-500" />
                <div>
                  <CardTitle className="text-xl">Get Free Counselling!</CardTitle>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Fill the form & we'll call you</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <Label htmlFor="popup_name" className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <User className="h-3 w-3 text-yellow-500" />
                    Full Name *
                  </Label>
                  <Input
                    id="popup_name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className={`mt-1 h-9 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}`}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="popup_phone" className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <Phone className="h-3 w-3 text-yellow-500" />
                      Phone *
                    </Label>
                    <Input
                      id="popup_phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Phone number"
                      className={`mt-1 h-9 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}`}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="popup_email" className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <Mail className="h-3 w-3 text-yellow-500" />
                      Email *
                    </Label>
                    <Input
                      id="popup_email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Email address"
                      className={`mt-1 h-9 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}`}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="popup_institution" className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <School className="h-3 w-3 text-yellow-500" />
                    Current Institution
                  </Label>
                  <Input
                    id="popup_institution"
                    name="current_institution"
                    value={formData.current_institution}
                    onChange={handleChange}
                    placeholder="Your school/college name"
                    className={`mt-1 h-9 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}`}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="popup_course" className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <BookOpen className="h-3 w-3 text-yellow-500" />
                    Interested Course *
                  </Label>
                  <Input
                    id="popup_course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    placeholder="e.g., B.Tech, MBBS, MBA"
                    className={`mt-1 h-9 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}`}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="popup_message" className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <MessageSquare className="h-3 w-3 text-yellow-500" />
                    Your Query (Optional)
                  </Label>
                  <Textarea
                    id="popup_message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your career goals..."
                    rows={2}
                    className={`mt-1 resize-none ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}`}
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-yellow-500 text-gray-900 hover:bg-yellow-600 font-semibold py-5 text-base"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </div>
                  ) : (
                    <>
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Get Free Counselling Now
                    </>
                  )}
                </Button>

                <p className={`text-center text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Our expert counsellors will call you within 24 hours
                </p>
              </form>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QueryPopup;
