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
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
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
  }, [consultantId, activeTab]);

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg max-w-md">
            <TabsTrigger
              value="submit"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white font-semibold"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Submit Report
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white font-semibold"
            >
              <History className="h-4 w-4 mr-2" />
              My Reports
            </TabsTrigger>
          </TabsList>

          {/* Submit Report Tab */}
          <TabsContent value="submit">
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
