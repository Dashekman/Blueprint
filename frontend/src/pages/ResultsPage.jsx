import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Heart, 
  TrendingUp, 
  Brain, 
  Star, 
  Download, 
  Share2, 
  Sparkles,
  ArrowRight,
  Crown,
  Lock
} from 'lucide-react';

const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);
  
  const { image, isDemo, analysisComplete } = location.state || {};

  // Mock palm reading data (in real app, this would come from backend)
  const palmReading = {
    confidence: 87,
    mainType: "The Intuitive Leader",
    quickSummary: "Your palm reveals a natural leader with strong intuitive abilities and a compassionate heart.",
    
    // Free content (partial)
    lifeLineBasic: {
      title: "Life Line",
      summary: "Strong vitality and resilience",
      details: "Your life line shows good health potential and strong life energy. You have natural resilience..."
    },
    
    heartLineBasic: {
      title: "Heart Line",
      summary: "Emotional and caring nature",
      details: "Your heart line indicates a warm, emotional personality with strong capacity for love..."
    },
    
    // Premium content (locked for free users)
    premiumContent: {
      personalityDeep: "Detailed personality analysis with career recommendations, relationship compatibility, health insights, and life timeline predictions...",
      careerPath: "Your palm suggests leadership roles, creative fields, and entrepreneurial success...",
      relationships: "Strong capacity for deep relationships, loyal partner, family-oriented...",
      healthInsights: "Good overall vitality with areas to watch for stress management...",
      lifeTimeline: "Key life events and decision points mapped from your palm lines...",
      luckyNumbers: [3, 7, 12, 21, 28],
      compatibleSigns: ["Cancer", "Scorpio", "Pisces"]
    }
  };

  useEffect(() => {
    if (!image || !analysisComplete) {
      navigate('/upload');
      return;
    }
  }, [image, analysisComplete, navigate]);

  if (!image) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Your Palm Reading
          </h1>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Badge className="bg-green-100 text-green-800">
              {palmReading.confidence}% Confidence
            </Badge>
            {isDemo && (
              <Badge variant="outline" className="border-blue-200 text-blue-700">
                Sample Reading
              </Badge>
            )}
          </div>
          <p className="text-lg text-gray-600">
            {palmReading.mainType}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Palm Image */}
          <Card>
            <CardHeader>
              <CardTitle>Your Palm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden relative">
                <img 
                  src={image} 
                  alt="Your palm" 
                  className="w-full h-full object-cover"
                />
                {/* Overlay with line indicators (this would be enhanced with actual line detection) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent flex items-end p-4">
                  <div className="text-white text-sm">
                    <div className="flex items-center space-x-1 mb-1">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span>Life Line</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      <span>Heart Line</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reading Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                Reading Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {palmReading.quickSummary}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <div className="text-sm font-medium text-purple-900">Life Energy</div>
                  <div className="text-xs text-purple-700">Strong</div>
                </div>
                <div className="text-center p-3 bg-pink-50 rounded-lg">
                  <Heart className="w-6 h-6 text-pink-600 mx-auto mb-1" />
                  <div className="text-sm font-medium text-pink-900">Emotional</div>
                  <div className="text-xs text-pink-700">Caring</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Free Reading Content */}
        <div className="mt-8 space-y-6">
          
          {/* Life Line */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                {palmReading.lifeLineBasic.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{palmReading.lifeLineBasic.details}</p>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border-l-4 border-green-500">
                <div className="font-medium text-gray-900">Key Insight:</div>
                <div className="text-gray-600 text-sm">{palmReading.lifeLineBasic.summary}</div>
              </div>
            </CardContent>
          </Card>

          {/* Heart Line */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
                {palmReading.heartLineBasic.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{palmReading.heartLineBasic.details}</p>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border-l-4 border-pink-500">
                <div className="font-medium text-gray-900">Key Insight:</div>
                <div className="text-gray-600 text-sm">{palmReading.heartLineBasic.summary}</div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Upsell */}
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/50 to-pink-200/50 rounded-full -mr-16 -mt-16" />
            
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="w-5 h-5 text-purple-600 mr-2" />
                Unlock Your Complete Reading
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <p className="text-purple-800">
                Get your full palm analysis with detailed insights into your personality, career path, relationships, and life timeline.
              </p>
              
              {/* Premium features preview */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-purple-700">
                    <Lock className="w-4 h-4 mr-2" />
                    Deep Personality Analysis
                  </div>
                  <div className="flex items-center text-sm text-purple-700">
                    <Lock className="w-4 h-4 mr-2" />
                    Career & Success Path
                  </div>
                  <div className="flex items-center text-sm text-purple-700">
                    <Lock className="w-4 h-4 mr-2" />
                    Relationship Compatibility
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-purple-700">
                    <Lock className="w-4 h-4 mr-2" />
                    Health & Wellness Insights
                  </div>
                  <div className="flex items-center text-sm text-purple-700">
                    <Lock className="w-4 h-4 mr-2" />
                    Life Timeline & Predictions
                  </div>
                  <div className="flex items-center text-sm text-purple-700">
                    <Lock className="w-4 h-4 mr-2" />
                    Lucky Numbers & Signs
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex-1"
                  asChild
                >
                  <Link to="/premium">
                    <Crown className="w-4 h-4 mr-2" />
                    Unlock Full Reading - $9.99
                  </Link>
                </Button>
                <Button variant="outline" className="border-purple-300 text-purple-700">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Reading
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="outline" className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button 
              onClick={() => navigate('/upload')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Read Another Palm
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <p className="text-xs text-gray-500">
            This reading is for entertainment purposes only and should not be used for making important life decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;