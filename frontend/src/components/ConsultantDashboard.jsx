import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { 
  LogOut, 
  User, 
  Phone, 
  Building, 
  BookOpen, 
  Briefcase, 
  School,
  FileText,
  CheckCircle,
  Clock,
  PlusCircle,
  History,
  Calendar,
  Eye,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const INTEREST_SCOPE_OPTIONS = [
  "ACTIVELY INTERESTED",
  "LESS INTERESTED",
  "RECALLING NEEDED",
  "DROPOUT THIS YEAR",
  "ALREADY COLLEGE SELECTED",
  "NOT INTERESTED"
];

const ConsultantDashboard = () => {
  const navigate = useNavigate();
  const [consultantName, setConsultantName] = useState('');
  const [consultantId, setConsultantId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(null);
  const [canSubmit, setCanSubmit] = useState(true);
  
  const [formData, setFormData] = useState({
    student_name: '',
    contact_number: '',
    institution_name: '',
    competitive_exam_preference: '',
    career_interest: '',
    college_interest: '',
    interest_scope: '',
    other_remarks: ''
  });

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('consultantAuth');
    const storedName = localStorage.getItem('consultantName');
    const storedId = localStorage.getItem('consultantId');
    
    if (!isAuthenticated || !storedName || !storedId) {
      toast.error('Unauthorized Access', {
        description: 'Please login to access the consultant dashboard',
      });
      navigate('/consultant');
    } else {
      setConsultantName(storedName);
      setConsultantId(storedId);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('consultantAuth');
    localStorage.removeItem('consultantName');
    localStorage.removeItem('consultantId');
    localStorage.removeItem('consultantLoginTime');
    toast.success('Logged out successfully');
    navigate('/consultant');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, interest_scope: value }));
  };

  const resetForm = () => {
    setFormData({
      student_name: '',
      contact_number: '',
      institution_name: '',
      competitive_exam_preference: '',
      career_interest: '',
      college_interest: '',
      interest_scope: '',
      other_remarks: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!canSubmit) {
      toast.error('Please wait', {
        description: 'You can submit another report after 5 seconds',
      });
      return;
    }

    setIsSubmitting(true);
    setCanSubmit(false);

    try {
      const response = await axios.post(
        `${API}/consultant/reports?consultant_id=${consultantId}`,
        formData
      );
      
      if (response.data.success) {
        toast.success('Report Submitted Successfully!', {
          description: 'Your daily calling report has been recorded.',
        });
        
        resetForm();
        setLastSubmitTime(new Date());
        
        // Enable next submission after 5 seconds
        setTimeout(() => {
          setCanSubmit(true);
        }, 5000);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Submission Failed', {
        description: error.response?.data?.detail || 'Failed to submit report. Please try again.',
      });
      setCanSubmit(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Daily Report Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome, <span className="font-semibold text-green-600">{consultantName}</span></p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Last Submission Info */}
        {lastSubmitTime && (
          <div className="mb-6 bg-green-50 border border-green-200 p-4 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-800">
              Last report submitted at {lastSubmitTime.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}
            </p>
          </div>
        )}

        {!canSubmit && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-600 animate-pulse" />
            <p className="text-yellow-800">
              Please wait 5 seconds before submitting another report...
            </p>
          </div>
        )}

        {/* Report Form */}
        <Card className="shadow-xl border-2 border-gray-200">
          <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
            <CardTitle className="text-2xl">Student Calling Report</CardTitle>
            <p className="text-green-100 text-sm">Fill in the details for each student call</p>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Name */}
              <div>
                <Label htmlFor="student_name" className="text-gray-900 font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-green-500" />
                  Student Name *
                </Label>
                <Input
                  id="student_name"
                  name="student_name"
                  type="text"
                  required
                  value={formData.student_name}
                  onChange={handleChange}
                  placeholder="Enter student's full name"
                  className="mt-2"
                  disabled={isSubmitting}
                />
              </div>

              {/* Contact Number */}
              <div>
                <Label htmlFor="contact_number" className="text-gray-900 font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-500" />
                  Contact Number *
                </Label>
                <Input
                  id="contact_number"
                  name="contact_number"
                  type="tel"
                  required
                  value={formData.contact_number}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                  className="mt-2"
                  disabled={isSubmitting}
                />
              </div>

              {/* Institution Name */}
              <div>
                <Label htmlFor="institution_name" className="text-gray-900 font-semibold flex items-center gap-2">
                  <Building className="h-4 w-4 text-green-500" />
                  Institution Name *
                </Label>
                <Input
                  id="institution_name"
                  name="institution_name"
                  type="text"
                  required
                  value={formData.institution_name}
                  onChange={handleChange}
                  placeholder="Enter institution/school/college name"
                  className="mt-2"
                  disabled={isSubmitting}
                />
              </div>

              {/* Competitive Exam Preference */}
              <div>
                <Label htmlFor="competitive_exam_preference" className="text-gray-900 font-semibold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-green-500" />
                  Competitive Exam Preference *
                </Label>
                <Input
                  id="competitive_exam_preference"
                  name="competitive_exam_preference"
                  type="text"
                  required
                  value={formData.competitive_exam_preference}
                  onChange={handleChange}
                  placeholder="e.g., JEE, NEET, WBJEE, JENPAS"
                  className="mt-2"
                  disabled={isSubmitting}
                />
              </div>

              {/* Career Interest */}
              <div>
                <Label htmlFor="career_interest" className="text-gray-900 font-semibold flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-green-500" />
                  Career Interest *
                </Label>
                <Input
                  id="career_interest"
                  name="career_interest"
                  type="text"
                  required
                  value={formData.career_interest}
                  onChange={handleChange}
                  placeholder="e.g., Engineering, Medical, Management"
                  className="mt-2"
                  disabled={isSubmitting}
                />
              </div>

              {/* College Interest (Optional) */}
              <div>
                <Label htmlFor="college_interest" className="text-gray-900 font-semibold flex items-center gap-2">
                  <School className="h-4 w-4 text-gray-500" />
                  Any College Interest (Optional)
                </Label>
                <Input
                  id="college_interest"
                  name="college_interest"
                  type="text"
                  value={formData.college_interest}
                  onChange={handleChange}
                  placeholder="Enter specific college preferences if any"
                  className="mt-2"
                  disabled={isSubmitting}
                />
              </div>

              {/* Interest Scope */}
              <div>
                <Label htmlFor="interest_scope" className="text-gray-900 font-semibold flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-green-500" />
                  Interest Scope *
                </Label>
                <Select
                  value={formData.interest_scope}
                  onValueChange={handleSelectChange}
                  disabled={isSubmitting}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select interest level" />
                  </SelectTrigger>
                  <SelectContent>
                    {INTEREST_SCOPE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Other Remarks (Optional) */}
              <div>
                <Label htmlFor="other_remarks" className="text-gray-900 font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  Other Remarks (Optional)
                </Label>
                <Textarea
                  id="other_remarks"
                  name="other_remarks"
                  value={formData.other_remarks}
                  onChange={handleChange}
                  placeholder="Any additional notes or observations..."
                  rows={4}
                  className="mt-2 resize-none"
                  disabled={isSubmitting}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !canSubmit}
                className="w-full bg-green-500 text-white hover:bg-green-600 font-semibold text-lg py-6 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting Report...
                  </div>
                ) : !canSubmit ? (
                  'Please wait...'
                ) : (
                  'Submit Report'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsultantDashboard;
