import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Crown, Check, Star, Heart, TrendingUp, Users, ArrowRight } from 'lucide-react';

const PremiumPage = () => {
  const features = {
    free: [
      'Basic life line reading',
      'Basic heart line reading', 
      'General personality summary',
      'Confidence score'
    ],
    premium: [
      'Complete palm analysis (all major lines)',
      'Deep personality insights',
      'Career path & success predictions',
      'Relationship compatibility analysis',
      'Health & wellness indicators',
      'Life timeline & key events',
      'Lucky numbers & compatible signs',
      'Downloadable PDF report',
      'Share your reading',
      'Priority customer support'
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Unlock Your Complete Palm Reading
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get the full power of AI palmistry with detailed insights into every aspect of your life.
          </p>
        </div>

        {/* Feature Comparison */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          
          {/* Free Version */}
          <Card className="border-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900">Free Reading</CardTitle>
              <div className="text-3xl font-bold text-gray-600 mt-2">$0</div>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.free.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-6" asChild>
                <Link to="/upload">Try Free Reading</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Premium Version */}
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
            <Badge className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              Most Popular
            </Badge>
            
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-purple-900 flex items-center justify-center">
                <Crown className="w-6 h-6 mr-2" />
                Premium Reading
              </CardTitle>
              <div className="text-4xl font-bold text-purple-700 mt-2">$9.99</div>
              <div className="text-sm text-purple-600">One-time payment</div>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.premium.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-800">{feature}</span>
                </div>
              ))}
              <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Crown className="w-4 h-4 mr-2" />
                Unlock Premium Reading
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Premium Features Detail */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center border-green-200 bg-green-50">
            <CardContent className="p-6">
              <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-900 mb-2">Life & Health</h3>
              <p className="text-green-700 text-sm">
                Complete analysis of your life line, health indicators, vitality patterns, and wellness recommendations.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-pink-200 bg-pink-50">
            <CardContent className="p-6">
              <Heart className="w-12 h-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-pink-900 mb-2">Love & Relationships</h3>
              <p className="text-pink-700 text-sm">
                Deep insights into your romantic nature, compatibility with others, and relationship patterns.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Career & Success</h3>
              <p className="text-blue-700 text-sm">
                Discover your professional path, leadership qualities, and potential for success and achievement.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials (mock) */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center mb-4">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />)}
              </div>
              <p className="text-gray-700 text-sm mb-3">
                "Incredibly accurate and detailed! The premium reading gave me insights I never expected."
              </p>
              <div className="text-gray-500 text-xs">Sarah M.</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center mb-4">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />)}
              </div>
              <p className="text-gray-700 text-sm mb-3">
                "The AI analysis was spot-on about my personality and career path. Worth every penny!"
              </p>
              <div className="text-gray-500 text-xs">Michael R.</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center mb-4">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />)}
              </div>
              <p className="text-gray-700 text-sm mb-3">
                "Amazing detail and beautiful presentation. The PDF report is something I'll keep forever."
              </p>
              <div className="text-gray-500 text-xs">Emma L.</div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">How accurate is the AI palm reading?</h3>
              <p className="text-gray-700 text-sm">
                Our AI has been trained on thousands of palm readings and traditional palmistry knowledge. While results are for entertainment, many users find them remarkably insightful.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Is this a one-time payment?</h3>
              <p className="text-gray-700 text-sm">
                Yes! Pay once and get your complete premium reading. No subscriptions or hidden fees.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Can I get a refund?</h3>
              <p className="text-gray-700 text-sm">
                We offer a 30-day money-back guarantee if you're not satisfied with your reading.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-4"
          >
            <Crown className="w-5 h-5 mr-2" />
            Get Your Premium Reading Now
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Secure payment • Instant access • 30-day guarantee
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;