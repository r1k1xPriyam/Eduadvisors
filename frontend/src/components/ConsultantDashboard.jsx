import React, { useState, useEffect, useRef } from 'react';
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
  PhoneMissed,
  Bell,
  BellRing,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle2
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
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { BarChart3, TrendingUp, PieChart, Plus, Trash2, TableIcon } from 'lucide-react';
import Papa from 'papaparse';

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
  const { isDark } = useTheme();
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
  
  // Duplicate Report State
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateInfo, setDuplicateInfo] = useState(null);
  const [pendingFormData, setPendingFormData] = useState(null);
  
  // Validation Errors State
  const [validationErrors, setValidationErrors] = useState({});
  
  // Reminders State
  const [reminders, setReminders] = useState({ today_reminders: [], upcoming_reminders: [], overdue_reminders: [] });
  const [loadingReminders, setLoadingReminders] = useState(false);
  const [isFollowupCalendarOpen, setIsFollowupCalendarOpen] = useState(false);
  
  // Detailed Call Stats Modal
  const [showCallDetails, setShowCallDetails] = useState(false);
  const [callDetailsType, setCallDetailsType] = useState('');
  const [callDetailsList, setCallDetailsList] = useState([]);
  const [loadingCallDetails, setLoadingCallDetails] = useState(false);
  
  // CSV Upload State
  const [showCsvUpload, setShowCsvUpload] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [csvErrors, setCsvErrors] = useState([]);
  const [isUploadingCsv, setIsUploadingCsv] = useState(false);
  const fileInputRef = useRef(null);
  
  // Spreadsheet State
  const [showSpreadsheet, setShowSpreadsheet] = useState(false);
  const [spreadsheetRows, setSpreadsheetRows] = useState([]);
  const [spreadsheetErrors, setSpreadsheetErrors] = useState({});
  const [isUploadingSpreadsheet, setIsUploadingSpreadsheet] = useState(false);
  const [bulkMode, setBulkMode] = useState(null); // 'csv' | 'spreadsheet' | null
  
  // Notification Popup State (shows on login)
  const [showReminderNotification, setShowReminderNotification] = useState(false);
  const [notificationReminders, setNotificationReminders] = useState([]);
  
  // Analytics State
  const [analyticsOverview, setAnalyticsOverview] = useState(null);
  const [callDistribution, setCallDistribution] = useState([]);
  const [interestDistribution, setInterestDistribution] = useState([]);
  const [reportsTrend, setReportsTrend] = useState([]);
  const [dailyCalls, setDailyCalls] = useState([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  
  const [formData, setFormData] = useState({
    student_name: '',
    contact_number: '',
    institution_name: '',
    competitive_exam_preference: '',
    career_interest: '',
    college_interest: '',
    interest_scope: '',
    next_followup_date: '',
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
    if (consultantId && activeTab === 'reminders') {
      fetchReminders();
    }
    if (consultantId && activeTab === 'analytics') {
      fetchConsultantAnalytics();
    }
  }, [consultantId, activeTab]);

  // Fetch call stats and reminders on load (with notification on initial load)
  useEffect(() => {
    if (consultantId) {
      fetchCallStats();
      fetchReminders(true); // true = show notification popup
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

  // Fetch Consultant Analytics
  const fetchConsultantAnalytics = async () => {
    if (!consultantId) return;
    setLoadingAnalytics(true);
    try {
      const [overview, calls, interest, trend, daily] = await Promise.all([
        axios.get(`${API}/consultant/analytics/overview/${consultantId}`),
        axios.get(`${API}/consultant/analytics/call-distribution/${consultantId}`),
        axios.get(`${API}/consultant/analytics/interest-scope/${consultantId}`),
        axios.get(`${API}/consultant/analytics/reports-trend/${consultantId}`),
        axios.get(`${API}/consultant/analytics/daily-calls/${consultantId}`)
      ]);
      if (overview.data.success) setAnalyticsOverview(overview.data.overview);
      if (calls.data.success) setCallDistribution(calls.data.distribution);
      if (interest.data.success) setInterestDistribution(interest.data.distribution);
      if (trend.data.success) setReportsTrend(trend.data.trend);
      if (daily.data.success) setDailyCalls(daily.data.trend);
    } catch (error) {
      console.error('Error fetching consultant analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Fetch Reminders
  const fetchReminders = async (showNotification = false) => {
    if (!consultantId) return;
    setLoadingReminders(true);
    try {
      const response = await axios.get(`${API}/consultant/reminders/${consultantId}`);
      if (response.data.success) {
        const todayReminders = response.data.today_reminders || [];
        const overdueReminders = response.data.overdue_reminders || [];
        
        setReminders({
          today_reminders: todayReminders,
          upcoming_reminders: response.data.upcoming_reminders || [],
          overdue_reminders: overdueReminders
        });
        
        // Show notification popup on login if there are reminders
        if (showNotification && (todayReminders.length > 0 || overdueReminders.length > 0)) {
          setNotificationReminders([...overdueReminders, ...todayReminders]);
          setShowReminderNotification(true);
        }
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoadingReminders(false);
    }
  };

  // Fetch Call Details
  const fetchCallDetails = async (callType) => {
    if (!consultantId) return;
    setLoadingCallDetails(true);
    setCallDetailsType(callType);
    setShowCallDetails(true);
    try {
      const url = callType === 'all' 
        ? `${API}/consultant/calls/details/${consultantId}`
        : `${API}/consultant/calls/details/${consultantId}?call_type=${callType}`;
      const response = await axios.get(url);
      if (response.data.success) {
        setCallDetailsList(response.data.calls || []);
      }
    } catch (error) {
      console.error('Error fetching call details:', error);
      toast.error('Failed to fetch call details');
    } finally {
      setLoadingCallDetails(false);
    }
  };

  // Mark reminder as complete
  const markReminderComplete = async (reportId) => {
    try {
      const response = await axios.put(`${API}/consultant/reminders/${reportId}/complete?consultant_id=${consultantId}`);
      if (response.data.success) {
        toast.success('Follow-up marked as complete!');
        fetchReminders();
        // Remove from notification list if open
        setNotificationReminders(prev => prev.filter(r => r.id !== reportId));
        if (notificationReminders.length <= 1) {
          setShowReminderNotification(false);
        }
        // Prompt to submit new report
        toast.info('Please submit an updated report for this student', { duration: 5000 });
      }
    } catch (error) {
      console.error('Error marking reminder complete:', error);
      toast.error('Failed to update reminder');
    }
  };

  // Ignore reminder
  const ignoreReminder = async (reportId) => {
    try {
      const response = await axios.put(`${API}/consultant/reminders/${reportId}/ignore?consultant_id=${consultantId}`);
      if (response.data.success) {
        toast.success('Reminder ignored');
        fetchReminders();
        // Remove from notification list if open
        setNotificationReminders(prev => prev.filter(r => r.id !== reportId));
        if (notificationReminders.length <= 1) {
          setShowReminderNotification(false);
        }
      }
    } catch (error) {
      console.error('Error ignoring reminder:', error);
      toast.error('Failed to ignore reminder');
    }
  };

  const handleQuickCall = async (callType) => {
    // Validate contact number is mandatory
    if (!quickCallData.contact_number || quickCallData.contact_number.trim() === '') {
      toast.error('Contact Number Required', {
        description: 'Please enter a contact number before logging the call',
      });
      return;
    }
    
    try {
      const params = new URLSearchParams({
        consultant_id: consultantId,
        call_type: callType,
        student_name: quickCallData.student_name || '',
        contact_number: quickCallData.contact_number.trim(),
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
      const errorMsg = error.response?.data?.detail || 'Failed to log call';
      toast.error(errorMsg);
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
      next_followup_date: '',
      other_remarks: ''
    });
    setValidationErrors({});
  };

  // Validate mandatory fields
  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      { key: 'student_name', label: 'Student Name' },
      { key: 'contact_number', label: 'Contact Number' },
      { key: 'institution_name', label: 'Institution Name' },
      { key: 'competitive_exam_preference', label: 'Competitive Exam Preference' },
      { key: 'career_interest', label: 'Career Interest' },
      { key: 'interest_scope', label: 'Interest Scope' }
    ];

    requiredFields.forEach(field => {
      if (!formData[field.key] || formData[field.key].trim() === '') {
        errors[field.key] = `${field.label} is required`;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // CSV Functions
  const downloadSampleCsv = async () => {
    try {
      const response = await axios.get(`${API}/consultant/sample-csv`);
      if (response.data.success) {
        const headers = response.data.headers;
        const sampleData = response.data.sample_data;
        
        let csvContent = headers.join(',') + '\n';
        sampleData.forEach(row => {
          csvContent += headers.map(h => `"${row[h] || ''}"`).join(',') + '\n';
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'sample_bulk_report.csv';
        link.click();
        toast.success('Sample CSV downloaded!');
      }
    } catch (error) {
      console.error('Error downloading sample CSV:', error);
      toast.error('Failed to download sample CSV');
    }
  };

  const handleCsvFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      parseCsvData(text);
    };
    reader.readAsText(file);
  };

  const parseCsvData = (text) => {
    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
    });

    if (result.data.length === 0) {
      toast.error('CSV file is empty or has no data rows');
      return;
    }

    const expectedHeaders = [
      'student_name', 'contact_number', 'institution_name',
      'competitive_exam_preference', 'career_interest', 'college_interest',
      'interest_scope', 'next_followup_date', 'other_remarks'
    ];

    const fileHeaders = result.meta.fields || [];
    const missingHeaders = expectedHeaders.filter(h => !fileHeaders.includes(h));
    if (missingHeaders.length > 0) {
      toast.error(`Missing headers: ${missingHeaders.join(', ')}`);
      return;
    }

    const data = [];
    const errors = [];

    result.data.forEach((row, i) => {
      const clean = {};
      expectedHeaders.forEach(h => { clean[h] = (row[h] || '').trim(); });

      if (!clean.student_name || !clean.contact_number || !clean.institution_name ||
          !clean.competitive_exam_preference || !clean.career_interest || !clean.interest_scope) {
        errors.push(`Row ${i + 1}: Missing required fields (student_name, contact_number, institution_name, competitive_exam_preference, career_interest, interest_scope)`);
      } else {
        data.push(clean);
      }
    });

    if (result.errors.length > 0) {
      result.errors.forEach(e => errors.push(`Parse error at row ${e.row + 1}: ${e.message}`));
    }

    setCsvData(data);
    setCsvErrors(errors);
    setShowCsvUpload(true);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadCsvReports = async () => {
    if (csvData.length === 0) {
      toast.error('No valid data to upload');
      return;
    }

    setIsUploadingCsv(true);
    try {
      const response = await axios.post(
        `${API}/consultant/bulk-reports?consultant_id=${consultantId}`,
        csvData
      );
      
      if (response.data.success) {
        toast.success(`Successfully uploaded ${response.data.success_count} reports!`);
        if (response.data.errors && response.data.errors.length > 0) {
          response.data.errors.forEach(err => toast.warning(err));
        }
        setShowCsvUpload(false);
        setCsvData([]);
        setCsvErrors([]);
        setBulkMode(null);
        fetchCallStats();
        fetchMyReports();
      }
    } catch (error) {
      console.error('Error uploading CSV:', error);
      toast.error(error.response?.data?.detail || 'Failed to upload reports');
    } finally {
      setIsUploadingCsv(false);
    }
  };

  // ============ SPREADSHEET FUNCTIONS ============
  const emptyRow = () => ({
    student_name: '', contact_number: '', institution_name: '',
    competitive_exam_preference: '', career_interest: '', college_interest: '',
    interest_scope: '', next_followup_date: '', other_remarks: ''
  });

  const addSpreadsheetRow = () => {
    setSpreadsheetRows(prev => [...prev, emptyRow()]);
  };

  const removeSpreadsheetRow = (index) => {
    setSpreadsheetRows(prev => prev.filter((_, i) => i !== index));
    setSpreadsheetErrors(prev => {
      const next = {};
      Object.keys(prev).forEach(k => { if (parseInt(k) !== index) next[parseInt(k) > index ? parseInt(k) - 1 : k] = prev[k]; });
      return next;
    });
  };

  const updateSpreadsheetRow = (index, field, value) => {
    setSpreadsheetRows(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    // Clear error for this field
    if (spreadsheetErrors[index]?.[field]) {
      setSpreadsheetErrors(prev => {
        const next = { ...prev };
        if (next[index]) {
          delete next[index][field];
          if (Object.keys(next[index]).length === 0) delete next[index];
        }
        return next;
      });
    }
  };

  const validateSpreadsheet = () => {
    const errors = {};
    const requiredFields = ['student_name', 'contact_number', 'institution_name', 'competitive_exam_preference', 'career_interest', 'interest_scope'];
    
    spreadsheetRows.forEach((row, i) => {
      requiredFields.forEach(field => {
        if (!row[field]?.trim()) {
          if (!errors[i]) errors[i] = {};
          errors[i][field] = true;
        }
      });
    });
    
    setSpreadsheetErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openSpreadsheet = () => {
    setSpreadsheetRows([emptyRow(), emptyRow(), emptyRow()]);
    setSpreadsheetErrors({});
    setShowSpreadsheet(true);
    setBulkMode('spreadsheet');
  };

  const uploadSpreadsheetReports = async () => {
    if (spreadsheetRows.length === 0) {
      toast.error('Add at least one row');
      return;
    }
    if (!validateSpreadsheet()) {
      toast.error('Please fix highlighted errors before submitting');
      return;
    }

    setIsUploadingSpreadsheet(true);
    try {
      const response = await axios.post(
        `${API}/consultant/bulk-reports?consultant_id=${consultantId}`,
        spreadsheetRows
      );
      if (response.data.success) {
        toast.success(`Successfully uploaded ${response.data.success_count} reports!`);
        if (response.data.errors?.length > 0) {
          response.data.errors.forEach(err => toast.warning(err));
        }
        setShowSpreadsheet(false);
        setSpreadsheetRows([]);
        setSpreadsheetErrors({});
        setBulkMode(null);
        fetchCallStats();
        fetchMyReports();
      }
    } catch (error) {
      console.error('Error uploading spreadsheet:', error);
      toast.error(error.response?.data?.detail || 'Failed to upload reports');
    } finally {
      setIsUploadingSpreadsheet(false);
    }
  };

  const handleSubmit = async (e, forceUpdate = false) => {
    e?.preventDefault();
    
    // Validate mandatory fields
    if (!validateForm()) {
      toast.error('Please fill all mandatory fields', {
        description: 'Fields marked with * are required',
      });
      return;
    }

    if (!canSubmit) {
      toast.error('Please wait', {
        description: 'You can submit another report after 5 seconds',
      });
      return;
    }

    setIsSubmitting(true);
    setCanSubmit(false);

    try {
      const submitData = { ...formData };
      if (submitData.next_followup_date) {
        submitData.next_followup_date = format(new Date(submitData.next_followup_date), 'yyyy-MM-dd');
      }

      const url = forceUpdate 
        ? `${API}/consultant/reports?consultant_id=${consultantId}&update_existing=true`
        : `${API}/consultant/reports?consultant_id=${consultantId}`;
      
      const response = await axios.post(url, submitData);
      
      if (response.data.success) {
        const action = forceUpdate ? 'Updated' : 'Submitted';
        toast.success(`Report ${action} Successfully!`, {
          description: 'Your daily calling report has been recorded.',
        });
        
        resetForm();
        setLastSubmitTime(new Date());
        setShowDuplicateModal(false);
        setDuplicateInfo(null);
        setPendingFormData(null);
        fetchCallStats();
        fetchReminders();
        
        // Enable next submission after 5 seconds
        setTimeout(() => {
          setCanSubmit(true);
        }, 5000);
      } else if (response.data.duplicate) {
        // Duplicate found - ask for confirmation
        setDuplicateInfo({
          message: response.data.message,
          existingReportId: response.data.existing_report_id
        });
        setPendingFormData({ ...formData });
        setShowDuplicateModal(true);
        setCanSubmit(true);
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

  const handleDuplicateConfirm = async () => {
    if (pendingFormData) {
      setFormData(pendingFormData);
      await handleSubmit(null, true);
    }
  };

  const handleDuplicateCancel = () => {
    setShowDuplicateModal(false);
    setDuplicateInfo(null);
    setPendingFormData(null);
    setCanSubmit(true);
  };

  return (
    <div className={`min-h-screen py-4 md:py-8 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-2 md:px-4 max-w-5xl">
        {/* Header */}
        <div className={`mb-4 md:mb-6 p-4 md:p-6 rounded-lg shadow-lg border-l-4 border-green-500 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-lg md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Daily Report Dashboard</h1>
              <p className={`text-xs md:text-base mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Welcome, <span className="font-semibold text-green-500">{consultantName}</span></p>
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
            <Card className={`w-full max-w-md ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
              <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Quick Log Call</CardTitle>
                    <p className="text-sm text-red-100">Log failed or attempted calls only</p>
                  </div>
                  <button onClick={() => setShowQuickCall(false)} className="text-white hover:text-gray-200">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className={`p-3 rounded-lg text-sm ${isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                  <p><strong>Note:</strong> Successful calls are automatically logged when you submit a detailed Student Calling Report.</p>
                </div>
                <div>
                  <Label className={`text-sm ${isDark ? 'text-gray-300' : ''}`}>Student Name (Optional)</Label>
                  <Input
                    value={quickCallData.student_name}
                    onChange={(e) => setQuickCallData({...quickCallData, student_name: e.target.value})}
                    placeholder="Enter name or leave blank"
                    className={`mt-1 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                  />
                </div>
                <div>
                  <Label className={`text-sm font-semibold ${isDark ? 'text-gray-300' : ''}`}>
                    Contact Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={quickCallData.contact_number}
                    onChange={(e) => setQuickCallData({...quickCallData, contact_number: e.target.value})}
                    placeholder="Enter contact number (Required)"
                    className={`mt-1 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''} ${!quickCallData.contact_number ? 'border-red-300 focus:border-red-500' : ''}`}
                    required
                  />
                  {!quickCallData.contact_number && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Contact number is mandatory
                    </p>
                  )}
                </div>
                <div>
                  <Label className={`text-sm ${isDark ? 'text-gray-300' : ''}`}>Remarks (Optional)</Label>
                  <Textarea
                    value={quickCallData.remarks}
                    onChange={(e) => setQuickCallData({...quickCallData, remarks: e.target.value})}
                    placeholder="Brief note about the call..."
                    className={`mt-1 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    onClick={() => handleQuickCall('failed')}
                    className="bg-red-500 hover:bg-red-600 text-white"
                    disabled={!quickCallData.contact_number?.trim()}
                  >
                    <PhoneOff className="h-4 w-4 mr-2" />
                    Failed Call
                  </Button>
                  <Button
                    onClick={() => handleQuickCall('attempted')}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    disabled={!quickCallData.contact_number?.trim()}
                  >
                    <PhoneMissed className="h-4 w-4 mr-2" />
                    Attempted
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
          {/* Mobile Tab Navigation - Horizontal Scroll */}
          <div className="md:hidden overflow-x-auto pb-2 -mx-2 px-2">
            <TabsList className="inline-flex w-max min-w-full bg-gray-100 dark:bg-gray-800 p-1 rounded-lg gap-1">
              <TabsTrigger
                value="submit"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white font-semibold text-xs px-3 py-2 whitespace-nowrap"
              >
                <PlusCircle className="h-3 w-3 mr-1" />
                Report
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white font-semibold text-xs px-3 py-2 whitespace-nowrap"
              >
                <History className="h-3 w-3 mr-1" />
                Reports
              </TabsTrigger>
              <TabsTrigger
                value="calls"
                className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white font-semibold text-xs px-3 py-2 whitespace-nowrap"
              >
                <PhoneCall className="h-3 w-3 mr-1" />
                Calls
              </TabsTrigger>
              <TabsTrigger
                value="reminders"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white font-semibold text-xs px-3 py-2 whitespace-nowrap relative"
              >
                <Bell className="h-3 w-3 mr-1" />
                Reminders
                {(reminders.today_reminders.length > 0 || reminders.overdue_reminders.length > 0) && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {reminders.today_reminders.length + reminders.overdue_reminders.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="admissions"
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white font-semibold text-xs px-3 py-2 whitespace-nowrap"
              >
                <Award className="h-3 w-3 mr-1" />
                Admissions
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white font-semibold text-xs px-3 py-2 whitespace-nowrap"
              >
                <BarChart3 className="h-3 w-3 mr-1" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Desktop Tab Navigation */}
          <TabsList className="hidden md:grid w-full grid-cols-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg gap-1">
            <TabsTrigger
              value="submit"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white font-semibold text-sm px-2 py-2"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Submit Report
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white font-semibold text-sm px-2 py-2"
            >
              <History className="h-4 w-4 mr-2" />
              My Reports
            </TabsTrigger>
            <TabsTrigger
              value="calls"
              className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white font-semibold text-sm px-2 py-2"
            >
              <PhoneCall className="h-4 w-4 mr-2" />
              My Calls
            </TabsTrigger>
            <TabsTrigger
              value="reminders"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white font-semibold text-sm px-2 py-2 relative"
            >
              <Bell className="h-4 w-4 mr-2" />
              Reminders
              {(reminders.today_reminders.length > 0 || reminders.overdue_reminders.length > 0) && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {reminders.today_reminders.length + reminders.overdue_reminders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="admissions"
              className="data-[state=active]:bg-purple-500 data-[state=active]:text-white font-semibold text-sm px-2 py-2"
            >
              <Award className="h-4 w-4 mr-2" />
              My Admissions
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white font-semibold text-sm px-2 py-2"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
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

            {/* Bulk Upload Section */}
            <Card className={`mb-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'}`} data-testid="bulk-upload-section">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Bulk Report Entry</h3>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Add multiple reports at once — via spreadsheet or CSV upload</p>
                  </div>
                </div>

                {/* Mode Selection Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={openSpreadsheet}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                      bulkMode === 'spreadsheet'
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
                        : isDark ? 'border-gray-600 hover:border-cyan-500/50 bg-gray-700/50' : 'border-gray-200 hover:border-cyan-400'
                    }`}
                    data-testid="open-spreadsheet-btn"
                  >
                    <div className="p-2 bg-cyan-100 dark:bg-cyan-900/40 rounded-lg">
                      <TableIcon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div className="text-left">
                      <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>In-App Spreadsheet</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Type directly into a table</p>
                    </div>
                  </button>
                  <button
                    onClick={() => { setBulkMode('csv'); }}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                      bulkMode === 'csv'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : isDark ? 'border-gray-600 hover:border-green-500/50 bg-gray-700/50' : 'border-gray-200 hover:border-green-400'
                    }`}
                    data-testid="open-csv-mode-btn"
                  >
                    <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                      <Upload className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-left">
                      <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Upload CSV File</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Import from a CSV file</p>
                    </div>
                  </button>
                </div>

                {/* CSV Mode Panel */}
                {bulkMode === 'csv' && (
                  <div className={`p-4 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`} data-testid="csv-mode-panel">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Button
                        onClick={downloadSampleCsv}
                        variant="outline"
                        size="sm"
                        className={isDark ? 'border-gray-500' : ''}
                        data-testid="download-sample-csv-btn"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Sample CSV
                      </Button>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                        data-testid="upload-csv-btn"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload CSV
                      </Button>
                    </div>
                    <div className={`p-3 rounded-lg border-l-4 border-yellow-500 ${isDark ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                        <div>
                          <p className={`font-semibold text-xs ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>CSV Format Requirements</p>
                          <ul className={`text-xs mt-1 space-y-0.5 ${isDark ? 'text-yellow-200' : 'text-yellow-700'}`}>
                            <li>Download the sample CSV first to see the correct format</li>
                            <li><strong>Required:</strong> Student Name, Contact Number, Institution, Exam Preference, Career Interest, Interest Scope</li>
                            <li><strong>Interest Scope:</strong> ACTIVELY INTERESTED, LESS INTERESTED, RECALLING NEEDED, DROPOUT THIS YEAR, ALREADY COLLEGE SELECTED, NOT INTERESTED</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Spreadsheet Mode Panel */}
                {bulkMode === 'spreadsheet' && showSpreadsheet && (
                  <div className={`rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-200'}`} data-testid="spreadsheet-panel">
                    <div className={`flex items-center justify-between p-3 border-b ${isDark ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {spreadsheetRows.length} row(s) — fill in details below
                      </p>
                      <Button onClick={addSpreadsheetRow} size="sm" variant="outline" className={isDark ? 'border-gray-500' : ''} data-testid="add-row-btn">
                        <Plus className="h-4 w-4 mr-1" /> Add Row
                      </Button>
                    </div>
                    <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className={`sticky top-0 z-10 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <tr>
                            <th className={`px-2 py-2 text-left font-semibold text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>#</th>
                            <th className={`px-2 py-2 text-left font-semibold text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Student Name *</th>
                            <th className={`px-2 py-2 text-left font-semibold text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Contact No. *</th>
                            <th className={`px-2 py-2 text-left font-semibold text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Institution *</th>
                            <th className={`px-2 py-2 text-left font-semibold text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Exam Pref. *</th>
                            <th className={`px-2 py-2 text-left font-semibold text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Career Interest *</th>
                            <th className={`px-2 py-2 text-left font-semibold text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>College Interest</th>
                            <th className={`px-2 py-2 text-left font-semibold text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Interest Scope *</th>
                            <th className={`px-2 py-2 text-left font-semibold text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Followup Date</th>
                            <th className={`px-2 py-2 text-left font-semibold text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Remarks</th>
                            <th className={`px-2 py-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {spreadsheetRows.map((row, idx) => (
                            <tr key={idx} className={`border-t ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                              <td className={`px-2 py-1 text-xs font-mono ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{idx + 1}</td>
                              {['student_name', 'contact_number', 'institution_name', 'competitive_exam_preference', 'career_interest', 'college_interest'].map(field => (
                                <td key={field} className="px-1 py-1">
                                  <input
                                    value={row[field]}
                                    onChange={e => updateSpreadsheetRow(idx, field, e.target.value)}
                                    className={`w-full px-2 py-1.5 text-xs rounded border ${
                                      spreadsheetErrors[idx]?.[field]
                                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                        : isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'
                                    } focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                                    placeholder={field.replace(/_/g, ' ')}
                                    data-testid={`spreadsheet-${field}-${idx}`}
                                  />
                                </td>
                              ))}
                              <td className="px-1 py-1">
                                <select
                                  value={row.interest_scope}
                                  onChange={e => updateSpreadsheetRow(idx, 'interest_scope', e.target.value)}
                                  className={`w-full px-2 py-1.5 text-xs rounded border ${
                                    spreadsheetErrors[idx]?.interest_scope
                                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                      : isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'
                                  } focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                                  data-testid={`spreadsheet-interest_scope-${idx}`}
                                >
                                  <option value="">Select...</option>
                                  {INTEREST_SCOPE_OPTIONS.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-1 py-1">
                                <input
                                  type="date"
                                  value={row.next_followup_date}
                                  onChange={e => updateSpreadsheetRow(idx, 'next_followup_date', e.target.value)}
                                  className={`w-full px-2 py-1.5 text-xs rounded border ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                                  data-testid={`spreadsheet-followup-${idx}`}
                                />
                              </td>
                              <td className="px-1 py-1">
                                <input
                                  value={row.other_remarks}
                                  onChange={e => updateSpreadsheetRow(idx, 'other_remarks', e.target.value)}
                                  className={`w-full px-2 py-1.5 text-xs rounded border ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                                  placeholder="remarks"
                                  data-testid={`spreadsheet-remarks-${idx}`}
                                />
                              </td>
                              <td className="px-1 py-1 text-center">
                                <button
                                  onClick={() => removeSpreadsheetRow(idx)}
                                  className="text-red-400 hover:text-red-600 p-1"
                                  data-testid={`remove-row-${idx}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {Object.keys(spreadsheetErrors).length > 0 && (
                      <div className={`mx-3 my-2 p-2 rounded text-xs ${isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-600'}`}>
                        <AlertTriangle className="h-3 w-3 inline mr-1" />
                        Fill all required fields (*) highlighted in red
                      </div>
                    )}
                    <div className={`flex justify-between items-center p-3 border-t ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                      <Button
                        onClick={() => { setShowSpreadsheet(false); setSpreadsheetRows([]); setSpreadsheetErrors({}); setBulkMode(null); }}
                        variant="outline"
                        size="sm"
                        className={isDark ? 'border-gray-500' : ''}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={uploadSpreadsheetReports}
                        disabled={isUploadingSpreadsheet || spreadsheetRows.length === 0}
                        size="sm"
                        className="bg-cyan-500 hover:bg-cyan-600 text-white"
                        data-testid="submit-spreadsheet-btn"
                      >
                        {isUploadingSpreadsheet ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Uploading...
                          </span>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Submit {spreadsheetRows.length} Report(s)
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Report Form */}
            <Card className={`shadow-xl border-2 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200'}`}>
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 md:p-6">
                <CardTitle className="text-lg md:text-2xl">Student Calling Report</CardTitle>
                <p className="text-green-100 text-xs md:text-sm">Fill in the details for each student call</p>
              </CardHeader>
              <CardContent className="p-4 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Student Name */}
                  <div>
                    <Label htmlFor="student_name" className={`font-semibold flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                      <User className="h-4 w-4 text-green-500" />
                      Student Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="student_name"
                      name="student_name"
                      type="text"
                      required
                      value={formData.student_name}
                      onChange={handleChange}
                      placeholder="Enter student's full name"
                      className={`mt-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''} ${validationErrors.student_name ? 'border-red-500' : ''}`}
                      disabled={isSubmitting}
                    />
                    {validationErrors.student_name && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {validationErrors.student_name}
                      </p>
                    )}
                  </div>

                  {/* Contact Number */}
                  <div>
                    <Label htmlFor="contact_number" className={`font-semibold flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                      <Phone className="h-4 w-4 text-green-500" />
                      Contact Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="contact_number"
                      name="contact_number"
                      type="tel"
                      required
                      value={formData.contact_number}
                      onChange={handleChange}
                      placeholder="Enter contact number"
                      className={`mt-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''} ${validationErrors.contact_number ? 'border-red-500' : ''}`}
                      disabled={isSubmitting}
                    />
                    {validationErrors.contact_number && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {validationErrors.contact_number}
                      </p>
                    )}
                  </div>

                  {/* Institution Name */}
                  <div>
                    <Label htmlFor="institution_name" className={`font-semibold flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                      <Building className="h-4 w-4 text-green-500" />
                      Institution Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="institution_name"
                      name="institution_name"
                      type="text"
                      required
                      value={formData.institution_name}
                      onChange={handleChange}
                      placeholder="Enter institution/school/college name"
                      className={`mt-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''} ${validationErrors.institution_name ? 'border-red-500' : ''}`}
                      disabled={isSubmitting}
                    />
                    {validationErrors.institution_name && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {validationErrors.institution_name}
                      </p>
                    )}
                  </div>

                  {/* Competitive Exam Preference */}
                  <div>
                    <Label htmlFor="competitive_exam_preference" className={`font-semibold flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                      <BookOpen className="h-4 w-4 text-green-500" />
                      Competitive Exam Preference <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="competitive_exam_preference"
                      name="competitive_exam_preference"
                      type="text"
                      required
                      value={formData.competitive_exam_preference}
                      onChange={handleChange}
                      placeholder="e.g., JEE, NEET, WBJEE, JENPAS"
                      className={`mt-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''} ${validationErrors.competitive_exam_preference ? 'border-red-500' : ''}`}
                      disabled={isSubmitting}
                    />
                    {validationErrors.competitive_exam_preference && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {validationErrors.competitive_exam_preference}
                      </p>
                    )}
                  </div>

                  {/* Career Interest */}
                  <div>
                    <Label htmlFor="career_interest" className={`font-semibold flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                      <Briefcase className="h-4 w-4 text-green-500" />
                      Career Interest <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="career_interest"
                      name="career_interest"
                      type="text"
                      required
                      value={formData.career_interest}
                      onChange={handleChange}
                      placeholder="e.g., Engineering, Medical, Management"
                      className={`mt-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''} ${validationErrors.career_interest ? 'border-red-500' : ''}`}
                      disabled={isSubmitting}
                    />
                    {validationErrors.career_interest && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {validationErrors.career_interest}
                      </p>
                    )}
                  </div>

                  {/* College Interest (Optional) */}
                  <div>
                    <Label htmlFor="college_interest" className={`font-semibold flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
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
                      className={`mt-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}`}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Interest Scope */}
                  <div>
                    <Label htmlFor="interest_scope" className={`font-semibold flex items-center gap-2 mb-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                      <FileText className="h-4 w-4 text-green-500" />
                      Interest Scope <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.interest_scope}
                      onValueChange={handleSelectChange}
                      disabled={isSubmitting}
                      required
                    >
                      <SelectTrigger className={`w-full ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''} ${validationErrors.interest_scope ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Select interest level" />
                      </SelectTrigger>
                      <SelectContent className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                        {INTEREST_SCOPE_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option} className={isDark ? 'text-white hover:bg-gray-700' : ''}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.interest_scope && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {validationErrors.interest_scope}
                      </p>
                    )}
                  </div>

                  {/* Next Calling Reminder (Optional) */}
                  <div>
                    <Label htmlFor="next_followup_date" className={`font-semibold flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                      <Bell className="h-4 w-4 text-orange-500" />
                      Next Calling Reminder (Optional)
                    </Label>
                    <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Set a follow-up reminder date for this student
                    </p>
                    <Popover open={isFollowupCalendarOpen} onOpenChange={setIsFollowupCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isSubmitting}
                          className={`w-full justify-start text-left font-normal ${isDark ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : ''} ${!formData.next_followup_date && 'text-muted-foreground'}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.next_followup_date 
                            ? format(new Date(formData.next_followup_date), 'dd MMM yyyy')
                            : 'Select reminder date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className={`w-auto p-0 ${isDark ? 'bg-gray-800 border-gray-700' : ''}`} align="start">
                        <Calendar
                          mode="single"
                          selected={formData.next_followup_date ? new Date(formData.next_followup_date) : undefined}
                          onSelect={(date) => {
                            setFormData(prev => ({ ...prev, next_followup_date: date ? date.toISOString() : '' }));
                            setIsFollowupCalendarOpen(false);
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {formData.next_followup_date && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, next_followup_date: '' }))}
                        className="mt-1 text-red-500 hover:text-red-700 hover:bg-red-50 text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear Reminder
                      </Button>
                    )}
                  </div>

                  {/* Other Remarks (Optional) */}
                  <div>
                    <Label htmlFor="other_remarks" className={`font-semibold flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
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
                      className={`mt-2 resize-none ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}`}
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
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">My Call History</CardTitle>
                <p className="text-indigo-100 text-xs md:text-sm">Click on any stat to view detailed call list</p>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <p className={`text-xs md:text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Click on any of the cards below to see detailed call information
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                  {/* Total Calls */}
                  <button
                    onClick={() => fetchCallDetails('all')}
                    className={`p-3 md:p-4 rounded-lg cursor-pointer transition-all hover:scale-105 ${isDark ? 'bg-blue-900/30 hover:bg-blue-900/50' : 'bg-blue-50 hover:bg-blue-100'}`}
                  >
                    <PhoneCall className={`h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                    <p className={`text-lg md:text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{callStats.total_calls}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total</p>
                  </button>
                  {/* Successful */}
                  <button
                    onClick={() => fetchCallDetails('successful')}
                    className={`p-3 md:p-4 rounded-lg cursor-pointer transition-all hover:scale-105 ${isDark ? 'bg-green-900/30 hover:bg-green-900/50' : 'bg-green-50 hover:bg-green-100'}`}
                  >
                    <CheckCircle className={`h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
                    <p className={`text-lg md:text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{callStats.successful_calls}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Successful</p>
                  </button>
                  {/* Failed */}
                  <button
                    onClick={() => fetchCallDetails('failed')}
                    className={`p-3 md:p-4 rounded-lg cursor-pointer transition-all hover:scale-105 ${isDark ? 'bg-red-900/30 hover:bg-red-900/50' : 'bg-red-50 hover:bg-red-100'}`}
                  >
                    <PhoneOff className={`h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                    <p className={`text-lg md:text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>{callStats.failed_calls}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Failed</p>
                  </button>
                  {/* Attempted */}
                  <button
                    onClick={() => fetchCallDetails('attempted')}
                    className={`p-3 md:p-4 rounded-lg cursor-pointer transition-all hover:scale-105 ${isDark ? 'bg-yellow-900/30 hover:bg-yellow-900/50' : 'bg-yellow-50 hover:bg-yellow-100'}`}
                  >
                    <PhoneMissed className={`h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
                    <p className={`text-lg md:text-2xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>{callStats.attempted_calls}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Attempted</p>
                  </button>
                </div>
                <Button
                  onClick={() => setShowQuickCall(true)}
                  className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-purple-600"
                >
                  <PhoneCall className="h-4 w-4 mr-2" />
                  Log a Call
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reminders Tab */}
          <TabsContent value="reminders">
            {/* Notification Banner for Today's Reminders */}
            {(reminders.today_reminders.length > 0 || reminders.overdue_reminders.length > 0) && (
              <div className={`mb-4 p-4 rounded-lg border-l-4 border-orange-500 ${isDark ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
                <div className="flex items-center gap-2">
                  <BellRing className="h-5 w-5 text-orange-500 animate-pulse" />
                  <p className={`font-semibold ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>
                    You have {reminders.today_reminders.length} reminder(s) for today
                    {reminders.overdue_reminders.length > 0 && ` and ${reminders.overdue_reminders.length} overdue reminder(s)`}
                  </p>
                </div>
              </div>
            )}

            {/* Refresh Button */}
            <div className="flex justify-end mb-4">
              <Button
                onClick={fetchReminders}
                variant="outline"
                disabled={loadingReminders}
                className={isDark ? 'border-gray-600' : 'border-gray-300'}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loadingReminders ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {loadingReminders ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <p className={`ml-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading reminders...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overdue Reminders */}
                {reminders.overdue_reminders.length > 0 && (
                  <Card className={`border-l-4 border-red-500 ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
                    <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Overdue Reminders ({reminders.overdue_reminders.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                              <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Student</TableHead>
                              <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Contact</TableHead>
                              <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Reminder Date</TableHead>
                              <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {reminders.overdue_reminders.map((reminder, idx) => (
                              <TableRow key={reminder.id || idx} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                                <TableCell className={`font-medium ${isDark ? 'text-white' : ''}`}>{reminder.student_name}</TableCell>
                                <TableCell>
                                  <a href={`tel:${reminder.contact_number}`} className="text-blue-500 hover:underline">
                                    {reminder.contact_number}
                                  </a>
                                </TableCell>
                                <TableCell className="text-red-500">{reminder.next_followup_date}</TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      onClick={() => markReminderComplete(reminder.id)}
                                      className="bg-green-500 hover:bg-green-600 text-white text-xs"
                                    >
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Followed Up
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => ignoreReminder(reminder.id)}
                                      className={`text-xs ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
                                    >
                                      <X className="h-3 w-3 mr-1" />
                                      Ignore
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
                )}

                {/* Today's Reminders */}
                {reminders.today_reminders.length > 0 && (
                  <Card className={`border-l-4 border-orange-500 ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
                    <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BellRing className="h-5 w-5" />
                        Today's Reminders ({reminders.today_reminders.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                              <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Student</TableHead>
                              <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Contact</TableHead>
                              <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Interest</TableHead>
                              <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {reminders.today_reminders.map((reminder, idx) => (
                              <TableRow key={reminder.id || idx} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                                <TableCell className={`font-medium ${isDark ? 'text-white' : ''}`}>{reminder.student_name}</TableCell>
                                <TableCell>
                                  <a href={`tel:${reminder.contact_number}`} className="text-blue-500 hover:underline">
                                    {reminder.contact_number}
                                  </a>
                                </TableCell>
                                <TableCell>
                                  <Badge className="bg-blue-100 text-blue-800">{reminder.career_interest}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      onClick={() => markReminderComplete(reminder.id)}
                                      className="bg-green-500 hover:bg-green-600 text-white text-xs"
                                    >
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Followed Up
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => ignoreReminder(reminder.id)}
                                      className={`text-xs ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
                                    >
                                      <X className="h-3 w-3 mr-1" />
                                      Ignore
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
                )}

                {/* Upcoming Reminders */}
                <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Upcoming Reminders ({reminders.upcoming_reminders.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {reminders.upcoming_reminders.length === 0 ? (
                      <div className="text-center py-8">
                        <Bell className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No upcoming reminders</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                              <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Student</TableHead>
                              <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Contact</TableHead>
                              <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Reminder Date</TableHead>
                              <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Interest</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {reminders.upcoming_reminders.map((reminder, idx) => (
                              <TableRow key={reminder.id || idx} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                                <TableCell className={`font-medium ${isDark ? 'text-white' : ''}`}>{reminder.student_name}</TableCell>
                                <TableCell>
                                  <a href={`tel:${reminder.contact_number}`} className="text-blue-500 hover:underline">
                                    {reminder.contact_number}
                                  </a>
                                </TableCell>
                                <TableCell className={isDark ? 'text-gray-300' : ''}>{reminder.next_followup_date}</TableCell>
                                <TableCell>
                                  <Badge className="bg-blue-100 text-blue-800">{reminder.career_interest}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* My Admissions Tab */}
          <TabsContent value="admissions">
            {/* Stats Cards for Admissions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-6">
              <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Admissions</p>
                      <p className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{myAdmissions.length}</p>
                    </div>
                    <GraduationCap className="h-8 w-8 md:h-10 md:w-10 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Earnings</p>
                      <p className="text-2xl md:text-3xl font-bold text-green-500">
                        ₹{myAdmissions.reduce((sum, a) => sum + parseFloat(a.payout_amount || 0), 0).toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 md:h-10 md:w-10 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Payout Received</p>
                      <p className="text-2xl md:text-3xl font-bold text-blue-500">
                        {myAdmissions.filter(a => a.payout_status === "CONSULTANT'S COMMISION GIVEN").length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 md:h-10 md:w-10 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Refresh Button */}
            <Card className={`mb-4 ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Credited Admissions</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Admissions assigned to you by the admin</p>
                  </div>
                  <Button
                    onClick={fetchMyAdmissions}
                    variant="outline"
                    disabled={loadingAdmissions}
                    className={isDark ? 'border-gray-600' : 'border-gray-300'}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loadingAdmissions ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Admissions Table */}
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <CardTitle className="text-xl">My Admissions ({myAdmissions.length})</CardTitle>
                <p className="text-purple-100 text-sm">View all admissions credited to you and their payout status</p>
              </CardHeader>
              <CardContent className="p-0">
                {loadingAdmissions ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className={`ml-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading admissions...</p>
                  </div>
                ) : myAdmissions.length === 0 ? (
                  <div className="text-center py-12">
                    <GraduationCap className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No admissions credited yet</p>
                    <p className={`text-sm mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>When students are admitted through your referral, they will appear here</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                          <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Student Name</TableHead>
                          <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Course</TableHead>
                          <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>College</TableHead>
                          <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Admission Date</TableHead>
                          <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Payout Amount</TableHead>
                          <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Payout Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {myAdmissions.map((admission, index) => (
                          <TableRow key={admission.id || index} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                            <TableCell className={`font-medium ${isDark ? 'text-white' : ''}`}>{admission.student_name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-50'}>
                                {admission.course}
                              </Badge>
                            </TableCell>
                            <TableCell className={`text-sm ${isDark ? 'text-gray-300' : ''}`}>{admission.college}</TableCell>
                            <TableCell className={`text-sm ${isDark ? 'text-gray-300' : ''}`}>{admission.admission_date}</TableCell>
                            <TableCell className="font-semibold text-green-500">
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
              <Card className={`mt-6 ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
                <CardContent className="p-6">
                  <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Payout Summary</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg ${isDark ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
                      <p className={`text-sm font-medium ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>Pending</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>
                        ₹{myAdmissions
                          .filter(a => a.payout_status === 'PAYOUT NOT CREDITED YET')
                          .reduce((sum, a) => sum + parseFloat(a.payout_amount || 0), 0)
                          .toLocaleString()}
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                      <p className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Reflected</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                        ₹{myAdmissions
                          .filter(a => a.payout_status === 'PAYOUT REFLECTED')
                          .reduce((sum, a) => sum + parseFloat(a.payout_amount || 0), 0)
                          .toLocaleString()}
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg ${isDark ? 'bg-green-900/30' : 'bg-green-50'}`}>
                      <p className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-700'}`}>Received</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-green-300' : 'text-green-800'}`}>
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

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} data-testid="consultant-analytics-title">My Analytics</h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Your performance overview and trends</p>
              </div>
              <Button
                onClick={fetchConsultantAnalytics}
                variant="outline"
                disabled={loadingAnalytics}
                className={isDark ? 'border-gray-600' : 'border-gray-300'}
                data-testid="refresh-analytics-btn"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loadingAnalytics ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {loadingAnalytics ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p className={`ml-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading analytics...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overview Cards */}
                {analyticsOverview && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4" data-testid="consultant-analytics-overview">
                    <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Reports</p>
                            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{analyticsOverview.total_reports}</p>
                            <p className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}>+{analyticsOverview.today_reports} today</p>
                          </div>
                          <FileText className={`h-8 w-8 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Calls</p>
                            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{analyticsOverview.total_calls}</p>
                            <p className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>+{analyticsOverview.today_calls} today</p>
                          </div>
                          <PhoneCall className={`h-8 w-8 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>This Week</p>
                            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{analyticsOverview.week_reports}</p>
                            <p className={`text-xs ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>reports</p>
                          </div>
                          <GraduationCap className={`h-8 w-8 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Charts Row 1 - Pie Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Call Distribution Pie Chart */}
                  <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''} data-testid="consultant-call-distribution-chart">
                    <CardHeader>
                      <CardTitle className={`text-lg flex items-center gap-2 ${isDark ? 'text-white' : ''}`}>
                        <PieChart className="h-5 w-5 text-cyan-500" />
                        My Call Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {callDistribution.length > 0 && callDistribution.some(d => d.value > 0) ? (
                        <ResponsiveContainer width="100%" height={250}>
                          <RechartsPieChart>
                            <Pie
                              data={callDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {callDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-center py-8">
                          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No call data available yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Interest Scope Distribution */}
                  <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''} data-testid="consultant-interest-scope-chart">
                    <CardHeader>
                      <CardTitle className={`text-lg flex items-center gap-2 ${isDark ? 'text-white' : ''}`}>
                        <PieChart className="h-5 w-5 text-purple-500" />
                        Student Interest Scope
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {interestDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                          <RechartsPieChart>
                            <Pie
                              data={interestDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {interestDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-center py-8">
                          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No interest data available yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Reports Trend Line Chart */}
                <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''} data-testid="consultant-reports-trend-chart">
                  <CardHeader>
                    <CardTitle className={`text-lg flex items-center gap-2 ${isDark ? 'text-white' : ''}`}>
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      My Reports Trend (Last 14 Days)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {reportsTrend.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={reportsTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                          <XAxis dataKey="date" stroke={isDark ? '#9ca3af' : '#6b7280'} fontSize={12} />
                          <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: isDark ? '#1f2937' : '#fff',
                              border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
                              color: isDark ? '#fff' : '#000'
                            }}
                          />
                          <Area type="monotone" dataKey="reports" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-8">
                        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No trend data available yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Daily Calls Stacked Bar Chart */}
                <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''} data-testid="consultant-daily-calls-chart">
                  <CardHeader>
                    <CardTitle className={`text-lg flex items-center gap-2 ${isDark ? 'text-white' : ''}`}>
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                      Daily Call Breakdown (Last 14 Days)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dailyCalls.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dailyCalls}>
                          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                          <XAxis dataKey="date" stroke={isDark ? '#9ca3af' : '#6b7280'} fontSize={12} />
                          <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: isDark ? '#1f2937' : '#fff',
                              border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
                              color: isDark ? '#fff' : '#000'
                            }}
                          />
                          <Legend />
                          <Bar dataKey="successful" stackId="a" fill="#22c55e" name="Successful" />
                          <Bar dataKey="failed" stackId="a" fill="#ef4444" name="Failed" />
                          <Bar dataKey="attempted" stackId="a" fill="#eab308" name="Attempted" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-8">
                        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No daily call data available yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
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

        {/* Duplicate Report Confirmation Modal */}
        {showDuplicateModal && duplicateInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className={`max-w-md w-full ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
              <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Duplicate Report Found
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  {duplicateInfo.message}
                </p>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-50 text-yellow-700'}`}>
                  <p className="text-sm">
                    <strong>Warning:</strong> If you proceed, the old report will be permanently deleted and replaced with this new report.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleDuplicateCancel}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDuplicateConfirm}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Yes, Update Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Call Details Modal */}
        {showCallDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
              <CardHeader className={`bg-gradient-to-r ${
                callDetailsType === 'successful' ? 'from-green-500 to-green-600' :
                callDetailsType === 'failed' ? 'from-red-500 to-red-600' :
                callDetailsType === 'attempted' ? 'from-yellow-500 to-yellow-600' :
                'from-blue-500 to-indigo-600'
              } text-white`}>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {callDetailsType === 'successful' && <CheckCircle className="h-5 w-5" />}
                    {callDetailsType === 'failed' && <PhoneOff className="h-5 w-5" />}
                    {callDetailsType === 'attempted' && <PhoneMissed className="h-5 w-5" />}
                    {callDetailsType === 'all' && <PhoneCall className="h-5 w-5" />}
                    {callDetailsType === 'all' ? 'All' : callDetailsType.charAt(0).toUpperCase() + callDetailsType.slice(1)} Calls ({callDetailsList.length})
                  </CardTitle>
                  <button onClick={() => setShowCallDetails(false)} className="text-white hover:text-gray-200">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loadingCallDetails ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : callDetailsList.length === 0 ? (
                  <div className="text-center py-12">
                    <PhoneCall className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                    <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No calls found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                          <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Date & Time</TableHead>
                          <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Student</TableHead>
                          <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Contact</TableHead>
                          <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Type</TableHead>
                          <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Remarks</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {callDetailsList.map((call, idx) => (
                          <TableRow key={call.id || idx} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                            <TableCell className={`text-sm ${isDark ? 'text-gray-300' : ''}`}>
                              {formatDate(call.created_at)}
                            </TableCell>
                            <TableCell className={`font-medium ${isDark ? 'text-white' : ''}`}>
                              {call.student_name || 'N/A'}
                            </TableCell>
                            <TableCell>
                              <a href={`tel:${call.contact_number}`} className="text-blue-500 hover:underline">
                                {call.contact_number}
                              </a>
                            </TableCell>
                            <TableCell>
                              <Badge className={
                                call.call_type === 'successful' ? 'bg-green-100 text-green-800' :
                                call.call_type === 'failed' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }>
                                {call.call_type}
                              </Badge>
                            </TableCell>
                            <TableCell className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              {call.remarks || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* CSV Upload Modal */}
        {showCsvUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Bulk Report Upload Preview
                  </CardTitle>
                  <button onClick={() => { setShowCsvUpload(false); setCsvData([]); setCsvErrors([]); }} className="text-white hover:text-gray-200">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                {csvErrors.length > 0 && (
                  <div className={`mb-4 p-3 rounded-lg ${isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'}`}>
                    <p className="font-semibold mb-2">Errors found:</p>
                    <ul className="list-disc list-inside text-sm">
                      {csvErrors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Preview of {csvData.length} valid report(s) to be uploaded:
                </p>

                <div className="overflow-x-auto mb-4">
                  <Table>
                    <TableHeader>
                      <TableRow className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                        <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>#</TableHead>
                        <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Student</TableHead>
                        <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Contact</TableHead>
                        <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Institution</TableHead>
                        <TableHead className={`font-semibold ${isDark ? 'text-gray-200' : ''}`}>Interest Scope</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvData.slice(0, 10).map((row, idx) => (
                        <TableRow key={idx} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                          <TableCell className={isDark ? 'text-gray-300' : ''}>{idx + 1}</TableCell>
                          <TableCell className={`font-medium ${isDark ? 'text-white' : ''}`}>{row.student_name}</TableCell>
                          <TableCell className={isDark ? 'text-gray-300' : ''}>{row.contact_number}</TableCell>
                          <TableCell className={isDark ? 'text-gray-300' : ''}>{row.institution_name}</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-800">{row.interest_scope}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {csvData.length > 10 && (
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    ... and {csvData.length - 10} more rows
                  </p>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={() => { setShowCsvUpload(false); setCsvData([]); setCsvErrors([]); }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={uploadCsvReports}
                    disabled={isUploadingCsv || csvData.length === 0}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    {isUploadingCsv ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </div>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload {csvData.length} Reports
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reminder Notification Popup - Shows on Login */}
        {showReminderNotification && notificationReminders.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className={`max-w-lg w-full max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BellRing className="h-5 w-5 animate-pulse" />
                      Follow-up Reminders!
                    </CardTitle>
                    <p className="text-sm text-orange-100 mt-1">
                      You have {notificationReminders.length} student(s) to follow up
                    </p>
                  </div>
                  <button onClick={() => setShowReminderNotification(false)} className="text-white hover:text-gray-200">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {notificationReminders.map((reminder, idx) => (
                  <div 
                    key={reminder.id || idx} 
                    className={`p-4 rounded-lg border-l-4 ${
                      reminder.next_followup_date < new Date().toISOString().split('T')[0] 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{reminder.student_name}</p>
                        <a href={`tel:${reminder.contact_number}`} className="text-blue-500 text-sm hover:underline">
                          {reminder.contact_number}
                        </a>
                      </div>
                      <Badge className={
                        reminder.next_followup_date < new Date().toISOString().split('T')[0]
                          ? 'bg-red-100 text-red-800'
                          : 'bg-orange-100 text-orange-800'
                      }>
                        {reminder.next_followup_date < new Date().toISOString().split('T')[0] ? 'Overdue' : 'Today'}
                      </Badge>
                    </div>
                    <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Interest: {reminder.career_interest} | Date: {reminder.next_followup_date}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => markReminderComplete(reminder.id)}
                        className="bg-green-500 hover:bg-green-600 text-white flex-1"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Already Followed Up
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => ignoreReminder(reminder.id)}
                        className={`flex-1 ${isDark ? 'border-gray-600 text-gray-300' : ''}`}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Ignore
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t">
                  <Button
                    onClick={() => setShowReminderNotification(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Close & View Later
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Hidden File Input for CSV */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv"
          onChange={handleCsvFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ConsultantDashboard;
