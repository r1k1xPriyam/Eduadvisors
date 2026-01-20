import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Phone, Mail, Send } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '+91',
    email: '',
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
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-yellow-500 font-semibold text-sm uppercase tracking-wide mb-2">Get In Touch</h3>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Start Your Journey Today</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions? Fill out the form and we'll get back to you shortly
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h3>
              <p className="text-gray-600 leading-relaxed">
                Reach out to us for personalized educational counselling and guidance. We're here to help you achieve your academic goals.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="border-2 border-yellow-200 bg-yellow-50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Phone</h4>
                      <a href="tel:+919332641552" className="text-gray-700 hover:text-yellow-500 block">
                        +91-9332641552
                      </a>
                      <a href="tel:+919339475845" className="text-gray-700 hover:text-yellow-500 block">
                        +91-9339475845
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-yellow-200 bg-yellow-50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                      <a href="mailto:info.eduadvisor26@gmail.com" className="text-gray-700 hover:text-yellow-500">
                        info.eduadvisor26@gmail.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">Special Support</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                In "Edu Advisor" we have counselling facility without any cost. We will solve all the problems from admission to the duration of the course (ex: Registration, Education Loan, etc.)
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="border-2 border-gray-200 shadow-xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-900 font-semibold">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="mt-2 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-900 font-semibold">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91XXXXXXXXXX"
                    className="mt-2 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-900 font-semibold">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="mt-2 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="course" className="text-gray-900 font-semibold">Course of Interest *</Label>
                  <Input
                    id="course"
                    name="course"
                    type="text"
                    required
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="e.g., B.Tech CSE, MBBS, MBA"
                    className="mt-2 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-900 font-semibold">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your educational goals..."
                    rows={4}
                    className="mt-2 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 resize-none"
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