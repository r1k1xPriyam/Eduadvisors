import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { X, GraduationCap, Phone, Mail, User, BookOpen, School, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const QueryPopup = () => {
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
      <Card className="max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-yellow-400">
        <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-3">
            <GraduationCap className="h-10 w-10" />
            <div>
              <CardTitle className="text-2xl">Get Free Counselling!</CardTitle>
              <p className="text-yellow-100 text-sm mt-1">Let our experts guide your career path</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="popup_name" className="flex items-center gap-2 text-gray-700">
                <User className="h-4 w-4 text-yellow-500" />
                Full Name *
              </Label>
              <Input
                id="popup_name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="popup_phone" className="flex items-center gap-2 text-gray-700">
                <Phone className="h-4 w-4 text-yellow-500" />
                Phone Number *
              </Label>
              <Input
                id="popup_phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="popup_email" className="flex items-center gap-2 text-gray-700">
                <Mail className="h-4 w-4 text-yellow-500" />
                Email Address *
              </Label>
              <Input
                id="popup_email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="popup_institution" className="flex items-center gap-2 text-gray-700">
                <School className="h-4 w-4 text-yellow-500" />
                Current Institution
              </Label>
              <Input
                id="popup_institution"
                name="current_institution"
                value={formData.current_institution}
                onChange={handleChange}
                placeholder="Your school/college name"
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="popup_course" className="flex items-center gap-2 text-gray-700">
                <BookOpen className="h-4 w-4 text-yellow-500" />
                Interested Course *
              </Label>
              <Input
                id="popup_course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                placeholder="e.g., B.Tech, MBBS, MBA"
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="popup_message" className="flex items-center gap-2 text-gray-700">
                <MessageSquare className="h-4 w-4 text-yellow-500" />
                Your Query (Optional)
              </Label>
              <Textarea
                id="popup_message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your career goals..."
                rows={3}
                className="mt-1 resize-none"
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-yellow-500 text-gray-900 hover:bg-yellow-600 font-semibold py-6 text-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                <>
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Get Free Counselling Now
                </>
              )}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Our expert counsellors will call you within 24 hours
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QueryPopup;
