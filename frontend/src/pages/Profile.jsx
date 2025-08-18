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
  const [completedTests, setCompletedTests] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const completed = JSON.parse(localStorage.getItem('completedTests') || '[]');
    setCompletedTests(completed);
    
    if (completed.length > 0) {
      // In real app, this would trigger AI synthesis
      setProfileData(mockUnifiedProfile);
    }
    
    setIsLoading(false);
  }, []);

  const totalTests = Object.keys(mockTests).length;
  const profileProgress = (completedTests.length / totalTests) * 100;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-slate-600">Loading your profile...</p>
      </div>
    );
  }

  if (completedTests.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12 space-y-6">
        <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
          <User className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Your Personal Blueprint</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Complete personality tests to unlock your comprehensive profile with AI-powered insights and personalized guidance.
        </p>
        <Button size="lg" className="bg-slate-900 hover:bg-slate-800" asChild>
          <Link to="/">Start Your First Test</Link>
        </Button>
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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center py-8">
        <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <User className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Your Personal Blueprint
        </h1>
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
            <p className="text-sm text-emerald-800">
              {profileData?.strengths?.length || 0} key strengths identified
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-900 flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ConfidenceIndicator confidence={profileData?.confidence || 0} label="Confidence" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-purple-900 flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Tests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {completedTests.slice(0, 3).map((testId) => (
                <Badge key={testId} variant="outline" className="text-xs">
                  {mockTests[testId]?.name.split(' ')[0]}
                </Badge>
              ))}
              {completedTests.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{completedTests.length - 3}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Profile Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="work">Work</TabsTrigger>
          <TabsTrigger value="study">Study</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
          <TabsTrigger value="daily">Daily</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  <span>Key Strengths</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profileData?.strengths?.map((strength, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-700">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-orange-500" />
                  <span>Growth Areas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profileData?.challenges?.map((challenge, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-700">{challenge}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Communication Style</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed">
                {profileData?.communicationStyle}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="work" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <span>Career Guidance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed mb-4">
                {profileData?.careerGuidance}
              </p>
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900">Recommended Actions:</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Seek roles that leverage your analytical strengths</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Look for opportunities to work independently</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Consider leadership roles in your areas of expertise</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-purple-600" />
                <span>Motivation Levers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed">
                {profileData?.motivationLevers}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="study" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                <span>Learning Style</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed mb-4">
                {profileData?.studyTactics}
              </p>
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900">Study Recommendations:</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Create detailed study schedules and stick to them</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Break complex topics into logical components</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use analytical frameworks to understand concepts</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relationships" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-rose-600" />
                <span>Relationship Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed mb-4">
                {profileData?.relationshipTips}
              </p>
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900">Relationship Tips:</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Practice expressing emotions and appreciation regularly</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Make time for meaningful one-on-one conversations</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Respect others' need for social interaction</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-indigo-600" />
                <span>Daily Micro-Coaching</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <p className="text-indigo-800 font-medium mb-2">Today's Focus:</p>
                <p className="text-indigo-700 text-sm leading-relaxed">
                  {profileData?.dailyMicroCoaching}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
              <Link to="/daily">View Full Daily Guidance</Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Source Attribution */}
      <Card className="border-slate-200 bg-slate-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-slate-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-600 space-y-2">
              <p className="font-medium">Sources & Methodology</p>
              <p>
                This profile is synthesized from: {profileData?.sourceTests?.join(', ')}. 
                Confidence level: {Math.round((profileData?.confidence || 0) * 100)}%
              </p>
              <p className="text-xs text-slate-500">
                Last updated: {new Date(profileData?.lastUpdated || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      {profileProgress < 100 && (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">
              Complete Your Blueprint
            </h3>
            <p className="text-indigo-700 mb-4">
              Take {totalTests - completedTests.length} more test{totalTests - completedTests.length !== 1 ? 's' : ''} to unlock deeper insights and personalized recommendations.
            </p>
            <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
              <Link to="/">Continue Testing</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Profile;