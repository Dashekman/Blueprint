import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { getUserProfile, saveUserProfile } from '../utils/indexedDB';
import { Calendar, MapPin, Clock, Target, BookOpen } from 'lucide-react';

/**
 * Intake Wizard - Collects basic user information for profile synthesis
 * 
 * Gathers:
 * - Name (optional)
 * - Birth data (date, time, city, timezone) - optional
 * - Personal goals
 * - Custom notes
 */
const IntakePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthCity: '',
    birthTimezone: '',
    goals: '',
    notes: '',
  });

  useEffect(() => {
    loadExistingProfile();
  }, []);

  const loadExistingProfile = async () => {
    try {
      const profile = await getUserProfile();
      if (profile) {
        setFormData({
          name: profile.name || '',
          birthDate: profile.birthDate || '',
          birthTime: profile.birthTime || '',
          birthCity: profile.birthCity || '',
          birthTimezone: profile.birthTimezone || '',
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSkip = () => {
    navigate('/tests');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome to Personal Blueprint AI
          </h1>
          <p className="text-gray-600 text-lg">
            Let's start building your personalized Operating Manual
          </p>
          <p className="text-sm text-gray-500 mt-2">
            All information is stored locally on your device. Nothing is sent to servers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Optional - helps personalize your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="What should we call you?"
                  className="mt-1"
                />
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
                Optional - Used for astrological insights (marked as "esoteric")
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
                  <Label htmlFor="birthTime">Birth Time</Label>
                  <Input
                    id="birthTime"
                    name="birthTime"
                    type="time"
                    value={formData.birthTime}
                    onChange={handleChange}
                    className="mt-1"
                  />
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
                    placeholder="e.g., Warsaw, London"
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
                    placeholder="e.g., Europe/Warsaw"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Your Goals
              </CardTitle>
              <CardDescription>
                What do you want to achieve? What are you working towards?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                placeholder="E.g., Improve work-life balance, develop better habits, understand my personality better..."
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Custom Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
              <CardDescription>
                Any other information you'd like to include
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Anything else you'd like to share about yourself..."
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              disabled={saving}
            >
              Skip for Now
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {saving ? 'Saving...' : 'Continue to Tests'}
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