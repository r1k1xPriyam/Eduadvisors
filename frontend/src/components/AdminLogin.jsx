import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Lock, User, Eye, EyeOff, Shield, Users, BarChart3, FileCheck } from 'lucide-react';
import { toast } from 'sonner';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const ADMIN_USERNAME = 'ADMIN';
  const ADMIN_PASSWORD = 'Eduadvisors@2026';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate a slight delay for better UX
    setTimeout(() => {
      if (credentials.username === ADMIN_USERNAME && credentials.password === ADMIN_PASSWORD) {
        // Store authentication token
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminUsername', credentials.username);
        localStorage.setItem('adminLoginTime', new Date().toISOString());
        
        toast.success('Login Successful!', {
          description: 'Welcome to Admin Dashboard',
        });
        
        // Navigate to admin dashboard
        navigate('/admin/dashboard');
      } else {
        toast.error('Login Failed', {
          description: 'Invalid username or password. Please try again.',
        });
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-yellow-50 via-white to-gray-50'
    }`}>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Background Graphics */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Icons */}
        <div className={`absolute top-20 left-10 md:left-20 animate-bounce ${isDark ? 'text-yellow-500/30' : 'text-yellow-200'}`} style={{ animationDelay: '0s', animationDuration: '3s' }}>
          <Shield className="h-12 w-12 md:h-16 md:w-16" />
        </div>
        <div className={`absolute top-40 right-10 md:right-20 animate-bounce ${isDark ? 'text-yellow-500/30' : 'text-yellow-200'}`} style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}>
          <Users className="h-10 w-10 md:h-14 md:w-14" />
        </div>
        <div className={`absolute bottom-40 left-5 md:left-16 animate-bounce ${isDark ? 'text-yellow-500/30' : 'text-yellow-200'}`} style={{ animationDelay: '1s', animationDuration: '4s' }}>
          <BarChart3 className="h-14 w-14 md:h-20 md:w-20" />
        </div>
        <div className={`absolute bottom-20 right-5 md:right-16 animate-bounce ${isDark ? 'text-yellow-500/30' : 'text-yellow-200'}`} style={{ animationDelay: '1.5s', animationDuration: '3.2s' }}>
          <FileCheck className="h-12 w-12 md:h-16 md:w-16" />
        </div>
        
        {/* Decorative Circles */}
        <div className={`absolute -top-20 -right-20 w-64 h-64 md:w-96 md:h-96 rounded-full ${isDark ? 'bg-yellow-500/10' : 'bg-yellow-100 opacity-50'}`}></div>
        <div className={`absolute -bottom-20 -left-20 w-48 h-48 md:w-72 md:h-72 rounded-full ${isDark ? 'bg-yellow-500/10' : 'bg-yellow-200 opacity-40'}`}></div>
        <div className={`absolute top-1/2 left-1/4 w-32 h-32 rounded-full hidden md:block ${isDark ? 'bg-yellow-500/10' : 'bg-yellow-100 opacity-30'}`}></div>
        
        {/* Grid Pattern */}
        <div className={`absolute inset-0 ${isDark ? 'opacity-20' : ''}`} style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23EAB308' fill-opacity='0.05'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
      </div>

      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
        <div className="flex items-center space-x-2 md:space-x-3">
          <img
            src="https://static.prod-images.emergentagent.com/jobs/9e72d044-fd83-4308-bd70-6417dfaebaf8/images/725422b1dccb8b76f317695455f20615e13ed5e74c2344282911621b3474b267.png"
            alt="Edu Advisor Logo"
            className="h-10 w-10 md:h-12 md:w-12 object-contain"
          />
          <div>
            <h1 className={`text-xl md:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Edu <span className="text-yellow-500">Advisor</span>
            </h1>
            <p className={`text-xs hidden sm:block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Learn Today Earn Tomorrow</p>
          </div>
        </div>
      </div>

      <Card className={`w-full max-w-md mx-4 shadow-2xl border-2 relative z-10 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader className="text-center pb-6 md:pb-8 pt-6 md:pt-8 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-t-lg">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="h-8 w-8 md:h-10 md:w-10 text-yellow-500" />
          </div>
          <CardTitle className="text-xl md:text-2xl font-bold">Admin Portal</CardTitle>
          <p className="text-yellow-100 text-xs md:text-sm mt-2">Secure Access Required</p>
        </CardHeader>
        <CardContent className="p-4 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className={`font-semibold flex items-center gap-2 text-sm md:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <User className="h-4 w-4 text-yellow-500" />
                Admin ID
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={credentials.username}
                onChange={handleChange}
                placeholder="Enter admin ID"
                className={`focus:border-yellow-500 focus:ring-yellow-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={`font-semibold flex items-center gap-2 text-sm md:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <Lock className="h-4 w-4 text-yellow-500" />
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
                  className={`focus:border-yellow-500 focus:ring-yellow-500 pr-10 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 text-gray-900 hover:bg-yellow-600 font-semibold text-base md:text-lg py-5 md:py-6 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </div>
              ) : (
                'Login to Dashboard'
              )}
            </Button>
          </form>

          <div className={`mt-4 md:mt-6 pt-4 md:pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`rounded-lg p-3 md:p-4 ${isDark ? 'bg-blue-900/30 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
              <p className={`text-xs text-center ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                <Lock className="h-3 w-3 inline mr-1" />
                Authorized Personnel Only
              </p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className={`text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-yellow-500' : 'text-gray-600 hover:text-yellow-500'}`}
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

export default AdminLogin;
