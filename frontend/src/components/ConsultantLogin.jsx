import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Lock, User, Eye, EyeOff, UserCheck, Phone, FileText, Award, Target } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ConsultantLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    user_id: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${API}/consultant/login?user_id=${credentials.user_id}&password=${encodeURIComponent(credentials.password)}`
      );
      
      if (response.data.success) {
        // Store authentication
        localStorage.setItem('consultantAuth', 'true');
        localStorage.setItem('consultantId', response.data.consultant_id);
        localStorage.setItem('consultantName', response.data.consultant_name);
        localStorage.setItem('consultantLoginTime', new Date().toISOString());
        
        toast.success('Login Successful!', {
          description: `Welcome ${response.data.consultant_name}`,
        });
        
        // Navigate to consultant dashboard
        navigate('/consultant/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login Failed', {
        description: error.response?.data?.detail || 'Invalid User ID or Password',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Graphics */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Icons */}
        <div className="absolute top-16 left-5 md:left-16 text-green-200 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
          <Phone className="h-12 w-12 md:h-16 md:w-16" />
        </div>
        <div className="absolute top-32 right-5 md:right-20 text-blue-200 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}>
          <FileText className="h-10 w-10 md:h-14 md:w-14" />
        </div>
        <div className="absolute bottom-32 left-10 md:left-20 text-green-200 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
          <Award className="h-14 w-14 md:h-20 md:w-20" />
        </div>
        <div className="absolute bottom-20 right-5 md:right-16 text-blue-200 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.2s' }}>
          <Target className="h-12 w-12 md:h-16 md:w-16" />
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 md:w-96 md:h-96 bg-green-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 md:w-72 md:h-72 bg-blue-100 rounded-full opacity-40"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-green-100 rounded-full opacity-30 hidden md:block"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%2322C55E%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M0 0h40v40H0V0zm1 1h38v38H1V1z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
        <div className="flex items-center space-x-2 md:space-x-3">
          <img
            src="https://static.prod-images.emergentagent.com/jobs/9e72d044-fd83-4308-bd70-6417dfaebaf8/images/725422b1dccb8b76f317695455f20615e13ed5e74c2344282911621b3474b267.png"
            alt="Edu Advisor Logo"
            className="h-10 w-10 md:h-12 md:w-12 object-contain"
          />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Edu <span className="text-yellow-500">Advisor</span>
            </h1>
            <p className="text-xs text-gray-600 hidden sm:block">Consultant Portal</p>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-md mx-4 shadow-2xl border-2 border-gray-200 relative z-10">
        <CardHeader className="text-center pb-6 md:pb-8 pt-6 md:pt-8 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-t-lg">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserCheck className="h-8 w-8 md:h-10 md:w-10 text-green-500" />
          </div>
          <CardTitle className="text-xl md:text-2xl font-bold">Consultant Portal</CardTitle>
          <p className="text-green-100 text-xs md:text-sm mt-2">Daily Reporting System</p>
        </CardHeader>
        <CardContent className="p-4 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="user_id" className="text-gray-900 font-semibold flex items-center gap-2 text-sm md:text-base">
                <User className="h-4 w-4 text-green-500" />
                User ID
              </Label>
              <Input
                id="user_id"
                name="user_id"
                type="text"
                required
                value={credentials.user_id}
                onChange={handleChange}
                placeholder="Enter your User ID"
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-900 font-semibold flex items-center gap-2 text-sm md:text-base">
                <Lock className="h-4 w-4 text-green-500" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500 pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white hover:bg-green-600 font-semibold text-base md:text-lg py-5 md:py-6 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </div>
              ) : (
                'Login to Dashboard'
              )}
            </Button>
          </form>

          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
              <p className="text-xs text-blue-800 text-center">
                <Lock className="h-3 w-3 inline mr-1" />
                For Authorized Consultants Only
              </p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-green-500 transition-colors"
            >
              ← Back to Website
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="absolute bottom-4 text-center w-full z-10">
        <p className="text-xs md:text-sm text-gray-500">© 2026 Edu Advisor. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ConsultantLogin;
