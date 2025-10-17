import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { getPremiumStatus, checkPremiumFromURL } from '../utils/indexedDB';
import { Check, Sparkles, Lock, Download, MessageSquare, BookOpen, Music } from 'lucide-react';

/**
 * Premium Page - Stripe Payment Link Integration
 * 
 * User clicks "Unlock Premium"
 * → Redirected to Stripe Payment Link
 * → After payment, Stripe redirects back with ?pro=1
 * → App detects ?pro=1 and sets localStorage.setItem('pro', '1')
 * → Premium features unlocked locally
 */
const PremiumPage = () => {
  const navigate = useNavigate();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for premium status from URL parameter or localStorage
    const premiumStatus = checkPremiumFromURL();
    setIsPremium(premiumStatus);
    setLoading(false);
  }, []);

  // Replace this with your actual Stripe Payment Link
  const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/test_PLACEHOLDER_LINK';
  
  // For demo/testing, add current domain as return URL
  const returnURL = `${window.location.origin}/?pro=1`;

  const handleUpgrade = () => {
    // Redirect to Stripe Payment Link with return URL
    window.location.href = `${STRIPE_PAYMENT_LINK}?client_reference_id=${Date.now()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              You're Premium!
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              You now have access to all premium features
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/synthesis')}>
                View Your Operating Manual
              </Button>
              <Button variant="outline" onClick={() => navigate('/daily')}>
                Explore Daily Features
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: <Music className="h-6 w-6" />,
      title: 'Guided Meditations',
      description: 'AI-generated meditation audio with TTS in English and Polish',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: 'Daily Affirmations',
      description: 'Personalized affirmations based on your Operating Manual',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: 'AI Q&A Coach',
      description: 'Ask questions and get guidance based on your profile',
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: 'PDF Export',
      description: 'Download your complete Operating Manual as PDF',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: 'Advanced Insights',
      description: 'Deeper relationship guidance and career analysis',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: 'Full Access',
      description: 'All current and future premium features',
      color: 'from-pink-500 to-rose-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="text-6xl">✨</div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Upgrade to Premium
          </h1>
          <p className="text-gray-600 text-xl mb-2">
            Unlock the full power of your Operating Manual
          </p>
          <p className="text-gray-500">
            One-time payment • Lifetime access • No subscription
          </p>
        </div>

        {/* Pricing Card */}
        <Card className="max-w-2xl mx-auto mb-12 border-2 border-purple-200 shadow-2xl">
          <CardHeader className="text-center pb-8 pt-8">
            <CardTitle className="text-3xl mb-2">Personal Blueprint Premium</CardTitle>
            <CardDescription className="text-lg">
              Everything you need for personal growth
            </CardDescription>
            <div className="mt-6">
              <span className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                $19.99
              </span>
              <span className="text-gray-600 text-xl ml-2">one-time</span>
            </div>
          </CardHeader>
          <CardContent className="pb-8">
            <Button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-lg py-6"
              size="lg"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Unlock Premium Now
            </Button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Secure payment via Stripe • Instant access
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-purple-300 transition-all">
              <CardHeader>
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} text-white mb-3`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle>Why Go Premium?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <p className="font-medium">No Subscription</p>
                  <p className="text-sm text-gray-600">One-time payment, lifetime access</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <p className="font-medium">Privacy First</p>
                  <p className="text-sm text-gray-600">All data stays on your device</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <p className="font-medium">Instant Access</p>
                  <p className="text-sm text-gray-600">Features unlock immediately after payment</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <p className="font-medium">Future Updates</p>
                  <p className="text-sm text-gray-600">All new premium features included</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How does payment work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We use Stripe for secure payment processing. Click "Unlock Premium" to be redirected to a secure payment page. 
                  After payment, you'll be redirected back and premium features will be unlocked instantly.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is my data safe?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes! All your personal data is stored locally on your device using IndexedDB. 
                  We never send your test results or profile information to any servers. Premium status is stored locally too.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I use it on multiple devices?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Since data is stored locally, each device maintains its own data. 
                  You can export your data from Settings and import it on another device.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;