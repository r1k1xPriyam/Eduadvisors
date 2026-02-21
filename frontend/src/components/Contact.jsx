import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Phone, Mail, Send } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Contact = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    phone: '+91',
    email: '',
    current_institution: '',
    course: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          description: response.data.message,
        });

        // Reset form
        setFormData({
          name: '',
          phone: '+91',
          email: '',
          current_institution: '',
          course: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Error submitting query:', error);
      toast.error('Submission Failed', {
        description: 'Unable to submit your query. Please try again or call us directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-yellow-500 font-semibold text-sm uppercase tracking-wide mb-2">Get In Touch</h3>
          <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Start Your Journey Today</h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Have questions? Fill out the form and we'll get back to you shortly
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact Information</h3>
              <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Reach out to us for personalized educational counselling and guidance. We're here to help you achieve your academic goals.
              </p>
            </div>

            <div className="space-y-6">
              <Card className={`border-2 ${isDark ? 'border-yellow-700 bg-yellow-900/30' : 'border-yellow-200 bg-yellow-50'}`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Phone</h4>
                      <a href="tel:9332641552" className={`block ${isDark ? 'text-gray-300 hover:text-yellow-400' : 'text-gray-700 hover:text-yellow-500'}`}>
                        9332641552
                      </a>
                      <a href="tel:9382454940" className={`block ${isDark ? 'text-gray-300 hover:text-yellow-400' : 'text-gray-700 hover:text-yellow-500'}`}>
                        9382454940
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`border-2 ${isDark ? 'border-yellow-700 bg-yellow-900/30' : 'border-yellow-200 bg-yellow-50'}`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Email</h4>
                      <a href="mailto:info.eduadvisor26@gmail.com" className={`${isDark ? 'text-gray-300 hover:text-yellow-400' : 'text-gray-700 hover:text-yellow-500'}`}>
                        info.eduadvisor26@gmail.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Special Support</h4>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                In "Edu Advisor" we have counselling facility without any cost. We will solve all the problems from admission to the duration of the course (ex: Registration, Education Loan, etc.)
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <Card className={`border-2 shadow-xl ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200'}`}>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className={`mt-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'border-gray-300'} focus:border-yellow-500 focus:ring-yellow-500`}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91XXXXXXXXXX"
                    className={`mt-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'border-gray-300'} focus:border-yellow-500 focus:ring-yellow-500`}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="email" className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className={`mt-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'border-gray-300'} focus:border-yellow-500 focus:ring-yellow-500`}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="current_institution" className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Current Institution *</Label>
                  <Input
                    id="current_institution"
                    name="current_institution"
                    type="text"
                    required
                    value={formData.current_institution}
                    onChange={handleChange}
                    placeholder="e.g., ABC High School, XYZ College"
                    className={`mt-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'border-gray-300'} focus:border-yellow-500 focus:ring-yellow-500`}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="course" className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Course of Interest *</Label>
                  <Input
                    id="course"
                    name="course"
                    type="text"
                    required
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="e.g., B.Tech CSE, MBBS, MBA"
                    className={`mt-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'border-gray-300'} focus:border-yellow-500 focus:ring-yellow-500`}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="message" className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your educational goals..."
                    rows={4}
                    className={`mt-2 resize-none ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'border-gray-300'} focus:border-yellow-500 focus:ring-yellow-500`}
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-yellow-500 text-gray-900 hover:bg-yellow-600 font-semibold text-lg py-6 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Query'}
                  {!isSubmitting && <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;