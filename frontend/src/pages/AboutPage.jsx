import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Hand, Brain, Sparkles, ArrowRight, Shield, Heart } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
            <Hand className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How Palmistry AI Works
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the ancient art of palmistry enhanced with modern AI technology
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Your Palm</h3>
              <p className="text-gray-600 text-sm">
                Take a clear photo of your palm or upload an existing image. Our AI works best with well-lit, clear images.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-gray-600 text-sm">
                Our advanced AI analyzes your palm lines, mounts, and features using traditional palmistry knowledge.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Your Reading</h3>
              <p className="text-gray-600 text-sm">
                Receive detailed insights about your personality, relationships, career path, and life journey.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* About Palmistry */}
        <div className="prose max-w-none mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Art of Palmistry</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-700 mb-4">
                Palmistry, also known as chiromancy, is an ancient practice that has been used for thousands of years across cultures worldwide. From ancient India and China to Greece and Egypt, palm reading has been a way to gain insights into personality and life path.
              </p>
              <p className="text-gray-700 mb-4">
                The major lines in your palm - the life line, heart line, head line, and fate line - are believed to reveal different aspects of your character and potential future. Each line's length, depth, curve, and markings can provide unique insights.
              </p>
            </div>
            <div>
              <p className="text-gray-700 mb-4">
                Our AI combines traditional palmistry wisdom with modern computer vision and machine learning. We've trained our system on thousands of palm readings and classical palmistry texts to provide accurate and meaningful interpretations.
              </p>
              <p className="text-gray-700 mb-4">
                While palmistry is considered an art rather than a science, many people find value in the self-reflection and insights it provides. Our readings are designed for entertainment and personal growth.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <Shield className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-green-900 mb-2">Privacy & Security</h3>
              <p className="text-green-700 text-sm mb-4">
                Your palm images are processed securely and not stored permanently. We respect your privacy and use industry-standard security measures.
              </p>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Images processed securely</li>
                <li>• No permanent storage</li>
                <li>• Industry-standard encryption</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-6">
              <Heart className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-purple-900 mb-2">For Entertainment</h3>
              <p className="text-purple-700 text-sm mb-4">
                Our palm readings are designed for entertainment and self-reflection. They should not be used for making important life decisions.
              </p>
              <ul className="text-purple-700 text-sm space-y-1">
                <li>• Entertainment purposes only</li>
                <li>• Self-reflection and insight</li>
                <li>• Not for major life decisions</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Discover Your Palm's Secrets?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of users who have already discovered insights about themselves through AI palmistry.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            asChild
          >
            <Link to="/upload">
              <Hand className="w-5 h-5 mr-2" />
              Get Your Palm Reading
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;