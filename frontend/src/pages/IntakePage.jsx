import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { getUserProfile, saveUserProfile } from '../utils/indexedDB';
import { Calendar, MapPin, Clock, Target, BookOpen, Save, ArrowRight, Info } from 'lucide-react';

/**
 * Intake Wizard - Collects basic user information for profile synthesis
 * 
 * Improvements:
 * - Progress indicator
 * - Smart defaults and toggles
 * - Auto-save
 * - Demo mode support
 * - Better microcopy with examples
 */
const IntakePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get('demo') === 'true';
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthCity: '',
    birthTimezone: '',
    birthTimeUnknown: false,
    goals: '',
    notes: '',
  });

  useEffect(() => {
    loadExistingProfile();
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.name || formData.goals) {
        handleAutoSave();
      }
    }, 30000);
    return () => clearTimeout(timer);
  }, [formData]);

  const loadExistingProfile = async () => {
    try {
      const profile = await getUserProfile();
      
      if (isDemo) {
        // Load demo data
        setFormData({
          name: 'Alex Johnson',
          birthDate: '1990-06-15',
          birthTime: '14:30',
          birthCity: 'San Francisco',
          birthTimezone: 'America/Los_Angeles',
          birthTimeUnknown: false,
          goals: 'Improve work-life balance, develop better focus habits, understand my communication style',
          notes: 'I work in tech, enjoy reading and hiking, and want to better understand my strengths.',
        });
      } else if (profile) {
        setFormData({
          name: profile.name || '',
          birthDate: profile.birthDate || '',
          birthTime: profile.birthTime || '',
          birthCity: profile.birthCity || '',
          birthTimezone: profile.birthTimezone || '',
          birthTimeUnknown: profile.birthTimeUnknown || false,
          goals: profile.goals || '',
          notes: profile.notes || '',
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSave = async () => {
    try {
      await saveUserProfile(formData);
      setAutoSaved(true);
      setTimeout(() => setAutoSaved(false), 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    setAutoSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await saveUserProfile(formData);
      navigate('/tests');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndExit = async () => {
    try {
      await saveUserProfile(formData);
      navigate('/');
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const currentStep = 1;
  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-gray-600">Step {currentStep} of {totalSteps}</p>
              <h1 className="text-3xl font-bold text-gray-900">Tell Us About You</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveAndExit}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save & Exit
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {autoSaved && (
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <Save className="h-3 w-3" />
              Auto-saved
            </p>
          )}
        </div>

        {isDemo && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <p className="text-sm text-blue-900">
                <strong>👋 Demo Mode:</strong> We've pre-filled this form with sample data so you can see how it works. Feel free to edit or continue as-is!
              </p>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Help us personalize your experience (all optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">What should we call you?</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Alex, Sam, Taylor..."
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Just your first name is fine</p>
              </div>
            </CardContent>
          </Card>

          {/* Birth Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Birth Information
              </CardTitle>
              <CardDescription>
                Used for astrological insights (marked as "esoteric")
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="birthDate">Birth Date</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="birthTime" className="flex items-center gap-2">
                    Birth Time
                    {formData.birthTimeUnknown && (
                      <span className="text-xs text-yellow-600">(Unknown - confidence ↓)</span>
                    )}
                  </Label>
                  <Input
                    id="birthTime"
                    name="birthTime"
                    type="time"
                    value={formData.birthTime}
                    onChange={handleChange}
                    disabled={formData.birthTimeUnknown}
                    className="mt-1"
                  />
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="birthTimeUnknown"
                      name="birthTimeUnknown"
                      checked={formData.birthTimeUnknown}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor="birthTimeUnknown" className="text-sm text-gray-600">
                      I don't know my birth time
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="birthCity">Birth City</Label>
                  <Input
                    id="birthCity"
                    name="birthCity"
                    value={formData.birthCity}
                    onChange={handleChange}
                    placeholder="e.g., New York, London, Tokyo"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="birthTimezone">Timezone</Label>
                  <Input
                    id="birthTimezone"
                    name="birthTimezone"
                    value={formData.birthTimezone}
                    onChange={handleChange}
                    placeholder="e.g., America/New_York"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    <a href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Find your timezone
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-900">
                  Birth data helps with astrological insights. If unknown, we'll work with what you provide and mark confidence accordingly.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Your Goals & Priorities
              </CardTitle>
              <CardDescription>
                Pick up to 3 priorities—what matters most to you right now?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                placeholder="Examples:&#10;• Career clarity and finding my ideal role&#10;• Improve focus and productivity&#10;• Better work-life balance&#10;• Understand my communication style&#10;• Strengthen relationships"
                rows={5}
                className="resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                1-2 sentences per priority is perfect
              </p>
            </CardContent>
          </Card>

          {/* Custom Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Anything Else?</CardTitle>
              <CardDescription>
                Share anything that helps us understand you better
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Examples:&#10;• I'm an introvert who recharges alone&#10;• I work best in the morning&#10;• I'm changing careers from X to Y&#10;• I have ADHD and need structure"
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
            >
              {saving ? 'Saving...' : 'Continue to Tests'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Privacy Notice */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            🔒 <strong>Privacy First:</strong> All your data is stored locally on your device using IndexedDB. 
            We never send your personal information to any servers. You have complete control over your data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntakePage;