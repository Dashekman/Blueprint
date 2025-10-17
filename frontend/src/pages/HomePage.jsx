import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  TrendingUp
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          {/* Hero Title */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 mx-auto shadow-lg">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Personal Blueprint AI
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-3">
              Your Personalized Operating Manual for Life
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              Combine personality tests, birth data, and AI to create a single, actionable guide 
              for work, relationships, and daily living. <strong>100% local, 100% private.</strong>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 h-14 shadow-lg"
              onClick={() => navigate('/intake')}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {hasProfile || testCount > 0 ? 'Continue Your Blueprint' : 'Start Your Blueprint'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-purple-200 text-purple-700 hover:bg-purple-50 text-lg px-8 py-4 h-14"
              asChild
            >
              <Link to="/upload">
                <Upload className="w-5 h-5 mr-2" />
                Upload Palm Photo
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>For Entertainment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Your Palm Reveals
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI analyzes the major lines and features of your palm to provide insights into different aspects of your life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Life & Health */}
            <Card className="border-green-200 bg-green-50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">Life & Health</h3>
                <p className="text-green-700 text-sm">
                  Discover insights about your vitality, health patterns, and life energy through your life line analysis.
                </p>
              </CardContent>
            </Card>

            {/* Love & Relationships */}
            <Card className="border-pink-200 bg-pink-50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-pink-900 mb-2">Love & Relationships</h3>
                <p className="text-pink-700 text-sm">
                  Understand your romantic nature, relationship patterns, and emotional tendencies through heart line reading.
                </p>
              </CardContent>
            </Card>

            {/* Career & Success */}
            <Card className="border-blue-200 bg-blue-50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Career & Success</h3>
                <p className="text-blue-700 text-sm">
                  Learn about your professional path, leadership qualities, and success potential through fate line analysis.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get your palm reading in just 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Photo</h3>
              <p className="text-gray-600">
                Take a clear photo of your palm or upload an existing image. Make sure your palm lines are clearly visible.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced AI analyzes your palm lines, mounts, and features to generate your personalized reading.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Results</h3>
              <p className="text-gray-600">
                Receive detailed insights about your personality, relationships, career, and life path in seconds.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              asChild
            >
              <Link to="/upload">
                Try It Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sample/Demo Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Try a Sample Reading
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            See what a palm reading looks like with our sample analysis
          </p>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
            asChild
          >
            <Link to="/upload?demo=true">
              <Sparkles className="w-4 h-4 mr-2" />
              View Sample Reading
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;