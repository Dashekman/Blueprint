import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { getPremiumStatus, getUserProfile, getAllTestResults } from '../utils/indexedDB';
import { 
  BookOpen,
  Sparkles, 
  Brain, 
  Heart, 
  Target, 
  Shield,
  ArrowRight,
  Check,
  Lock,
  Upload,
  Star,
  Users,
  TrendingUp,
  Zap,
  CheckCircle2
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [isPremium, setIsPremium] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [testCount, setTestCount] = useState(0);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const premium = getPremiumStatus();
      const profile = await getUserProfile();
      const tests = await getAllTestResults();
      
      setIsPremium(premium);
      setHasProfile(!!profile);
      setTestCount(tests?.length || 0);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const handleDemo = () => {
    // Pre-fill with demo data
    navigate('/intake?demo=true');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Above the Fold */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Your Personal Blueprint
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              One AI-crafted guide for your work, study, relationships, and daily flow
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-10 py-6 h-auto shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                onClick={() => navigate('/intake')}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Build My Blueprint
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-10 py-6 h-auto border-2 border-purple-300 hover:bg-purple-50 transition-all"
                onClick={handleDemo}
              >
                <Zap className="w-5 h-5 mr-2" />
                Try Demo
              </Button>
            </div>

            {/* Trust Bar */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Local-first</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="font-medium">Evidence labels</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-600" />
                <span className="font-medium">No diagnosis</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="font-medium">EN/PL</span>
              </div>
            </div>
          </div>

          {/* User Progress */}
          {(hasProfile || testCount > 0) && (
            <Card className="max-w-md mx-auto bg-white/80 backdrop-blur border-2 border-purple-200 shadow-xl">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700">Your Progress</p>
                  <p className="text-sm text-purple-600 font-medium">
                    {hasProfile && testCount > 0 ? '✨ Ready to Analyze!' : '📝 In Progress'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-xs text-blue-700 font-medium mb-1">Profile</p>
                    <p className="text-2xl font-bold text-blue-600">{hasProfile ? '✓' : '○'}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <p className="text-xs text-purple-700 font-medium mb-1">Tests</p>
                    <p className="text-2xl font-bold text-purple-600">{testCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* 3-Step Explainer */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Build your Operating Manual in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Add Your Inputs</h3>
              <p className="text-gray-600 leading-relaxed">
                Share your personality test results (MBTI, CliftonStrengths), birth data, and goals
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Synthesizes</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced AI analyzes everything and creates a unified, actionable Operating Manual
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Your Manual</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive personalized guidance for work, relationships, and daily routines
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
              onClick={() => navigate('/intake')}
            >
              Start Building Your Manual
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Removed duplicate sections - replaced with new 3-Step Explainer above */}

      {/* Premium Section */}
      {!isPremium && (
        <section className="py-16 px-4 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="container mx-auto max-w-4xl text-center">
            <Lock className="w-16 h-16 mx-auto mb-6 text-yellow-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Unlock Premium Features
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Get guided meditations, daily affirmations, AI Q&A coach, and PDF export
            </p>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg"
              onClick={() => navigate('/premium')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              View Premium Features
            </Button>
            <p className="text-sm text-gray-600 mt-4">One-time payment • Lifetime access</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;