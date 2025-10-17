import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { saveTestResult, getAllTestResults, getUserProfile } from '../utils/indexedDB';
import { Clipboard, Upload, CheckCircle, AlertCircle, FileText, Target } from 'lucide-react';

/**
 * Tests Hub - Central place to input test results
 * 
 * Supports:
 * - Pasting MBTI/Enneagram/etc results
 * - Importing CliftonStrengths/Big Five
 * - In-app tests (future)
 * - Palmistry photos (future)
 */
const TestsHubPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('paste');
  const [existingTests, setExistingTests] = useState([]);
  const [profile, setProfile] = useState(null);
  
  // Paste tab state
  const [testType, setTestType] = useState('mbti');
  const [testResults, setTestResults] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const tests = await getAllTestResults();
      const userProfile = await getUserProfile();
      setExistingTests(tests || []);
      setProfile(userProfile);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handlePasteSubmit = async (e) => {
    e.preventDefault();
    
    if (!testResults.trim()) {
      alert('Please paste your test results');
      return;
    }

    setSaving(true);
    try {
      await saveTestResult({
        testType,
        results: testResults,
        source: 'paste',
        dataType: 'text',
      });
      
      setTestResults('');
      await loadData();
      alert('Test results saved successfully!');
    } catch (error) {
      console.error('Failed to save test:', error);
      alert('Failed to save test results. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleContinue = () => {
    if (existingTests.length === 0) {
      if (window.confirm('You haven\'t added any test results yet. Continue anyway?')) {
        navigate('/synthesis');
      }
    } else {
      navigate('/synthesis');
    }
  };

  const handleSkip = () => {
    navigate('/synthesis');
  };

  const testTypeOptions = [
    { value: 'mbti', label: 'MBTI (Myers-Briggs)' },
    { value: 'enneagram', label: 'Enneagram' },
    { value: 'disc', label: 'DiSC' },
    { value: 'cliftonstrengths', label: 'CliftonStrengths (Gallup)' },
    { value: 'bigfive', label: 'Big Five' },
    { value: 'values', label: 'Schwartz Values' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Your Test Results
          </h1>
          <p className="text-gray-600 text-lg">
            Add personality test results to build your Operating Manual
          </p>
          {profile?.name && (
            <p className="text-sm text-gray-500 mt-2">
              Welcome back, {profile.name}!
            </p>
          )}
        </div>

        {/* Existing Tests Summary */}
        {existingTests.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Tests Added ({existingTests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {existingTests.map((test, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <FileText className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-green-900">
                        {test.testType.toUpperCase()}
                      </p>
                      <p className="text-xs text-green-700">
                        {new Date(test.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Add Test Results</CardTitle>
            <CardDescription>
              All data is stored locally on your device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="paste" className="flex items-center gap-2">
                  <Clipboard className="h-4 w-4" />
                  Paste Results
                </TabsTrigger>
                <TabsTrigger value="import" className="flex items-center gap-2" disabled>
                  <Upload className="h-4 w-4" />
                  Import File (Coming Soon)
                </TabsTrigger>
              </TabsList>

              {/* Paste Tab */}
              <TabsContent value="paste" className="space-y-4 mt-4">
                <form onSubmit={handlePasteSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="testType">Test Type</Label>
                    <select
                      id="testType"
                      value={testType}
                      onChange={(e) => setTestType(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {testTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="testResults">Paste Your Results</Label>
                    <Textarea
                      id="testResults"
                      value={testResults}
                      onChange={(e) => setTestResults(e.target.value)}
                      placeholder="Paste your test results here...\n\nE.g., for MBTI: 'INTJ - The Architect'\nFor CliftonStrengths: 'Strategic, Learner, Achiever, Input, Intellection'\n\nYou can paste the full report or just the key results."
                      rows={10}
                      className="resize-none mt-1"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={saving || !testResults.trim()}
                      className="flex-1"
                    >
                      {saving ? 'Saving...' : 'Save Test Result'}
                    </Button>
                  </div>
                </form>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>💡 Tip:</strong> The more test results you add, the more comprehensive your Operating Manual will be. 
                    You can add more tests anytime.
                  </p>
                </div>
              </TabsContent>

              {/* Import Tab (Coming Soon) */}
              <TabsContent value="import" className="mt-4">
                <div className="text-center py-12">
                  <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Coming Soon</h3>
                  <p className="text-gray-600">
                    File import feature will be available soon
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4 justify-between">
          <Button
            variant="outline"
            onClick={handleSkip}
          >
            Skip for Now
          </Button>
          <Button
            onClick={handleContinue}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Continue to Synthesis
          </Button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm">Evidence-Based Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-700">
                MBTI, Big Five, CliftonStrengths are marked as <strong>"Evidence-Based"</strong> in your Operating Manual
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader>
              <CardTitle className="text-sm">Esoteric Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-700">
                Enneagram, Astrology, Palmistry are marked as <strong>"Esoteric"</strong> for entertainment/reflection
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestsHubPage;