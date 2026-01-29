import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-gray-50">
      <div className="absolute top-8 left-8">
        <div className="flex items-center space-x-3">
          <img
            src="https://static.prod-images.emergentagent.com/jobs/9e72d044-fd83-4308-bd70-6417dfaebaf8/images/725422b1dccb8b76f317695455f20615e13ed5e74c2344282911621b3474b267.png"
            alt="Edu Advisor Logo"
            className="h-12 w-12 object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Edu <span className="text-yellow-500">Advisor</span>
            </h1>
            <p className="text-xs text-gray-600">Learn Today Earn Tomorrow</p>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-2 border-gray-200">
        <CardHeader className="text-center pb-8 pt-8 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-t-lg">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="h-10 w-10 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
          <p className="text-yellow-100 text-sm mt-2">Secure Access Required</p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-900 font-semibold flex items-center gap-2">
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
                className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-900 font-semibold flex items-center gap-2">
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
                  className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 pr-10"
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
              className="w-full bg-yellow-500 text-gray-900 hover:bg-yellow-600 font-semibold text-lg py-6 disabled:opacity-50"
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

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-800 text-center">
                <Lock className="h-3 w-3 inline mr-1" />
                Authorized Personnel Only
              </p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-yellow-500 transition-colors"
            >
              ← Back to Website
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="absolute bottom-4 text-center w-full">
        <p className="text-sm text-gray-500">© 2026 Edu Advisor. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AdminLogin;
