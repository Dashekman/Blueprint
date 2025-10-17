import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { getUserProfile, getAllTestResults, saveSynthesis, getLatestSynthesis, getPremiumStatus } from '../utils/indexedDB';
import { Sparkles, Loader2, BookOpen, Target, Heart, Briefcase, AlertCircle, Lock } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

/**
 * Synthesis Page - AI generates the Operating Manual
 * 
 * Uses GPT-5 to analyze all user data and create:
 * - Core traits
 * - Work guidance
 * - Relationship insights
 * - Daily rituals
 * - Strengths & weaknesses
 * 
 * Includes evidence labels, attributions, confidence scores
 */
const SynthesisPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [profile, setProfile] = useState(null);
  const [tests, setTests] = useState([]);
  const [synthesis, setSynthesis] = useState(null);
  const [error, setError] = useState(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userProfile = await getUserProfile();
      const testResults = await getAllTestResults();
      const latestSynthesis = await getLatestSynthesis();
      const premiumStatus = getPremiumStatus();

      setProfile(userProfile);
      setTests(testResults || []);
      setSynthesis(latestSynthesis);
      setIsPremium(premiumStatus);
    } catch (error) {
      console.error('Failed to load data:', error);
      setError('Failed to load your data');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);

    try {
      // Call backend AI synthesis endpoint
      const response = await fetch(`${API_URL}/api/blueprint/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile,
          tests,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate synthesis');
      }

      const data = await response.json();
      
      // Save locally
      await saveSynthesis(data.synthesis);
      setSynthesis(data.synthesis);
    } catch (error) {
      console.error('Synthesis failed:', error);
      setError('Failed to generate your Operating Manual. Please try again.');
    } finally {
      setGenerating(false);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Your Operating Manual
          </h1>
          <p className="text-gray-600 text-lg">
            AI-powered synthesis of your personality and potential
          </p>
        </div>

        {/* No Data Warning */}
        {tests.length === 0 && !profile && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-900">
                <AlertCircle className="h-5 w-5" />
                No Data Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-800 mb-4">
                You haven't added any information yet. Add profile information and test results to generate your Operating Manual.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/intake')}
                >
                  Add Profile Info
                </Button>
                <Button
                  onClick={() => navigate('/tests')}
                >
                  Add Test Results
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Summary */}
        {(tests.length > 0 || profile) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Profile Information</p>
                  <p className="text-2xl font-bold text-blue-600">{profile ? '✓' : '✗'}</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-900">Test Results</p>
                  <p className="text-2xl font-bold text-green-600">{tests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generate Button */}
        {!synthesis && (tests.length > 0 || profile) && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center">
                <Sparkles className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ready to Generate</h3>
                <p className="text-gray-600 mb-6">
                  AI will analyze your data and create a comprehensive Operating Manual
                </p>
                <Button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Your Manual...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate My Operating Manual
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Synthesis Results */}
        {synthesis && (
          <div className="space-y-6">
            {/* Core Traits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-600" />
                  Core Traits
                </CardTitle>
                <CardDescription>
                  Your fundamental personality characteristics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{synthesis.coreTraits || 'Analyzing...'}</p>
                {synthesis.attributions?.coreTraits && (
                  <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-sm">
                    <p className="font-medium">Based on: {synthesis.attributions.coreTraits.join(', ')}</p>
                    <p className="text-gray-600">Confidence: {synthesis.confidence?.coreTraits || 'Medium'}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Work Guidance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Work & Career
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{synthesis.work || 'Analyzing...'}</p>
              </CardContent>
            </Card>

            {/* Daily Rituals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Daily Rituals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{synthesis.daily || 'Analyzing...'}</p>
              </CardContent>
            </Card>

            {/* Premium Upsell */}
            {!isPremium && (
              <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-yellow-600" />
                    Unlock Premium Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Get access to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                    <li>Guided meditations with AI-generated TTS audio</li>
                    <li>Personalized daily affirmations</li>
                    <li>AI Q&A coach</li>
                    <li>PDF export of your Operating Manual</li>
                    <li>Advanced relationship insights</li>
                  </ul>
                  <Button
                    onClick={() => navigate('/premium')}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  >
                    Upgrade to Premium
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/daily')}
                className="flex-1"
              >
                View Daily Guidance
              </Button>
              <Button
                onClick={() => navigate('/library')}
                className="flex-1"
              >
                Go to Library
              </Button>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <Card className="mt-8 bg-gray-50">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">
              ⚠️ <strong>Disclaimer:</strong> This app provides guidance for reflection only. 
              It is not medical, psychological, or professional advice. 
              Insights marked "Esoteric" are for entertainment purposes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SynthesisPage;