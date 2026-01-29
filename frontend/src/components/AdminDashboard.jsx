import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
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
import { Search, Download, Phone, Mail, Calendar as CalendarIcon, BookOpen, MessageSquare, Filter, LogOut, Users, FileText, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { format } from 'date-fns';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const navigate = useNavigate();
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
  }, []);

  useEffect(() => {
    filterQueries();
  }, [queries, searchTerm, filterStatus]);

  useEffect(() => {
    filterReports();
  }, [consultantReports, reportSearchTerm, selectedConsultant, selectedDate]);

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage student queries and consultant reports</p>
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

        {/* Tabs for Queries and Consultant Reports */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1 rounded-lg max-w-md">
            <TabsTrigger
              value="queries"
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white font-semibold"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Student Queries
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white font-semibold"
            >
              <Users className="h-4 w-4 mr-2" />
              Consultant Reports
            </TabsTrigger>
          </TabsList>

          {/* Student Queries Tab */}
          <TabsContent value="queries">
            {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Queries</p>
                  <p className="text-3xl font-bold text-gray-900">{queries.length}</p>
                </div>
                <MessageSquare className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">New</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {queries.filter((q) => q.status === 'new').length}
                  </p>
                </div>
                <Calendar className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Contacted</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {queries.filter((q) => q.status === 'contacted').length}
                  </p>
                </div>
                <Phone className="h-10 w-10 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Closed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {queries.filter((q) => q.status === 'closed').length}
                  </p>
                </div>
                <BookOpen className="h-10 w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by name, email, phone, or course..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>

                <Button
                  onClick={exportToCSV}
                  className="bg-yellow-500 text-gray-900 hover:bg-yellow-600"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>

                <Button
                  onClick={fetchQueries}
                  variant="outline"
                  className="border-gray-300"
                >
                  Refresh
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
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedReport(report)}
                                className="text-xs"
                              >
                                View Details
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
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
