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
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
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
  Calendar as CalendarIcon,
  Eye,
  RefreshCw,
  X,
  GraduationCap,
  DollarSign,
  Award,
  PhoneCall,
  PhoneOff,
  PhoneMissed
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { format } from 'date-fns';
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
  const [activeTab, setActiveTab] = useState('submit');
  const [myReports, setMyReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // My Admissions State
  const [myAdmissions, setMyAdmissions] = useState([]);
  
  // Call Logging State
  const [callStats, setCallStats] = useState({ total_calls: 0, successful_calls: 0, failed_calls: 0, attempted_calls: 0 });
  const [showQuickCall, setShowQuickCall] = useState(false);
  const [quickCallData, setQuickCallData] = useState({ call_type: 'attempted', student_name: '', contact_number: '', remarks: '' });
  const [loadingAdmissions, setLoadingAdmissions] = useState(false);
  
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

  // Fetch reports when tab changes to 'reports' or when consultantId is set
  useEffect(() => {
    if (consultantId && activeTab === 'reports') {
      fetchMyReports();
    }
    if (consultantId && activeTab === 'admissions') {
      fetchMyAdmissions();
    }
    if (consultantId && activeTab === 'calls') {
      fetchCallStats();
    }
  }, [consultantId, activeTab]);

  // Fetch call stats on load
  useEffect(() => {
    if (consultantId) {
      fetchCallStats();
    }
  }, [consultantId]);

  const fetchCallStats = async () => {
    if (!consultantId) return;
    try {
      const response = await axios.get(`${API}/consultant/calls/${consultantId}`);
      if (response.data.success) {
        setCallStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching call stats:', error);
    }
  };

  const handleQuickCall = async (callType) => {
    try {
      const params = new URLSearchParams({
        consultant_id: consultantId,
        call_type: callType,
        student_name: quickCallData.student_name || 'N/A',
        contact_number: quickCallData.contact_number || 'N/A',
        remarks: quickCallData.remarks || ''
      });
      const response = await axios.post(`${API}/consultant/calls?${params.toString()}`);
      if (response.data.success) {
        toast.success(`${callType.charAt(0).toUpperCase() + callType.slice(1)} call logged!`);
        fetchCallStats();
        setShowQuickCall(false);
        setQuickCallData({ call_type: 'attempted', student_name: '', contact_number: '', remarks: '' });
      }
    } catch (error) {
      console.error('Error logging call:', error);
      toast.error('Failed to log call');
    }
  };

  const fetchMyReports = async () => {
    if (!consultantId) return;
    
    setLoadingReports(true);
    try {
      const response = await axios.get(`${API}/consultant/reports/${consultantId}`);
      if (response.data.success) {
        setMyReports(response.data.reports);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoadingReports(false);
    }
  };

  // Fetch My Admissions
  const fetchMyAdmissions = async () => {
    if (!consultantId) return;
    
    setLoadingAdmissions(true);
    try {
      const response = await axios.get(`${API}/consultant/admissions/${consultantId}`);
      if (response.data.success) {
        setMyAdmissions(response.data.admissions);
      }
    } catch (error) {
      console.error('Error fetching admissions:', error);
      toast.error('Failed to load admissions');
    } finally {
      setLoadingAdmissions(false);
    }
  };

  // Filter reports by selected date
  useEffect(() => {
    if (selectedDate) {
      const filtered = myReports.filter(report => {
        const reportDate = new Date(report.created_at);
        return reportDate.toDateString() === selectedDate.toDateString();
      });
      setFilteredReports(filtered);
    } else {
      setFilteredReports(myReports);
    }
  }, [myReports, selectedDate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
  };

  const getTodayReportsCount = () => {
    const today = new Date().toDateString();
    return myReports.filter(report => {
      const reportDate = new Date(report.created_at).toDateString();
      return reportDate === today;
    }).length;
  };

  const getThisWeekReportsCount = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return myReports.filter(report => {
      const reportDate = new Date(report.created_at);
      return reportDate >= weekAgo;
    }).length;
  };

  const getFilteredReportsCount = () => {
    return filteredReports.length;
  };

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
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="container mx-auto px-2 md:px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 md:p-6 rounded-lg shadow-lg border-l-4 border-green-500">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">Daily Report Dashboard</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Welcome, <span className="font-semibold text-green-600">{consultantName}</span></p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 w-full sm:w-auto"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Quick Call Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-3 md:p-4 flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm opacity-80">Total Calls</p>
                <p className="text-xl md:text-2xl font-bold">{callStats.total_calls}</p>
              </div>
              <PhoneCall className="h-6 w-6 md:h-8 md:w-8 opacity-80" />
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-3 md:p-4 flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm opacity-80">Successful</p>
                <p className="text-xl md:text-2xl font-bold">{callStats.successful_calls}</p>
              </div>
              <CheckCircle className="h-6 w-6 md:h-8 md:w-8 opacity-80" />
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-3 md:p-4 flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm opacity-80">Failed</p>
                <p className="text-xl md:text-2xl font-bold">{callStats.failed_calls}</p>
              </div>
              <PhoneOff className="h-6 w-6 md:h-8 md:w-8 opacity-80" />
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-3 md:p-4 flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm opacity-80">Attempted</p>
                <p className="text-xl md:text-2xl font-bold">{callStats.attempted_calls}</p>
              </div>
              <PhoneMissed className="h-6 w-6 md:h-8 md:w-8 opacity-80" />
            </CardContent>
          </Card>
        </div>

        {/* Quick Log Call Button */}
        <div className="mb-4 md:mb-6">
          <Button
            onClick={() => setShowQuickCall(true)}
            className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            <PhoneCall className="h-4 w-4 mr-2" />
            Quick Log Call
          </Button>
        </div>

        {/* Quick Call Modal */}
        {showQuickCall && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Quick Log Call</CardTitle>
                  <button onClick={() => setShowQuickCall(false)} className="text-white hover:text-gray-200">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <Label className="text-sm">Student Name (Optional)</Label>
                  <Input
                    value={quickCallData.student_name}
                    onChange={(e) => setQuickCallData({...quickCallData, student_name: e.target.value})}
                    placeholder="Enter name or leave blank"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Contact Number (Optional)</Label>
                  <Input
                    value={quickCallData.contact_number}
                    onChange={(e) => setQuickCallData({...quickCallData, contact_number: e.target.value})}
                    placeholder="Enter number or leave blank"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Remarks (Optional)</Label>
                  <Textarea
                    value={quickCallData.remarks}
                    onChange={(e) => setQuickCallData({...quickCallData, remarks: e.target.value})}
                    placeholder="Brief note..."
                    className="mt-1"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <Button
                    onClick={() => handleQuickCall('successful')}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Success
                  </Button>
                  <Button
                    onClick={() => handleQuickCall('failed')}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <PhoneOff className="h-4 w-4 mr-1" />
                    Failed
                  </Button>
                  <Button
                    onClick={() => handleQuickCall('attempted')}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    <PhoneMissed className="h-4 w-4 mr-1" />
                    Attempt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-gray-100 p-1 rounded-lg gap-1">
            <TabsTrigger
              value="submit"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white font-semibold text-xs md:text-sm px-2 py-2"
            >
              <PlusCircle className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Submit </span>Report
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white font-semibold text-xs md:text-sm px-2 py-2"
            >
              <History className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">My </span>Reports
            </TabsTrigger>
            <TabsTrigger
              value="calls"
              className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white font-semibold text-xs md:text-sm px-2 py-2"
            >
              <PhoneCall className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">My </span>Calls
            </TabsTrigger>
            <TabsTrigger
              value="admissions"
              className="data-[state=active]:bg-purple-500 data-[state=active]:text-white font-semibold text-xs md:text-sm px-2 py-2"
            >
              <Award className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">My </span>Admissions
            </TabsTrigger>
          </TabsList>

          {/* Submit Report Tab */}
          <TabsContent value="submit">
            {/* Last Submission Info */}
            {lastSubmitTime && (
              <div className="mb-4 md:mb-6 bg-green-50 border border-green-200 p-3 md:p-4 rounded-lg flex items-center gap-2">
                <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                <p className="text-sm md:text-base text-green-800">
                  Last report submitted at {lastSubmitTime.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </p>
              </div>
            )}

            {!canSubmit && (
              <div className="mb-4 md:mb-6 bg-yellow-50 border border-yellow-200 p-3 md:p-4 rounded-lg flex items-center gap-2">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-yellow-600 animate-pulse" />
                <p className="text-sm md:text-base text-yellow-800">
                  Please wait 5 seconds before submitting another report...
                </p>
              </div>
            )}

            {/* Report Form */}
            <Card className="shadow-xl border-2 border-gray-200">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 md:p-6">
                <CardTitle className="text-lg md:text-2xl">Student Calling Report</CardTitle>
                <p className="text-green-100 text-xs md:text-sm">Fill in the details for each student call</p>
              </CardHeader>
              <CardContent className="p-4 md:p-8">
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
          </TabsContent>

          {/* My Reports Tab */}
          <TabsContent value="reports">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Reports</p>
                      <p className="text-3xl font-bold text-gray-900">{myReports.length}</p>
                    </div>
                    <FileText className="h-10 w-10 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Today</p>
                      <p className="text-3xl font-bold text-green-600">{getTodayReportsCount()}</p>
                    </div>
                    <CalendarIcon className="h-10 w-10 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">This Week</p>
                      <p className="text-3xl font-bold text-purple-600">{getThisWeekReportsCount()}</p>
                    </div>
                    <History className="h-10 w-10 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Date Filter and Refresh */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`min-w-[180px] justify-start text-left font-normal ${!selectedDate && 'text-muted-foreground'}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, 'dd MMM yyyy') : 'Filter by Date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setIsCalendarOpen(false);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    {selectedDate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDate(null)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                    )}

                    {selectedDate && (
                      <Badge className="bg-blue-100 text-blue-800">
                        Showing {getFilteredReportsCount()} report(s) for {format(selectedDate, 'dd MMM yyyy')}
                      </Badge>
                    )}
                  </div>

                  <Button
                    onClick={fetchMyReports}
                    variant="outline"
                    disabled={loadingReports}
                    className="border-gray-300"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loadingReports ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reports Table */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <CardTitle className="text-xl">My Submitted Reports</CardTitle>
                <p className="text-blue-100 text-sm">View all your daily calling reports with date and time</p>
              </CardHeader>
              <CardContent className="p-0">
                {loadingReports ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="ml-3 text-gray-600">Loading reports...</p>
                  </div>
                ) : filteredReports.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                      {selectedDate ? `No reports found for ${format(selectedDate, 'dd MMM yyyy')}` : 'No reports submitted yet'}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      {selectedDate ? 'Try selecting a different date' : 'Start submitting your daily reports!'}
                    </p>
                    {!selectedDate && (
                      <Button
                        onClick={() => setActiveTab('submit')}
                        className="mt-4 bg-green-500 hover:bg-green-600"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Submit First Report
                      </Button>
                    )}
                    {selectedDate && (
                      <Button
                        onClick={() => setSelectedDate(null)}
                        variant="outline"
                        className="mt-4"
                      >
                        Clear Date Filter
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">Date & Time (IST)</TableHead>
                          <TableHead className="font-semibold">Student Name</TableHead>
                          <TableHead className="font-semibold">Contact</TableHead>
                          <TableHead className="font-semibold">Institution</TableHead>
                          <TableHead className="font-semibold">Interest Scope</TableHead>
                          <TableHead className="font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReports.map((report, index) => (
                          <TableRow key={report.id || index} className="hover:bg-gray-50">
                            <TableCell className="text-sm">
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-gray-400" />
                                {formatDate(report.created_at)}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{report.student_name}</TableCell>
                            <TableCell>
                              <a href={`tel:${report.contact_number}`} className="text-blue-600 hover:underline flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {report.contact_number}
                              </a>
                            </TableCell>
                            <TableCell className="text-sm text-gray-700">{report.institution_name}</TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  report.interest_scope === 'ACTIVELY INTERESTED' ? 'bg-green-100 text-green-800' :
                                  report.interest_scope === 'LESS INTERESTED' ? 'bg-yellow-100 text-yellow-800' :
                                  report.interest_scope === 'NOT INTERESTED' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                                }
                              >
                                {report.interest_scope}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedReport(report)}
                                className="text-xs"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Calls Tab */}
          <TabsContent value="calls">
            <Card>
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">My Call History</CardTitle>
                <p className="text-indigo-100 text-xs md:text-sm">Track all your calls - successful, failed, and attempted</p>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="text-center py-8 md:py-12">
                  <PhoneCall className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-base md:text-lg">Use "Quick Log Call" to track your calls</p>
                  <p className="text-gray-400 text-xs md:text-sm mt-2">Your call statistics are displayed in the cards above</p>
                  <div className="mt-6 grid grid-cols-3 gap-4 max-w-md mx-auto">
                    <div className="bg-green-50 p-3 md:p-4 rounded-lg">
                      <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-lg md:text-2xl font-bold text-green-600">{callStats.successful_calls}</p>
                      <p className="text-xs text-gray-600">Successful</p>
                    </div>
                    <div className="bg-red-50 p-3 md:p-4 rounded-lg">
                      <PhoneOff className="h-6 w-6 md:h-8 md:w-8 text-red-500 mx-auto mb-2" />
                      <p className="text-lg md:text-2xl font-bold text-red-600">{callStats.failed_calls}</p>
                      <p className="text-xs text-gray-600">Failed</p>
                    </div>
                    <div className="bg-yellow-50 p-3 md:p-4 rounded-lg">
                      <PhoneMissed className="h-6 w-6 md:h-8 md:w-8 text-yellow-500 mx-auto mb-2" />
                      <p className="text-lg md:text-2xl font-bold text-yellow-600">{callStats.attempted_calls}</p>
                      <p className="text-xs text-gray-600">Attempted</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowQuickCall(true)}
                    className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600"
                  >
                    <PhoneCall className="h-4 w-4 mr-2" />
                    Log a Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Admissions Tab */}
          <TabsContent value="admissions">
            {/* Stats Cards for Admissions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-6">
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">Total Admissions</p>
                      <p className="text-2xl md:text-3xl font-bold text-gray-900">{myAdmissions.length}</p>
                    </div>
                    <GraduationCap className="h-8 w-8 md:h-10 md:w-10 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Earnings</p>
                      <p className="text-3xl font-bold text-green-600">
                        ₹{myAdmissions.reduce((sum, a) => sum + parseFloat(a.payout_amount || 0), 0).toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="h-10 w-10 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Payout Received</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {myAdmissions.filter(a => a.payout_status === "CONSULTANT'S COMMISION GIVEN").length}
                      </p>
                    </div>
                    <CheckCircle className="h-10 w-10 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Refresh Button */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Your Credited Admissions</h3>
                    <p className="text-sm text-gray-500">Admissions assigned to you by the admin</p>
                  </div>
                  <Button
                    onClick={fetchMyAdmissions}
                    variant="outline"
                    disabled={loadingAdmissions}
                    className="border-gray-300"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loadingAdmissions ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Admissions Table */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <CardTitle className="text-xl">My Admissions ({myAdmissions.length})</CardTitle>
                <p className="text-purple-100 text-sm">View all admissions credited to you and their payout status</p>
              </CardHeader>
              <CardContent className="p-0">
                {loadingAdmissions ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="ml-3 text-gray-600">Loading admissions...</p>
                  </div>
                ) : myAdmissions.length === 0 ? (
                  <div className="text-center py-12">
                    <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No admissions credited yet</p>
                    <p className="text-gray-400 text-sm mt-2">When students are admitted through your referral, they will appear here</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">Student Name</TableHead>
                          <TableHead className="font-semibold">Course</TableHead>
                          <TableHead className="font-semibold">College</TableHead>
                          <TableHead className="font-semibold">Admission Date</TableHead>
                          <TableHead className="font-semibold">Payout Amount</TableHead>
                          <TableHead className="font-semibold">Payout Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {myAdmissions.map((admission, index) => (
                          <TableRow key={admission.id || index} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{admission.student_name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-blue-50">
                                {admission.course}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">{admission.college}</TableCell>
                            <TableCell className="text-sm">{admission.admission_date}</TableCell>
                            <TableCell className="font-semibold text-green-600">
                              ₹{parseFloat(admission.payout_amount).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  admission.payout_status === 'PAYOUT NOT CREDITED YET' ? 'bg-yellow-100 text-yellow-800' :
                                  admission.payout_status === 'PAYOUT REFLECTED' ? 'bg-blue-100 text-blue-800' :
                                  'bg-green-100 text-green-800'
                                }
                              >
                                {admission.payout_status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payout Summary */}
            {myAdmissions.length > 0 && (
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout Summary</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-yellow-700 font-medium">Pending</p>
                      <p className="text-2xl font-bold text-yellow-800">
                        ₹{myAdmissions
                          .filter(a => a.payout_status === 'PAYOUT NOT CREDITED YET')
                          .reduce((sum, a) => sum + parseFloat(a.payout_amount || 0), 0)
                          .toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-700 font-medium">Reflected</p>
                      <p className="text-2xl font-bold text-blue-800">
                        ₹{myAdmissions
                          .filter(a => a.payout_status === 'PAYOUT REFLECTED')
                          .reduce((sum, a) => sum + parseFloat(a.payout_amount || 0), 0)
                          .toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-700 font-medium">Received</p>
                      <p className="text-2xl font-bold text-green-800">
                        ₹{myAdmissions
                          .filter(a => a.payout_status === "CONSULTANT'S COMMISION GIVEN")
                          .reduce((sum, a) => sum + parseFloat(a.payout_amount || 0), 0)
                          .toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Report Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle>Report Details</CardTitle>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="text-white hover:text-gray-200 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Submitted On</label>
                    <p className="text-gray-900 mt-1 font-medium">{formatDate(selectedReport.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Student Name</label>
                    <p className="text-gray-900 mt-1 font-medium">{selectedReport.student_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Contact Number</label>
                    <p className="text-gray-900 mt-1">
                      <a href={`tel:${selectedReport.contact_number}`} className="text-blue-600 hover:underline">
                        {selectedReport.contact_number}
                      </a>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Institution</label>
                    <p className="text-gray-900 mt-1">{selectedReport.institution_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Exam Preference</label>
                    <p className="text-gray-900 mt-1">{selectedReport.competitive_exam_preference}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Career Interest</label>
                    <p className="text-gray-900 mt-1">{selectedReport.career_interest}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Interest Scope</label>
                    <Badge 
                      className={
                        selectedReport.interest_scope === 'ACTIVELY INTERESTED' ? 'bg-green-100 text-green-800' :
                        selectedReport.interest_scope === 'LESS INTERESTED' ? 'bg-yellow-100 text-yellow-800' :
                        selectedReport.interest_scope === 'NOT INTERESTED' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }
                    >
                      {selectedReport.interest_scope}
                    </Badge>
                  </div>
                  {selectedReport.college_interest && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600">College Interest</label>
                      <p className="text-gray-900 mt-1">{selectedReport.college_interest}</p>
                    </div>
                  )}
                </div>
                {selectedReport.other_remarks && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Other Remarks</label>
                    <p className="text-gray-900 mt-2 bg-gray-50 p-3 rounded-lg">{selectedReport.other_remarks}</p>
                  </div>
                )}
                <div className="flex justify-end pt-4 border-t">
                  <Button
                    onClick={() => setSelectedReport(null)}
                    variant="outline"
                    className="px-6"
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantDashboard;
