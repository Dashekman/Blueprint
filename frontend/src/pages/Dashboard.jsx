import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import ConstellationPuzzleBoard from '../components/ConstellationPuzzleBoard';
import { 
  Star, 
  Crown, 
  Sparkles, 
  TrendingUp, 
  Target, 
  Brain,
  Lock,
  Unlock
} from 'lucide-react';
import { mockTests } from '../data/mock';
import { premiumTests } from '../data/premium-tests';

const Dashboard = () => {
  const navigate = useNavigate();
  const [completedTests, setCompletedTests] = useState([]);
  const [userStats, setUserStats] = useState({
    totalTests: 0,
    completedTests: 0,
    premiumTestsUnlocked: 0
  });

  useEffect(() => {
    // Load user progress from localStorage
    const completed = JSON.parse(localStorage.getItem('completedTests') || '[]');
    
    setCompletedTests(completed);
    
    const allTests = { ...mockTests, ...premiumTests };
    const totalTests = Object.keys(allTests).length;
    
    setUserStats({
      totalTests,
      completedTests: completed.length,
      premiumTestsUnlocked: totalTests // All tests are now free
    });
  }, []);

  const getNextRecommendedTest = () => {
    const allTests = { ...mockTests, ...premiumTests };
    const availableTests = Object.entries(allTests)
      .filter(([testId]) => !completedTests.includes(testId))
      .map(([testId, test]) => ({ ...test, testId }));
    
    // Prioritize core tests first
    const coreTests = availableTests.filter(test => 
      ['mbti', 'bigFive', 'values', 'enneagram'].includes(test.testId)
    );
    
    if (coreTests.length > 0) {
      return coreTests[0];
    }
    
    return availableTests[0];
  };

  const getPremiumTestsAvailable = () => {
    return Object.entries(premiumTests)
      .filter(([testId]) => !completedTests.includes(testId))
      .map(([testId, test]) => ({ ...test, testId }));
  };

  const getCompletionLevel = () => {
    const percentage = (completedTests.length / userStats.totalTests) * 100;
    
    if (percentage === 100) return { level: 'Superhuman', icon: '👑', color: 'text-yellow-600' };
    if (percentage >= 80) return { level: 'Enlightened', icon: '✨', color: 'text-purple-600' };
    if (percentage >= 60) return { level: 'Advanced', icon: '🌟', color: 'text-blue-600' };
    if (percentage >= 40) return { level: 'Developing', icon: '🚀', color: 'text-green-600' };
    if (percentage >= 20) return { level: 'Explorer', icon: '🧭', color: 'text-indigo-600' };
    return { level: 'Beginner', icon: '🌱', color: 'text-gray-600' };
  };

  const completionLevel = getCompletionLevel();
  const nextTest = getNextRecommendedTest();
  const premiumTestsAvailable = getPremiumTestsAvailable();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
      <div className="container mx-auto py-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className={`text-4xl ${completionLevel.color}`}>{completionLevel.icon}</div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Your Superhuman Dashboard
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                Level: <span className={`font-semibold ${completionLevel.color}`}>
                  {completionLevel.level}
                </span>
              </p>
            </div>
          </div>
          
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full">
            <Star className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              All tests are now free! Complete your constellation.
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{completedTests.length}</div>
              <div className="text-sm text-gray-600">Tests Completed</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {Math.round((completedTests.length / userStats.totalTests) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{userStats.totalTests}</div>
              <div className="text-sm text-gray-600">Total Available</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">All Free</div>
              <div className="text-sm text-gray-600">Account Type</div>
            </CardContent>
          </Card>
        </div>

        {/* Constellation Puzzle Board */}
        <Card className="relative overflow-hidden">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl text-gray-900 flex items-center justify-center space-x-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <span>Your Identity Constellation</span>
              <Sparkles className="w-6 h-6 text-purple-600" />
            </CardTitle>
            <p className="text-gray-600">
              Each test adds a star to your personality constellation
            </p>
          </CardHeader>
          <CardContent>
            <ConstellationPuzzleBoard 
              completedTests={completedTests}
              totalTests={userStats.totalTests}
            />
          </CardContent>
        </Card>

        {/* Next Recommended Action */}
        {nextTest && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-xl text-blue-900 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Recommended Next Step
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{nextTest.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{nextTest.description}</p>
                
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                  <span>⏱️ {nextTest.duration}</span>
                  <span>📊 {nextTest.questions?.length || 'Variable'} questions</span>
                  {nextTest.isPremium && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
              
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                onClick={() => navigate(`/test/${nextTest.testId}`)}
              >
                Take {nextTest.name} Test
                <Star className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Premium Tests Showcase */}
        {!userStats.isPremium && premiumTestsAvailable.length > 0 && (
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-xl text-purple-900 flex items-center">
                <Crown className="w-5 h-5 mr-2" />
                Unlock Premium Tests
              </CardTitle>
              <p className="text-purple-700">
                Get deeper insights with our advanced personality assessments
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {premiumTestsAvailable.slice(0, 6).map((test) => (
                  <div 
                    key={test.testId}
                    className="p-4 bg-white/60 rounded-lg border border-purple-100 relative"
                  >
                    <div className="absolute top-2 right-2">
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                    
                    <div className="text-2xl mb-2">{test.icon}</div>
                    <h4 className="font-semibold text-gray-900 text-sm">{test.name}</h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {test.subtitle}
                    </p>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      ⏱️ {test.duration}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Unlock all {Object.keys(premiumTests).length} premium tests + advanced AI insights
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/profile')}>
            <CardContent className="p-6 text-center">
              <Brain className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">View Profile</h3>
              <p className="text-sm text-gray-600">See your complete personality synthesis</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/daily')}>
            <CardContent className="p-6 text-center">
              <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Daily Insights</h3>
              <p className="text-sm text-gray-600">Get personalized daily guidance</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/palmistry')}>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">👋</div>
              <h3 className="font-semibold text-gray-900 mb-2">Palm Reading</h3>
              <p className="text-sm text-gray-600">Discover insights in your palm lines</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;