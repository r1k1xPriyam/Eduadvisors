import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
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
import { Search, Download, Phone, Mail, Calendar as CalendarIcon, BookOpen, MessageSquare, Filter, LogOut, Users, FileText, X, Trash2, Plus, Edit, UserPlus, Settings, GraduationCap, DollarSign, Building, CheckCircle, PhoneCall, PhoneOff, PhoneMissed, AlertTriangle, Lock, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { format } from 'date-fns';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PAYOUT_STATUS_OPTIONS = [
  "PAYOUT NOT CREDITED YET",
  "PAYOUT REFLECTED",
  "CONSULTANT'S COMMISION GIVEN"
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('queries');
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [consultantReports, setConsultantReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [reportsByConsultant, setReportsByConsultant] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [reportSearchTerm, setReportSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedConsultant, setSelectedConsultant] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Consultant Management State
  const [consultants, setConsultants] = useState([]);
  const [showAddConsultant, setShowAddConsultant] = useState(false);
  const [editingConsultant, setEditingConsultant] = useState(null);
  const [newConsultant, setNewConsultant] = useState({ user_id: '', name: '', password: '' });

  // Admissions State
  const [admissions, setAdmissions] = useState([]);
  const [showAddAdmission, setShowAddAdmission] = useState(false);
  const [editingAdmission, setEditingAdmission] = useState(null);

  // Call Stats State
  const [callStats, setCallStats] = useState({ overall_stats: { total_calls: 0, successful_calls: 0, failed_calls: 0 }, consultant_stats: {} });

  // Bulk Delete State
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [bulkDeletePassword, setBulkDeletePassword] = useState('');
  const [bulkDeleteType, setBulkDeleteType] = useState('reports');
  const [bulkDeleteConsultant, setBulkDeleteConsultant] = useState('');
  const [bulkDeleteStartDate, setBulkDeleteStartDate] = useState('');
  const [bulkDeleteEndDate, setBulkDeleteEndDate] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [newAdmission, setNewAdmission] = useState({
    student_name: '',
    course: '',
    college: '',
    admission_date: '',
    consultant_id: '',
    consultant_name: '',
    payout_amount: '',
    payout_status: 'PAYOUT NOT CREDITED YET'
  });

  // Check authentication on component mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      toast.error('Unauthorized Access', {
        description: 'Please login to access the admin dashboard',
      });
      navigate('/admin');
    }
  }, [navigate]);

  useEffect(() => {
    fetchQueries();
    fetchConsultantReports();
    fetchConsultants();
    fetchAdmissions();
    fetchCallStats();
  }, []);

  useEffect(() => {
    filterQueries();
  }, [queries, searchTerm, filterStatus]);

  useEffect(() => {
    filterReports();
  }, [consultantReports, reportSearchTerm, selectedConsultant, selectedDate]);

  // Fetch Call Stats
  const fetchCallStats = async () => {
    try {
      const response = await axios.get(`${API}/admin/calls`);
      if (response.data.success) {
        setCallStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching call stats:', error);
    }
  };

  // Bulk Delete Handler
  const handleBulkDelete = async () => {
    if (!bulkDeletePassword) {
      toast.error('Please enter admin password');
      return;
    }
    
    if (!window.confirm(`Are you ABSOLUTELY SURE you want to delete ${bulkDeleteType === 'all' ? 'ALL DATA' : bulkDeleteType}? This action CANNOT be undone!`)) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const params = new URLSearchParams({
        password: bulkDeletePassword,
        delete_type: bulkDeleteType
      });
      if (bulkDeleteConsultant) params.append('consultant_id', bulkDeleteConsultant);
      if (bulkDeleteStartDate) params.append('start_date', bulkDeleteStartDate);
      if (bulkDeleteEndDate) params.append('end_date', bulkDeleteEndDate);
      
      const response = await axios.post(`${API}/admin/bulk-delete?${params.toString()}`);
      if (response.data.success) {
        toast.success(response.data.message);
        // Refresh all data
        fetchQueries();
        fetchConsultantReports();
        fetchAdmissions();
        fetchCallStats();
        setShowBulkDelete(false);
        setBulkDeletePassword('');
      }
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error(error.response?.data?.detail || 'Failed to delete data. Check password.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Fetch Consultants
  const fetchConsultants = async () => {
    try {
      const response = await axios.get(`${API}/admin/consultants`);
      if (response.data.success) {
        setConsultants(response.data.consultants);
      }
    } catch (error) {
      console.error('Error fetching consultants:', error);
    }
  };

  // Fetch Admissions
  const fetchAdmissions = async () => {
    try {
      const response = await axios.get(`${API}/admin/admissions`);
      if (response.data.success) {
        setAdmissions(response.data.admissions);
      }
    } catch (error) {
      console.error('Error fetching admissions:', error);
      toast.error('Failed to load admissions');
    }
  };

  // Add Admission
  const handleAddAdmission = async () => {
    if (!newAdmission.student_name || !newAdmission.course || !newAdmission.college || 
        !newAdmission.admission_date || !newAdmission.consultant_id || !newAdmission.payout_amount) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      const selectedConsultant = consultants.find(c => c.user_id === newAdmission.consultant_id);
      const params = new URLSearchParams({
        student_name: newAdmission.student_name,
        course: newAdmission.course,
        college: newAdmission.college,
        admission_date: newAdmission.admission_date,
        consultant_id: newAdmission.consultant_id,
        consultant_name: selectedConsultant?.name || newAdmission.consultant_id,
        payout_amount: newAdmission.payout_amount,
        payout_status: newAdmission.payout_status
      });
      const response = await axios.post(`${API}/admin/admissions?${params.toString()}`);
      if (response.data.success) {
        toast.success('Admission recorded successfully');
        fetchAdmissions();
        setNewAdmission({
          student_name: '',
          course: '',
          college: '',
          admission_date: '',
          consultant_id: '',
          consultant_name: '',
          payout_amount: '',
          payout_status: 'PAYOUT NOT CREDITED YET'
        });
        setShowAddAdmission(false);
      }
    } catch (error) {
      console.error('Error adding admission:', error);
      toast.error(error.response?.data?.detail || 'Failed to add admission');
    }
  };

  // Update Admission
  const handleUpdateAdmission = async () => {
    if (!editingAdmission) return;
    try {
      const selectedConsultant = consultants.find(c => c.user_id === editingAdmission.consultant_id);
      const params = new URLSearchParams();
      params.append('student_name', editingAdmission.student_name);
      params.append('course', editingAdmission.course);
      params.append('college', editingAdmission.college);
      params.append('admission_date', editingAdmission.admission_date);
      params.append('consultant_id', editingAdmission.consultant_id);
      params.append('consultant_name', selectedConsultant?.name || editingAdmission.consultant_name);
      params.append('payout_amount', editingAdmission.payout_amount);
      params.append('payout_status', editingAdmission.payout_status);
      
      const response = await axios.put(`${API}/admin/admissions/${editingAdmission.id}?${params.toString()}`);
      if (response.data.success) {
        toast.success('Admission updated successfully');
        fetchAdmissions();
        setEditingAdmission(null);
      }
    } catch (error) {
      console.error('Error updating admission:', error);
      toast.error('Failed to update admission');
    }
  };

  // Delete Admission
  const handleDeleteAdmission = async (admissionId) => {
    if (!window.confirm('Are you sure you want to delete this admission record? This action cannot be undone.')) {
      return;
    }
    try {
      const response = await axios.delete(`${API}/admin/admissions/${admissionId}`);
      if (response.data.success) {
        toast.success('Admission deleted successfully');
        fetchAdmissions();
      }
    } catch (error) {
      console.error('Error deleting admission:', error);
      toast.error('Failed to delete admission');
    }
  };

  // Delete Query
  const handleDeleteQuery = async (queryId) => {
    if (!window.confirm('Are you sure you want to delete this query? This action cannot be undone.')) {
      return;
    }
    try {
      const response = await axios.delete(`${API}/queries/${queryId}`);
      if (response.data.success) {
        toast.success('Query deleted successfully');
        fetchQueries();
        setSelectedQuery(null);
      }
    } catch (error) {
      console.error('Error deleting query:', error);
      toast.error('Failed to delete query');
    }
  };

  // Delete Consultant Report
  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report? This will also remove it from the consultant\'s view.')) {
      return;
    }
    try {
      const response = await axios.delete(`${API}/consultant/reports/${reportId}`);
      if (response.data.success) {
        toast.success('Report deleted successfully');
        fetchConsultantReports();
        setSelectedReport(null);
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
    }
  };

  // Add Consultant
  const handleAddConsultant = async () => {
    if (!newConsultant.user_id || !newConsultant.name || !newConsultant.password) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      const response = await axios.post(`${API}/admin/consultants?user_id=${encodeURIComponent(newConsultant.user_id)}&name=${encodeURIComponent(newConsultant.name)}&password=${encodeURIComponent(newConsultant.password)}`);
      if (response.data.success) {
        toast.success('Consultant added successfully');
        fetchConsultants();
        setNewConsultant({ user_id: '', name: '', password: '' });
        setShowAddConsultant(false);
      }
    } catch (error) {
      console.error('Error adding consultant:', error);
      toast.error(error.response?.data?.detail || 'Failed to add consultant');
    }
  };

  // Update Consultant - Only User ID and Password can be changed
  const handleUpdateConsultant = async () => {
    if (!editingConsultant) return;
    try {
      const params = new URLSearchParams();
      if (editingConsultant.new_user_id && editingConsultant.new_user_id !== editingConsultant.original_user_id) {
        params.append('new_user_id', editingConsultant.new_user_id);
      }
      if (editingConsultant.password) params.append('password', editingConsultant.password);
      
      const response = await axios.put(`${API}/admin/consultants/${editingConsultant.original_user_id}?${params.toString()}`);
      if (response.data.success) {
        toast.success('Consultant updated successfully');
        fetchConsultants();
        setEditingConsultant(null);
      }
    } catch (error) {
      console.error('Error updating consultant:', error);
      toast.error('Failed to update consultant');
    }
  };

  // Delete Consultant
  const handleDeleteConsultant = async (userId) => {
    if (!window.confirm(`Are you sure you want to delete consultant ${userId}? This action cannot be undone.`)) {
      return;
    }
    try {
      const response = await axios.delete(`${API}/admin/consultants/${userId}`);
      if (response.data.success) {
        toast.success('Consultant deleted successfully');
        fetchConsultants();
      }
    } catch (error) {
      console.error('Error deleting consultant:', error);
      toast.error('Failed to delete consultant');
    }
  };

  const fetchConsultantReports = async () => {
    try {
      const response = await axios.get(`${API}/admin/consultant-reports`);
      if (response.data.success) {
        setConsultantReports(response.data.reports);
        setReportsByConsultant(response.data.reports_by_consultant);
      }
    } catch (error) {
      console.error('Error fetching consultant reports:', error);
      toast.error('Failed to load consultant reports');
    }
  };

  const filterReports = () => {
    let filtered = [...consultantReports];

    // Filter by consultant
    if (selectedConsultant !== 'all') {
      filtered = filtered.filter(report => report.consultant_name === selectedConsultant);
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(report => {
        const reportDate = new Date(report.created_at);
        return reportDate.toDateString() === selectedDate.toDateString();
      });
    }

    // Search filter
    if (reportSearchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.student_name.toLowerCase().includes(reportSearchTerm.toLowerCase()) ||
          report.contact_number.includes(reportSearchTerm) ||
          report.institution_name.toLowerCase().includes(reportSearchTerm.toLowerCase()) ||
          report.consultant_name.toLowerCase().includes(reportSearchTerm.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminLoginTime');
    toast.success('Logged out successfully');
    navigate('/admin');
  };

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/queries`);
      if (response.data.success) {
        setQueries(response.data.queries);
      }
    } catch (error) {
      console.error('Error fetching queries:', error);
      toast.error('Failed to load queries');
    } finally {
      setLoading(false);
    }
  };

  const filterQueries = () => {
    let filtered = [...queries];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (query) =>
          query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          query.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          query.phone.includes(searchTerm) ||
          query.course.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((query) => query.status === filterStatus);
    }

    setFilteredQueries(filtered);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Name', 'Phone', 'Email', 'Institution', 'Course', 'Message', 'Status'];
    const csvData = filteredQueries.map((query) => [
      new Date(query.created_at).toLocaleDateString(),
      query.name,
      query.phone,
      query.email,
      query.current_institution || '',
      query.course,
      query.message.replace(/,/g, ';'),
      query.status,
    ]);

    const csv = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student-queries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Queries exported to CSV');
  };

  const exportConsultantReportsToCSV = () => {
    const headers = ['Date (IST)', 'Consultant', 'Student Name', 'Contact', 'Institution', 'Exam Preference', 'Career Interest', 'College Interest', 'Interest Scope', 'Remarks'];
    const csvData = filteredReports.map((report) => [
      formatDate(report.created_at),
      report.consultant_name,
      report.student_name,
      report.contact_number,
      report.institution_name,
      report.competitive_exam_preference,
      report.career_interest,
      report.college_interest || '',
      report.interest_scope,
      (report.other_remarks || '').replace(/,/g, ';'),
    ]);

    const csv = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultant-reports-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Consultant reports exported to CSV');
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-green-100 text-green-800',
    };
    return (
      <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Convert to IST (Indian Standard Time - UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istDate = new Date(date.getTime() + istOffset);
    
    return istDate.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
  };

  const isNewQuery = (dateString) => {
    const queryDate = new Date(dateString);
    const now = new Date();
    const hoursDiff = (now - queryDate) / (1000 * 60 * 60);
    return hoursDiff < 24; // Query is "new" if less than 24 hours old
  };

  const handleCloseQuery = async (queryId) => {
    try {
      const response = await axios.patch(`${API}/queries/${queryId}/status?status=closed`);
      if (response.data.success) {
        toast.success('Query Closed', {
          description: 'The query has been marked as closed.',
        });
        fetchQueries(); // Refresh the list
      }
    } catch (error) {
      console.error('Error closing query:', error);
      toast.error('Failed to close query', {
        description: 'Please try again.',
      });
    }
  };

  const handleMarkContacted = async (queryId) => {
    try {
      const response = await axios.patch(`${API}/queries/${queryId}/status?status=contacted`);
      if (response.data.success) {
        toast.success('Query Updated', {
          description: 'The query has been marked as contacted.',
        });
        fetchQueries(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating query:', error);
      toast.error('Failed to update query', {
        description: 'Please try again.',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading queries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-4 md:py-8 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-2 md:px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className={`text-xl md:text-4xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Admin Dashboard</h1>
              <p className={`text-xs md:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage student queries and consultant reports</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className={`border-2 ${isDark ? 'border-red-500 text-red-400 hover:bg-red-900/30' : 'border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400'}`}
              >
                <LogOut className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
          <Button
            onClick={() => setShowBulkDelete(true)}
            variant="outline"
            size="sm"
            className={`w-full md:w-auto border-2 ${isDark ? 'border-orange-500 text-orange-400 hover:bg-orange-900/30' : 'border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400'}`}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Bulk Delete
          </Button>
        </div>

        {/* Call Stats Overview Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <CardContent className="p-3 md:p-4 flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm opacity-80">Total Calls</p>
                <p className="text-lg md:text-2xl font-bold">{callStats.overall_stats?.total_calls || 0}</p>
              </div>
              <PhoneCall className="h-5 w-5 md:h-7 md:w-7 opacity-80" />
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-3 md:p-4 flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm opacity-80">Successful</p>
                <p className="text-lg md:text-2xl font-bold">{callStats.overall_stats?.successful_calls || 0}</p>
              </div>
              <CheckCircle className="h-5 w-5 md:h-7 md:w-7 opacity-80" />
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-3 md:p-4 flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm opacity-80">Failed</p>
                <p className="text-lg md:text-2xl font-bold">{callStats.overall_stats?.failed_calls || 0}</p>
              </div>
              <PhoneOff className="h-5 w-5 md:h-7 md:w-7 opacity-80" />
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-3 md:p-4 flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm opacity-80">Attempted</p>
                <p className="text-lg md:text-2xl font-bold">{callStats.overall_stats?.attempted_calls || 0}</p>
              </div>
              <PhoneMissed className="h-5 w-5 md:h-7 md:w-7 opacity-80" />
            </CardContent>
          </Card>
        </div>

        {/* Bulk Delete Modal */}
        {showBulkDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <CardHeader className="border-b bg-red-500 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    <CardTitle>Bulk Delete Data</CardTitle>
                  </div>
                  <button onClick={() => setShowBulkDelete(false)} className="text-white hover:text-gray-200">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    This action is irreversible! Data will be permanently deleted.
                  </p>
                </div>
                
                <div>
                  <Label>What to Delete *</Label>
                  <select
                    value={bulkDeleteType}
                    onChange={(e) => setBulkDeleteType(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="reports">Consultant Reports</option>
                    <option value="calls">Call Logs</option>
                    <option value="queries">Student Queries</option>
                    <option value="admissions">Admissions</option>
                    <option value="all">⚠️ ALL DATA</option>
                  </select>
                </div>

                <div>
                  <Label>Filter by Consultant (Optional)</Label>
                  <select
                    value={bulkDeleteConsultant}
                    onChange={(e) => setBulkDeleteConsultant(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Consultants</option>
                    {consultants.map((c) => (
                      <option key={c.user_id} value={c.user_id}>{c.name} ({c.user_id})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Start Date (Optional)</Label>
                    <Input
                      type="date"
                      value={bulkDeleteStartDate}
                      onChange={(e) => setBulkDeleteStartDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>End Date (Optional)</Label>
                    <Input
                      type="date"
                      value={bulkDeleteEndDate}
                      onChange={(e) => setBulkDeleteEndDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <Label className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-red-500" />
                    Admin Password (Required) *
                  </Label>
                  <Input
                    type="password"
                    value={bulkDeletePassword}
                    onChange={(e) => setBulkDeletePassword(e.target.value)}
                    placeholder="Enter admin password to confirm"
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleBulkDelete}
                    disabled={isDeleting}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Data
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setShowBulkDelete(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs for Queries, Consultant Reports, and Consultant Management */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          {/* Mobile Tab Navigation - Horizontal Scroll */}
          <div className="md:hidden mb-4 overflow-x-auto pb-2 -mx-2 px-2">
            <TabsList className="inline-flex w-max min-w-full bg-gray-100 dark:bg-gray-800 p-1 rounded-lg gap-1">
              <TabsTrigger
                value="queries"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white font-semibold text-xs px-3 py-2 whitespace-nowrap"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Queries
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white font-semibold text-xs px-3 py-2 whitespace-nowrap"
              >
                <FileText className="h-3 w-3 mr-1" />
                Reports
              </TabsTrigger>
              <TabsTrigger
                value="calls"
                className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white font-semibold text-xs px-3 py-2 whitespace-nowrap"
              >
                <PhoneCall className="h-3 w-3 mr-1" />
                Stats
              </TabsTrigger>
              <TabsTrigger
                value="admissions"
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white font-semibold text-xs px-3 py-2 whitespace-nowrap"
              >
                <GraduationCap className="h-3 w-3 mr-1" />
                Admissions
              </TabsTrigger>
              <TabsTrigger
                value="consultants"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white font-semibold text-xs px-3 py-2 whitespace-nowrap"
              >
                <Settings className="h-3 w-3 mr-1" />
                Consultants
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Desktop Tab Navigation */}
          <TabsList className="hidden md:grid w-full grid-cols-5 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg gap-1">
            <TabsTrigger
              value="queries"
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white font-semibold text-sm px-2 py-2"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Student Queries
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white font-semibold text-sm px-2 py-2"
            >
              <FileText className="h-4 w-4 mr-2" />
              Consultant Reports
            </TabsTrigger>
            <TabsTrigger
              value="calls"
              className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white font-semibold text-sm px-2 py-2"
            >
              <PhoneCall className="h-4 w-4 mr-2" />
              Call Stats
            </TabsTrigger>
            <TabsTrigger
              value="admissions"
              className="data-[state=active]:bg-purple-500 data-[state=active]:text-white font-semibold text-sm px-2 py-2"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Admissions
            </TabsTrigger>
            <TabsTrigger
              value="consultants"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white font-semibold text-sm px-2 py-2"
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Consultants
            </TabsTrigger>
          </TabsList>

          {/* Student Queries Tab */}
          <TabsContent value="queries">
            {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Total Queries</p>
                  <p className="text-xl md:text-3xl font-bold text-gray-900">{queries.length}</p>
                </div>
                <MessageSquare className="h-6 w-6 md:h-10 md:w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">New</p>
                  <p className="text-xl md:text-3xl font-bold text-blue-600">
                    {queries.filter((q) => q.status === 'new').length}
                  </p>
                </div>
                <MessageSquare className="h-6 w-6 md:h-10 md:w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Contacted</p>
                  <p className="text-xl md:text-3xl font-bold text-yellow-600">
                    {queries.filter((q) => q.status === 'contacted').length}
                  </p>
                </div>
                <Phone className="h-6 w-6 md:h-10 md:w-10 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Closed</p>
                  <p className="text-xl md:text-3xl font-bold text-green-600">
                    {queries.filter((q) => q.status === 'closed').length}
                  </p>
                </div>
                <BookOpen className="h-6 w-6 md:h-10 md:w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <CardContent className="p-4 md:p-6">
            <div className="space-y-3">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              
              {/* Filter and Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex-1 min-w-[120px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>

                <Button
                  onClick={exportToCSV}
                  size="sm"
                  className="bg-yellow-500 text-gray-900 hover:bg-yellow-600"
                >
                  <Download className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Export CSV</span>
                </Button>

                <Button
                  onClick={fetchQueries}
                  variant="outline"
                  size="sm"
                  className="border-gray-300"
                >
                  <RefreshCw className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Refresh</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Queries Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Queries ({filteredQueries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredQueries.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No queries found</p>
                <p className="text-gray-400 text-sm mt-2">
                  {searchTerm || filterStatus !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Student queries will appear here'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date (IST)</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Institution</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQueries.map((query) => {
                      const isNew = isNewQuery(query.created_at);
                      return (
                        <TableRow 
                          key={query.id} 
                          className={`hover:bg-gray-50 ${isNew ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                        >
                          <TableCell className="text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              {formatDate(query.created_at)}
                              {isNew && (
                                <Badge className="bg-blue-500 text-white text-xs">NEW</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{query.name}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <a href={`tel:${query.phone}`} className="text-blue-600 hover:underline">
                                  {query.phone}
                                </a>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <a href={`mailto:${query.email}`} className="text-blue-600 hover:underline">
                                  {query.email}
                                </a>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-700 font-medium">{query.current_institution || 'Not provided'}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-yellow-50">
                              {query.course}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-sm text-gray-600 truncate">
                              {query.message || 'No message'}
                            </p>
                          </TableCell>
                          <TableCell>{getStatusBadge(query.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedQuery(query)}
                                className="text-xs"
                              >
                                View
                              </Button>
                              {query.status !== 'closed' && (
                                <>
                                  {query.status === 'new' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleMarkContacted(query.id)}
                                      className="text-xs bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                                    >
                                      Mark Contacted
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCloseQuery(query.id)}
                                    className="text-xs bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                                  >
                                    Close
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteQuery(query.id)}
                                className="text-xs bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Query Detail Modal */}
        {selectedQuery && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>Query Details</CardTitle>
                  <button
                    onClick={() => setSelectedQuery(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Name</label>
                    <p className="text-gray-900 mt-1">{selectedQuery.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedQuery.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Phone</label>
                    <p className="text-gray-900 mt-1">
                      <a href={`tel:${selectedQuery.phone}`} className="text-blue-600 hover:underline">
                        {selectedQuery.phone}
                      </a>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Email</label>
                    <p className="text-gray-900 mt-1">
                      <a href={`mailto:${selectedQuery.email}`} className="text-blue-600 hover:underline">
                        {selectedQuery.email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Current Institution</label>
                    <p className="text-gray-900 mt-1">{selectedQuery.current_institution || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Course Interest</label>
                    <p className="text-gray-900 mt-1">{selectedQuery.course}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Submitted On</label>
                    <p className="text-gray-900 mt-1">{formatDate(selectedQuery.created_at)}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Message</label>
                  <p className="text-gray-900 mt-2 bg-gray-50 p-4 rounded-lg">
                    {selectedQuery.message || 'No message provided'}
                  </p>
                </div>
                <div className="flex gap-3 pt-4 border-t">
                  {selectedQuery.status !== 'closed' && (
                    <>
                      {selectedQuery.status === 'new' && (
                        <Button
                          onClick={() => {
                            handleMarkContacted(selectedQuery.id);
                            setSelectedQuery(null);
                          }}
                          className="bg-yellow-500 text-gray-900 hover:bg-yellow-600"
                        >
                          Mark as Contacted
                        </Button>
                      )}
                      <Button
                        onClick={() => {
                          handleCloseQuery(selectedQuery.id);
                          setSelectedQuery(null);
                        }}
                        className="bg-green-500 text-white hover:bg-green-600"
                      >
                        Close Query
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={() => setSelectedQuery(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
          </TabsContent>

          {/* Consultant Reports Tab */}
          <TabsContent value="reports">
            {/* Stats Cards for Reports */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Reports</p>
                      <p className="text-3xl font-bold text-gray-900">{consultantReports.length}</p>
                    </div>
                    <FileText className="h-10 w-10 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Consultants</p>
                      <p className="text-3xl font-bold text-green-600">
                        {Object.keys(reportsByConsultant).length}
                      </p>
                    </div>
                    <Users className="h-10 w-10 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">This Month</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {consultantReports.filter(report => {
                          const reportDate = new Date(report.created_at);
                          const now = new Date();
                          return reportDate.getMonth() === now.getMonth() && 
                                 reportDate.getFullYear() === now.getFullYear();
                        }).length}
                      </p>
                    </div>
                    <CalendarIcon className="h-10 w-10 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Today</p>
                      <p className="text-3xl font-bold text-yellow-600">
                        {consultantReports.filter(report => {
                          const reportDate = new Date(report.created_at);
                          const now = new Date();
                          return reportDate.toDateString() === now.toDateString();
                        }).length}
                      </p>
                    </div>
                    <BookOpen className="h-10 w-10 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Actions for Reports */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex-1 w-full md:w-auto">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search by student name, contact, institution, or consultant..."
                          value={reportSearchTerm}
                          onChange={(e) => setReportSearchTerm(e.target.value)}
                          className="pl-10 w-full"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                      {/* Date Filter */}
                      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`min-w-[180px] justify-start text-left font-normal ${!selectedDate && 'text-muted-foreground'}`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, 'dd MMM yyyy') : 'Select Date'}
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
                          size="icon"
                          onClick={() => setSelectedDate(null)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Clear date filter"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}

                      <select
                        value={selectedConsultant}
                        onChange={(e) => setSelectedConsultant(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="all">All Consultants</option>
                        {Object.keys(reportsByConsultant).map((consultant) => (
                          <option key={consultant} value={consultant}>
                            {consultant} ({reportsByConsultant[consultant].length})
                          </option>
                        ))}
                      </select>

                      <Button
                        onClick={exportConsultantReportsToCSV}
                        className="bg-green-500 text-white hover:bg-green-600"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>

                      <Button
                        onClick={fetchConsultantReports}
                        variant="outline"
                        className="border-gray-300"
                      >
                        Refresh
                      </Button>
                    </div>
                  </div>

                  {/* Active Filters Display */}
                  {(selectedDate || selectedConsultant !== 'all') && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-500">Active filters:</span>
                      {selectedDate && (
                        <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {format(selectedDate, 'dd MMM yyyy')}
                          <button onClick={() => setSelectedDate(null)} className="ml-1 hover:text-blue-900">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {selectedConsultant !== 'all' && (
                        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {selectedConsultant}
                          <button onClick={() => setSelectedConsultant('all')} className="ml-1 hover:text-green-900">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDate(null);
                          setSelectedConsultant('all');
                          setReportSearchTerm('');
                        }}
                        className="text-gray-500 hover:text-gray-700 text-xs"
                      >
                        Clear all
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Consultant Reports Table */}
            <Card>
              <CardHeader>
                <CardTitle>Consultant Reports ({filteredReports.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredReports.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No reports found</p>
                    <p className="text-gray-400 text-sm mt-2">
                      {reportSearchTerm || selectedConsultant !== 'all'
                        ? 'Try adjusting your filters'
                        : 'Consultant reports will appear here'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date (IST)</TableHead>
                          <TableHead>Consultant</TableHead>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Institution</TableHead>
                          <TableHead>Exam Preference</TableHead>
                          <TableHead>Career Interest</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReports.map((report) => (
                          <TableRow key={report.id} className="hover:bg-gray-50">
                            <TableCell className="text-sm text-gray-600">
                              {formatDate(report.created_at)}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800">
                                {report.consultant_name}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{report.student_name}</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-3 w-3 text-gray-400" />
                                  <a href={`tel:${report.contact_number}`} className="text-blue-600 hover:underline">
                                    {report.contact_number}
                                  </a>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm text-gray-700 font-medium">{report.institution_name}</p>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-blue-50">
                                {report.competitive_exam_preference}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm text-gray-600 max-w-xs truncate">
                                {report.career_interest}
                              </p>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedReport(report)}
                                  className="text-xs"
                                >
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteReport(report.id)}
                                  className="text-xs bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Report Detail Modal */}
            {selectedReport && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle>Consultant Report Details</CardTitle>
                      <button
                        onClick={() => setSelectedReport(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Consultant</label>
                        <p className="text-gray-900 mt-1 font-medium">{selectedReport.consultant_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Report Date</label>
                        <p className="text-gray-900 mt-1">{formatDate(selectedReport.created_at)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Student Name</label>
                        <p className="text-gray-900 mt-1 font-medium">{selectedReport.student_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Contact Number</label>
                        <p className="text-gray-900 mt-1">
                          <a href={`tel:${selectedReport.contact_number}`} className="text-blue-600 hover:underline">
                            {selectedReport.contact_number}
                          </a>
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Institution</label>
                        <p className="text-gray-900 mt-1">{selectedReport.institution_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Competitive Exam Preference</label>
                        <p className="text-gray-900 mt-1">{selectedReport.competitive_exam_preference}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Career Interest</label>
                        <p className="text-gray-900 mt-1">{selectedReport.career_interest}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Interest Scope</label>
                        <p className="text-gray-900 mt-1">{selectedReport.interest_scope}</p>
                      </div>
                    </div>
                    
                    {selectedReport.college_interest && (
                      <div>
                        <label className="text-sm font-semibold text-gray-700">College Interest</label>
                        <p className="text-gray-900 mt-2 bg-gray-50 p-4 rounded-lg">
                          {selectedReport.college_interest}
                        </p>
                      </div>
                    )}
                    
                    {selectedReport.other_remarks && (
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Other Remarks</label>
                        <p className="text-gray-900 mt-2 bg-gray-50 p-4 rounded-lg">
                          {selectedReport.other_remarks}
                        </p>
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
          </TabsContent>

          {/* Call Stats Tab */}
          <TabsContent value="calls">
            <Card className="mb-6">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">Call Statistics by Consultant</CardTitle>
                <p className="text-indigo-100 text-xs md:text-sm">Overview of all consultant calling activities</p>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                {Object.keys(callStats.consultant_stats || {}).length === 0 ? (
                  <div className="text-center py-8">
                    <PhoneCall className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No call data recorded yet</p>
                    <p className="text-gray-400 text-sm mt-2">Call logs will appear here when consultants log their calls</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">Consultant</TableHead>
                          <TableHead className="font-semibold text-center">Total Calls</TableHead>
                          <TableHead className="font-semibold text-center">Successful</TableHead>
                          <TableHead className="font-semibold text-center">Failed</TableHead>
                          <TableHead className="font-semibold text-center">Attempted</TableHead>
                          <TableHead className="font-semibold text-center">Success Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(callStats.consultant_stats || {}).map(([consultantId, stats]) => (
                          <TableRow key={consultantId} className="hover:bg-gray-50">
                            <TableCell>
                              <div>
                                <p className="font-medium">{stats.consultant_name}</p>
                                <p className="text-xs text-gray-500">{consultantId}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className="bg-indigo-100 text-indigo-800">{stats.total_calls}</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className="bg-green-100 text-green-800">{stats.successful_calls}</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className="bg-red-100 text-red-800">{stats.failed_calls}</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className="bg-yellow-100 text-yellow-800">{stats.attempted_calls}</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className={`font-semibold ${
                                stats.total_calls > 0 && (stats.successful_calls / stats.total_calls) >= 0.5 
                                  ? 'text-green-600' 
                                  : 'text-orange-600'
                              }`}>
                                {stats.total_calls > 0 
                                  ? `${Math.round((stats.successful_calls / stats.total_calls) * 100)}%` 
                                  : '0%'}
                              </span>
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

          {/* Admissions Tab */}
          <TabsContent value="admissions">
            {/* Stats Cards for Admissions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
              <Card>
                <CardContent className="p-3 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">Total Admissions</p>
                      <p className="text-xl md:text-3xl font-bold text-gray-900">{admissions.length}</p>
                    </div>
                    <GraduationCap className="h-6 w-6 md:h-10 md:w-10 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">Payout Pending</p>
                      <p className="text-xl md:text-3xl font-bold text-yellow-600">
                        {admissions.filter(a => a.payout_status === 'PAYOUT NOT CREDITED YET').length}
                      </p>
                    </div>
                    <DollarSign className="h-6 w-6 md:h-10 md:w-10 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Payout Reflected</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {admissions.filter(a => a.payout_status === 'PAYOUT REFLECTED').length}
                      </p>
                    </div>
                    <CheckCircle className="h-10 w-10 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Commission Given</p>
                      <p className="text-3xl font-bold text-green-600">
                        {admissions.filter(a => a.payout_status === "CONSULTANT'S COMMISION GIVEN").length}
                      </p>
                    </div>
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Admission Records</h3>
                    <p className="text-sm text-gray-500">Track student admissions and consultant payouts</p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowAddAdmission(true)}
                      className="bg-purple-500 text-white hover:bg-purple-600"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Admission
                    </Button>
                    <Button
                      onClick={fetchAdmissions}
                      variant="outline"
                      className="border-gray-300"
                    >
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admissions Table */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <CardTitle className="text-xl">Student Admissions ({admissions.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {admissions.length === 0 ? (
                  <div className="text-center py-12">
                    <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No admission records yet</p>
                    <p className="text-gray-400 text-sm mt-2">Add your first admission record to get started</p>
                    <Button
                      onClick={() => setShowAddAdmission(true)}
                      className="mt-4 bg-purple-500 hover:bg-purple-600"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Admission
                    </Button>
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
                          <TableHead className="font-semibold">Consultant</TableHead>
                          <TableHead className="font-semibold">Payout Amount</TableHead>
                          <TableHead className="font-semibold">Payout Status</TableHead>
                          <TableHead className="font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {admissions.map((admission) => (
                          <TableRow key={admission.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{admission.student_name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-blue-50">
                                {admission.course}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">{admission.college}</TableCell>
                            <TableCell className="text-sm">{admission.admission_date}</TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800">
                                {admission.consultant_name}
                              </Badge>
                            </TableCell>
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
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingAdmission(admission)}
                                  className="text-xs bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteAdmission(admission.id)}
                                  className="text-xs bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add Admission Modal */}
            {showAddAdmission && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <Card className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
                  <CardHeader className="border-b bg-purple-500 text-white">
                    <div className="flex items-center justify-between">
                      <CardTitle>Add New Admission</CardTitle>
                      <button
                        onClick={() => {
                          setShowAddAdmission(false);
                          setNewAdmission({
                            student_name: '',
                            course: '',
                            college: '',
                            admission_date: '',
                            consultant_id: '',
                            consultant_name: '',
                            payout_amount: '',
                            payout_status: 'PAYOUT NOT CREDITED YET'
                          });
                        }}
                        className="text-white hover:text-gray-200"
                      >
                        ✕
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <Label htmlFor="admission_student_name">Student Name *</Label>
                      <Input
                        id="admission_student_name"
                        value={newAdmission.student_name}
                        onChange={(e) => setNewAdmission({ ...newAdmission, student_name: e.target.value })}
                        placeholder="Enter student name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="admission_course">Course *</Label>
                      <Input
                        id="admission_course"
                        value={newAdmission.course}
                        onChange={(e) => setNewAdmission({ ...newAdmission, course: e.target.value })}
                        placeholder="e.g., B.Tech, MBBS, MBA"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="admission_college">College *</Label>
                      <Input
                        id="admission_college"
                        value={newAdmission.college}
                        onChange={(e) => setNewAdmission({ ...newAdmission, college: e.target.value })}
                        placeholder="Enter college name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="admission_date">Admission Date *</Label>
                      <Input
                        id="admission_date"
                        type="date"
                        value={newAdmission.admission_date}
                        onChange={(e) => setNewAdmission({ ...newAdmission, admission_date: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="admission_consultant">Consultant *</Label>
                      <select
                        id="admission_consultant"
                        value={newAdmission.consultant_id}
                        onChange={(e) => {
                          const selectedConsultant = consultants.find(c => c.user_id === e.target.value);
                          setNewAdmission({ 
                            ...newAdmission, 
                            consultant_id: e.target.value,
                            consultant_name: selectedConsultant?.name || ''
                          });
                        }}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select Consultant</option>
                        {consultants.map((consultant) => (
                          <option key={consultant.user_id} value={consultant.user_id}>
                            {consultant.name} ({consultant.user_id})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="admission_payout">Payout Amount (₹) *</Label>
                      <Input
                        id="admission_payout"
                        type="number"
                        value={newAdmission.payout_amount}
                        onChange={(e) => setNewAdmission({ ...newAdmission, payout_amount: e.target.value })}
                        placeholder="Enter payout amount"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="admission_status">Payout Status *</Label>
                      <select
                        id="admission_status"
                        value={newAdmission.payout_status}
                        onChange={(e) => setNewAdmission({ ...newAdmission, payout_status: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {PAYOUT_STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleAddAdmission}
                        className="flex-1 bg-purple-500 hover:bg-purple-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Admission
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowAddAdmission(false);
                          setNewAdmission({
                            student_name: '',
                            course: '',
                            college: '',
                            admission_date: '',
                            consultant_id: '',
                            consultant_name: '',
                            payout_amount: '',
                            payout_status: 'PAYOUT NOT CREDITED YET'
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Edit Admission Modal */}
            {editingAdmission && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <Card className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
                  <CardHeader className="border-b bg-yellow-500 text-white">
                    <div className="flex items-center justify-between">
                      <CardTitle>Edit Admission</CardTitle>
                      <button
                        onClick={() => setEditingAdmission(null)}
                        className="text-white hover:text-gray-200"
                      >
                        ✕
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <Label htmlFor="edit_admission_student_name">Student Name *</Label>
                      <Input
                        id="edit_admission_student_name"
                        value={editingAdmission.student_name}
                        onChange={(e) => setEditingAdmission({ ...editingAdmission, student_name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_admission_course">Course *</Label>
                      <Input
                        id="edit_admission_course"
                        value={editingAdmission.course}
                        onChange={(e) => setEditingAdmission({ ...editingAdmission, course: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_admission_college">College *</Label>
                      <Input
                        id="edit_admission_college"
                        value={editingAdmission.college}
                        onChange={(e) => setEditingAdmission({ ...editingAdmission, college: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_admission_date">Admission Date *</Label>
                      <Input
                        id="edit_admission_date"
                        type="date"
                        value={editingAdmission.admission_date}
                        onChange={(e) => setEditingAdmission({ ...editingAdmission, admission_date: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_admission_consultant">Consultant *</Label>
                      <select
                        id="edit_admission_consultant"
                        value={editingAdmission.consultant_id}
                        onChange={(e) => {
                          const selectedConsultant = consultants.find(c => c.user_id === e.target.value);
                          setEditingAdmission({ 
                            ...editingAdmission, 
                            consultant_id: e.target.value,
                            consultant_name: selectedConsultant?.name || ''
                          });
                        }}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        <option value="">Select Consultant</option>
                        {consultants.map((consultant) => (
                          <option key={consultant.user_id} value={consultant.user_id}>
                            {consultant.name} ({consultant.user_id})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="edit_admission_payout">Payout Amount (₹) *</Label>
                      <Input
                        id="edit_admission_payout"
                        type="number"
                        value={editingAdmission.payout_amount}
                        onChange={(e) => setEditingAdmission({ ...editingAdmission, payout_amount: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_admission_status">Payout Status *</Label>
                      <select
                        id="edit_admission_status"
                        value={editingAdmission.payout_status}
                        onChange={(e) => setEditingAdmission({ ...editingAdmission, payout_status: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        {PAYOUT_STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleUpdateAdmission}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Update Admission
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingAdmission(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Consultant Management Tab */}
          <TabsContent value="consultants">
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Consultant Management</CardTitle>
                    <p className="text-blue-100 text-sm mt-1">Add, edit, or remove consultant accounts</p>
                  </div>
                  <Button
                    onClick={() => setShowAddConsultant(true)}
                    className="bg-white text-blue-600 hover:bg-blue-50"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Consultant
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Stats */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-lg">
                    <span className="font-bold text-blue-600">{consultants.length}</span> Active Consultants
                  </p>
                </div>

                {/* Consultants Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">User ID</TableHead>
                        <TableHead className="font-semibold">Name</TableHead>
                        <TableHead className="font-semibold">Password</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {consultants.map((consultant, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                          <TableCell className="font-mono text-sm">{consultant.user_id}</TableCell>
                          <TableCell className="font-medium">{consultant.name}</TableCell>
                          <TableCell className="font-mono text-sm text-gray-500">
                            {consultant.password.substring(0, 3)}***
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingConsultant({
                                  ...consultant,
                                  original_user_id: consultant.user_id,
                                  new_user_id: consultant.user_id,
                                  password: ''
                                })}
                                className="text-xs bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteConsultant(consultant.user_id)}
                                className="text-xs bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Add Consultant Modal */}
            {showAddConsultant && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <Card className="max-w-md w-full">
                  <CardHeader className="border-b bg-blue-500 text-white">
                    <div className="flex items-center justify-between">
                      <CardTitle>Add New Consultant</CardTitle>
                      <button
                        onClick={() => {
                          setShowAddConsultant(false);
                          setNewConsultant({ user_id: '', name: '', password: '' });
                        }}
                        className="text-white hover:text-gray-200"
                      >
                        ✕
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <Label htmlFor="new_user_id">User ID *</Label>
                      <Input
                        id="new_user_id"
                        value={newConsultant.user_id}
                        onChange={(e) => setNewConsultant({ ...newConsultant, user_id: e.target.value.toUpperCase() })}
                        placeholder="e.g., JOHN_EDU"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new_name">Full Name *</Label>
                      <Input
                        id="new_name"
                        value={newConsultant.name}
                        onChange={(e) => setNewConsultant({ ...newConsultant, name: e.target.value })}
                        placeholder="e.g., John Doe"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new_password">Password *</Label>
                      <Input
                        id="new_password"
                        value={newConsultant.password}
                        onChange={(e) => setNewConsultant({ ...newConsultant, password: e.target.value })}
                        placeholder="Enter password"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleAddConsultant}
                        className="flex-1 bg-blue-500 hover:bg-blue-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Consultant
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowAddConsultant(false);
                          setNewConsultant({ user_id: '', name: '', password: '' });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Edit Consultant Modal */}
            {editingConsultant && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <Card className="max-w-md w-full">
                  <CardHeader className="border-b bg-yellow-500 text-white">
                    <div className="flex items-center justify-between">
                      <CardTitle>Edit Consultant</CardTitle>
                      <button
                        onClick={() => setEditingConsultant(null)}
                        className="text-white hover:text-gray-200"
                      >
                        ✕
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <Label htmlFor="edit_user_id">User ID (Editable)</Label>
                      <Input
                        id="edit_user_id"
                        value={editingConsultant.new_user_id || editingConsultant.user_id}
                        onChange={(e) => setEditingConsultant({ ...editingConsultant, new_user_id: e.target.value.toUpperCase() })}
                        className="mt-1"
                        placeholder="Enter new User ID"
                      />
                      <p className="text-xs text-gray-500 mt-1">Original: {editingConsultant.original_user_id}</p>
                    </div>
                    <div>
                      <Label>Full Name (Cannot be changed)</Label>
                      <Input
                        value={editingConsultant.name}
                        disabled
                        className="mt-1 bg-gray-100 cursor-not-allowed"
                      />
                      <p className="text-xs text-amber-600 mt-1">Name cannot be modified after creation</p>
                    </div>
                    <div>
                      <Label htmlFor="edit_password">New Password (leave blank to keep current)</Label>
                      <Input
                        id="edit_password"
                        value={editingConsultant.password || ''}
                        onChange={(e) => setEditingConsultant({ ...editingConsultant, password: e.target.value })}
                        placeholder="Enter new password"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleUpdateConsultant}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Update Consultant
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingConsultant(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
