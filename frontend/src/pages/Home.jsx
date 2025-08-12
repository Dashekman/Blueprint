import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Brain, Clock, Star, ArrowRight, CheckCircle, Calendar, Hand, Sparkles } from 'lucide-react';
import { mockTests, mockDailyContent } from '../data/mock';

const Home = () => {
  const [completedTests, setCompletedTests] = useState([]);
  const [profileProgress, setProfileProgress] = useState(0);

  useEffect(() => {
    // Load completed tests from localStorage
    const completed = JSON.parse(localStorage.getItem('completedTests') || '[]');
    setCompletedTests(completed);
    
    // Calculate profile progress
    const totalTests = Object.keys(mockTests).length;
    const progress = (completed.length / totalTests) * 100;
    setProfileProgress(progress);
  }, []);

  const availableTests = Object.entries(mockTests).map(([key, test]) => ({
    ...test,
    completed: completedTests.includes(key)
  }));

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
            Discover Your
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Personal Blueprint
            </span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Unlock your potential through comprehensive personality assessments and AI-powered insights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" className="bg-slate-900 hover:bg-slate-800" asChild>
              <Link to="#tests">
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/daily">View Today's Insights</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Profile Progress */}
      {completedTests.length > 0 && (
        <section className="mb-8">
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-emerald-600" />
                <span>Your Profile Progress</span>
              </CardTitle>
              <CardDescription>
                Complete all tests to unlock your comprehensive Personal Blueprint
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {completedTests.length} of {Object.keys(mockTests).length} tests completed
                </span>
                <span className="text-sm text-slate-600">{Math.round(profileProgress)}%</span>
              </div>
              <Progress value={profileProgress} className="w-full" />
              {profileProgress === 100 && (
                <div className="flex items-center justify-between bg-emerald-100 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="font-medium text-emerald-800">Profile Complete!</span>
                  </div>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" asChild>
                    <Link to="/profile">View Your Blueprint</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Today's Focus */}
      <section className="mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Today's Focus</CardTitle>
            <CardDescription className="text-blue-700">
              Your personalized daily guidance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-white/70 rounded-lg">
              <p className="text-slate-700 italic">
                "{mockDailyContent.horoscope}"
              </p>
            </div>
            <div className="p-4 bg-white/70 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">Today's Mantra</h4>
              <p className="text-slate-700 font-medium">
                {mockDailyContent.mantra}
              </p>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/daily">Explore Daily Insights</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Tests Catalog */}
      <section id="tests" className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Personality Assessment Catalog
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Take comprehensive tests to understand your personality, motivations, and behavioral patterns
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableTests.map((test) => (
            <Card key={test.id} className="relative group hover:shadow-lg transition-all duration-300">
              {test.completed && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-emerald-500 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {test.name}
                </CardTitle>
                <CardDescription className="text-slate-600 leading-relaxed">
                  {test.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <Clock className="h-4 w-4" />
                  <span>{test.duration}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <Brain className="h-4 w-4" />
                  <span>{test.questions?.length || 'Variable'} questions</span>
                </div>

                <Button 
                  className="w-full bg-slate-900 hover:bg-slate-800" 
                  asChild
                >
                  <Link to={`/test/${test.id}`}>
                    {test.completed ? 'Retake Test' : 'Start Test'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Palmistry Feature Section */}
      <section className="mb-8">
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full -mr-16 -mt-16 opacity-30" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200 to-pink-200 rounded-full -ml-12 -mb-12 opacity-30" />
          
          <CardHeader className="relative z-10">
            <div className="flex items-center space-x-3 mb-2">
              <Hand className="h-8 w-8 text-purple-600" />
              <CardTitle className="text-2xl text-purple-900">AI Palm Reading</CardTitle>
              <Sparkles className="h-6 w-6 text-pink-500 animate-pulse" />
            </div>
            <CardDescription className="text-purple-700 text-lg">
              Discover the secrets hidden in your palm lines with AI-powered palmistry analysis
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative z-10 space-y-4">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                <div>
                  <h4 className="font-semibold text-purple-900">Life Line Analysis</h4>
                  <p className="text-sm text-purple-700">Insights into health, vitality, and life energy</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2" />
                <div>
                  <h4 className="font-semibold text-purple-900">Heart Line Reading</h4>
                  <p className="text-sm text-purple-700">Understanding of love, emotions, and relationships</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2" />
                <div>
                  <h4 className="font-semibold text-purple-900">Head Line Insights</h4>
                  <p className="text-sm text-purple-700">Intelligence, thinking patterns, and creativity</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                <div>
                  <h4 className="font-semibold text-purple-900">Fate Line Destiny</h4>
                  <p className="text-sm text-purple-700">Career path and life purpose direction</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 rounded-lg p-4 border border-purple-100">
              <p className="text-sm text-purple-800 mb-3">
                <strong>✨ New Feature:</strong> Upload or scan your palm image and receive detailed AI-powered palmistry analysis 
                including personality traits, life predictions, and personalized guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white flex-1" 
                  asChild
                >
                  <Link to="/palmistry">
                    <Hand className="w-4 h-4 mr-2" />
                    Start Palm Reading
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-purple-300 text-purple-700 hover:bg-purple-100 flex-1"
                  asChild
                >
                  <Link to="/palmistry">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
            
            <p className="text-xs text-purple-600 italic text-center">
              * For entertainment and spiritual guidance purposes only
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Features Preview */}
      <section className="py-12 bg-gradient-to-r from-slate-900 to-slate-800 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 rounded-xl">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Unlock Your Complete Personal Blueprint
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <Brain className="h-8 w-8 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">AI Synthesis</h3>
              <p className="text-slate-300 text-sm">
                Combine all your test results into actionable insights
              </p>
            </div>
            
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <Calendar className="h-8 w-8 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Daily Guidance</h3>
              <p className="text-slate-300 text-sm">
                Personalized daily insights and meditation practices
              </p>
            </div>
            
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <Star className="h-8 w-8 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Growth Tools</h3>
              <p className="text-slate-300 text-sm">
                Targeted strategies for personal and professional development
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;