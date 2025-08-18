import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { useToast } from '../hooks/use-toast';
import { 
  User, Brain, Briefcase, BookOpen, Users, Heart, 
  TrendingUp, Star, Download, RefreshCw, AlertCircle, Mail, Lock, LogIn, UserPlus, LogOut
} from 'lucide-react';
import { mockUnifiedProfile, mockTests } from '../data/mock';
import { premiumTests } from '../data/premium-tests';

const Profile = () => {
  const { toast } = useToast();
  const [completedTests, setCompletedTests] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true); // true for login, false for signup
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const completed = JSON.parse(localStorage.getItem('completedTests') || '[]');
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    
    setCompletedTests(completed);
    setUser(userData);
    setIsLoggedIn(loginStatus);
    
    if (completed.length > 0) {
      setProfileData(mockUnifiedProfile);
    }
    
    setIsLoading(false);
  }, []);

  // Calculate total tests (including now-free premium tests)
  const allTests = { ...mockTests, ...premiumTests };
  const totalTests = Object.keys(allTests).length;
  const profileProgress = (completedTests.length / totalTests) * 100;

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!loginData.email || !loginData.password) {
        throw new Error('Please fill in all fields');
      }
      
      // Mock successful login
      const mockUser = {
        id: 'user_' + Date.now(),
        name: loginData.email.split('@')[0],
        email: loginData.email,
        created_at: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('isLoggedIn', 'true');
      setUser(mockUser);
      setIsLoggedIn(true);
      
      toast({
        title: "Login Successful!",
        description: `Welcome back, ${mockUser.name}!`
      });
      
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!signupData.name || !signupData.email || !signupData.password) {
        throw new Error('Please fill in all fields');
      }
      
      if (signupData.password !== signupData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (signupData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Mock successful signup
      const mockUser = {
        id: 'user_' + Date.now(),
        name: signupData.name,
        email: signupData.email,
        created_at: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('isLoggedIn', 'true');
      setUser(mockUser);
      setIsLoggedIn(true);
      
      toast({
        title: "Account Created!",
        description: `Welcome to Superhuman Identity Puzzle, ${mockUser.name}!`
      });
      
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    setUser(null);
    setIsLoggedIn(false);
    setLoginData({ email: '', password: '' });
    setSignupData({ name: '', email: '', password: '', confirmPassword: '' });
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
  };

  // Authentication Form Component
  const AuthenticationForm = () => (
    <div className="max-w-md mx-auto">
      <Card className="bg-white shadow-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {showLogin ? 'Sign In' : 'Create Account'}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {showLogin 
              ? 'Sign in to access your personality profile' 
              : 'Join the Superhuman Identity Puzzle community'
            }
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Tabs value={showLogin ? 'login' : 'signup'} onValueChange={(value) => setShowLogin(value === 'login')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="flex items-center space-x-2">
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center space-x-2">
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={authLoading}
                >
                  {authLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10"
                      value={signupData.name}
                      onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={signupData.email}
                      onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password (min 6 chars)"
                      className="pl-10"
                      value={signupData.password}
                      onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="Confirm your password"
                      className="pl-10"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={authLoading}
                >
                  {authLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="text-center text-sm text-gray-500">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show authentication form if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
        <div className="container mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Profile</h1>
            <p className="text-xl text-gray-600">Sign in to access your personality insights</p>
          </div>
          <AuthenticationForm />
          
          {/* Guest access info */}
          <div className="max-w-md mx-auto mt-8">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <AlertCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-900 mb-2">Continue as Guest?</h3>
                <p className="text-sm text-blue-800 mb-3">
                  You can take tests without an account, but you'll need to sign in to save your results and access your profile.
                </p>
                <Button variant="outline" asChild className="border-blue-300 text-blue-700">
                  <Link to="/">Take Tests as Guest</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show empty profile state if logged in but no tests completed
  if (completedTests.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
        <div className="container mx-auto py-8">
          {/* User Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>

          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
              <Brain className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Start Your Personality Journey</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Complete personality tests to unlock your comprehensive profile with AI-powered insights. 
              Discover your strengths, growth areas, and personalized recommendations.
            </p>
            
            <div className="bg-slate-50 rounded-lg p-6 max-w-lg mx-auto">
              <h3 className="font-semibold text-slate-900 mb-4">Available Tests ({totalTests} total)</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-indigo-600" />
                  <span>MBTI Personality</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-purple-600" />
                  <span>Big Five</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-pink-600" />
                  <span>Enneagram</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span>Values Survey</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  <span>Career Interest</span>
                </div>
                <div className="text-sm text-slate-500">+ {totalTests - 5} more tests</div>
              </div>
            </div>

            <div className="space-y-4">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800" asChild>
                <Link to="/">
                  <Brain className="mr-2 h-5 w-5" />
                  Start Taking Tests
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ConfidenceIndicator = ({ confidence, label }) => (
    <div className="flex items-center space-x-2 text-sm">
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${star <= confidence * 5 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
          />
        ))}
      </div>
      <span className="text-slate-600">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
      <div className="container mx-auto py-8 max-w-6xl">
        {/* User Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>

        {/* Profile Progress */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Personal Blueprint</h2>
          <p className="text-slate-600 mb-4">
            AI-synthesized insights from your personality assessments
          </p>
          
          {/* Progress Indicator */}
          <div className="max-w-md mx-auto mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">
                Profile Completeness
              </span>
              <span className="text-sm text-slate-600">
                {completedTests.length}/{totalTests} tests
              </span>
            </div>
            <Progress value={profileProgress} className="w-full" />
          </div>

          <div className="flex justify-center space-x-3">
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Regenerate Insights</span>
            </Button>
          </div>
        </div>

        {/* Profile Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-emerald-900 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Strengths</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {profileData?.strengths.slice(0, 3).map((strength, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm text-emerald-800">{strength}</span>
                  </div>
                )) || (
                  <p className="text-sm text-emerald-700">Complete more tests to discover your strengths</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-blue-900 flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Personality Type</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profileData ? (
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-800 mb-1">
                    {profileData.mbti_type}
                  </div>
                  <div className="text-sm text-blue-600 mb-2">
                    {profileData.mbti_description}
                  </div>
                  <ConfidenceIndicator 
                    confidence={profileData.confidence}
                    label="Confidence"
                  />
                </div>
              ) : (
                <p className="text-sm text-blue-700">Take the MBTI test to discover your type</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-purple-900 flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Growth Areas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {profileData?.growth_areas.slice(0, 3).map((area, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-purple-800">{area}</span>
                  </div>
                )) || (
                  <p className="text-sm text-purple-700">Complete more tests to identify growth areas</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Insights Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="personality">Personality</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Core Traits</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profileData ? (
                    <div className="space-y-3">
                      {profileData.core_traits.map((trait, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">{trait.name}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-slate-200 rounded-full h-2">
                              <div 
                                className="bg-indigo-600 h-2 rounded-full" 
                                style={{ width: `${trait.score}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-slate-500 w-8 text-right">
                              {trait.score}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">Complete personality tests to see your core traits</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Completed Tests</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {completedTests.length > 0 ? (
                      completedTests.map((testId, index) => {
                        const allTestsData = { ...mockTests, ...premiumTests };
                        const test = allTestsData[testId];
                        return (
                          <div key={index} className="flex items-center space-x-3 p-2 bg-slate-50 rounded-lg">
                            <div className="text-lg">{test?.icon || '📊'}</div>
                            <div>
                              <div className="text-sm font-medium">{test?.name || testId}</div>
                              <div className="text-xs text-slate-500">Completed</div>
                            </div>
                            <Badge variant="secondary" className="ml-auto">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Done
                            </Badge>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-slate-600">No tests completed yet</p>
                    )}
                  </div>
                  
                  {completedTests.length < totalTests && (
                    <div className="mt-4">
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <Link to="/">
                          <Brain className="w-4 h-4 mr-2" />
                          Take More Tests ({totalTests - completedTests.length} remaining)
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="personality" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personality Insights</CardTitle>
              </CardHeader>
              <CardContent>
                {profileData ? (
                  <div className="prose max-w-none">
                    <p className="text-slate-700">{profileData.personality_summary}</p>
                    <h4 className="text-lg font-semibold mt-4 mb-2">Key Characteristics:</h4>
                    <ul className="space-y-1">
                      {profileData.key_characteristics.map((char, index) => (
                        <li key={index} className="text-slate-600">• {char}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-slate-600">Complete personality tests to unlock detailed insights</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="career" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5" />
                  <span>Career Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profileData ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Recommended Career Paths:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {profileData.career_suggestions.map((career, index) => (
                          <div key={index} className="p-2 bg-slate-50 rounded-lg text-sm">
                            {career}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Work Style:</h4>
                      <p className="text-slate-700">{profileData.work_style}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-600">Complete career-related tests to get personalized career insights</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relationships" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Relationship Style</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profileData ? (
                  <div className="space-y-4">
                    <p className="text-slate-700">{profileData.relationship_style}</p>
                    <div>
                      <h4 className="font-semibold mb-2">Communication Preferences:</h4>
                      <ul className="space-y-1">
                        {profileData.communication_style.map((style, index) => (
                          <li key={index} className="text-slate-600">• {style}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-600">Complete personality tests to understand your relationship style</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="text-center mt-8 space-y-4">
          <div className="flex justify-center space-x-4">
            <Button asChild>
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/daily">Daily Insights</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;