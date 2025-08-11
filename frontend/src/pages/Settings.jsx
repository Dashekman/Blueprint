import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  Settings as SettingsIcon, Download, Trash2, Globe, 
  Shield, Bell, Volume2, Palette, Database, 
  CreditCard, HelpCircle, ExternalLink, AlertTriangle 
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    language: 'en',
    notifications: true,
    darkMode: false,
    soundEnabled: true,
    analyticsEnabled: false,
    fontSize: 'medium'
  });

  const [storageStats, setStorageStats] = useState({
    testResults: 0,
    meditations: 0,
    profileData: 0
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Calculate storage usage
    const calculateStorage = () => {
      const testResults = Object.keys(localStorage).filter(key => key.startsWith('test_results_')).length;
      const completedTests = JSON.parse(localStorage.getItem('completedTests') || '[]').length;
      const profileExists = localStorage.getItem('userProfile') ? 1 : 0;
      
      setStorageStats({
        testResults,
        meditations: 3, // Mock data
        profileData: profileExists
      });
    };

    calculateStorage();
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    
    toast({
      title: "Settings updated",
      description: "Your preferences have been saved.",
    });
  };

  const exportData = () => {
    try {
      const data = {
        completedTests: JSON.parse(localStorage.getItem('completedTests') || '[]'),
        testResults: {},
        settings: settings,
        exportDate: new Date().toISOString()
      };

      // Collect all test results
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('test_results_')) {
          data.testResults[key] = JSON.parse(localStorage.getItem(key) || '{}');
        }
      });

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `personal-blueprint-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported",
        description: "Your backup file has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      });
    }
  };

  const deleteAllData = () => {
    if (window.confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      // Clear all app-related localStorage
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.startsWith('test_') || 
        key.startsWith('completed') || 
        key.startsWith('user') ||
        key.startsWith('lastCompleted')
      );
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      toast({
        title: "Data deleted",
        description: "All your personal data has been removed.",
      });
      
      // Refresh to reset the app state
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'pl', name: 'Polski' },
    { code: 'es', name: 'Español' },
    { code: 'ua', name: 'Українська' },
    { code: 'ru', name: 'Русский' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-slate-500 to-slate-700 rounded-full">
            <SettingsIcon className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Settings & Privacy
        </h1>
        <p className="text-slate-600">
          Manage your preferences and data
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <span>General Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Language</Label>
              <p className="text-sm text-slate-600">Choose your preferred language</p>
            </div>
            <Select 
              value={settings.language} 
              onValueChange={(value) => updateSetting('language', value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Font Size</Label>
              <p className="text-sm text-slate-600">Adjust text size for better readability</p>
            </div>
            <Select 
              value={settings.fontSize} 
              onValueChange={(value) => updateSetting('fontSize', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Dark Mode</Label>
              <p className="text-sm text-slate-600">Switch between light and dark theme</p>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(checked) => updateSetting('darkMode', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-emerald-600" />
            <span>Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Daily Reminders</Label>
              <p className="text-sm text-slate-600">Get notified about daily insights and routines</p>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) => updateSetting('notifications', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Sound Effects</Label>
              <p className="text-sm text-slate-600">Enable sounds for interactions and meditations</p>
            </div>
            <Switch
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-purple-600" />
            <span>Privacy & Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Anonymous Analytics</Label>
              <p className="text-sm text-slate-600">Help improve the app with anonymous usage data</p>
            </div>
            <Switch
              checked={settings.analyticsEnabled}
              onCheckedChange={(checked) => updateSetting('analyticsEnabled', checked)}
            />
          </div>

          <Separator />

          {/* Storage Stats */}
          <div className="space-y-3">
            <Label>Data Storage</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg border text-center">
                <div className="text-lg font-semibold text-slate-800">{storageStats.testResults}</div>
                <p className="text-xs text-slate-600">Test Results</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border text-center">
                <div className="text-lg font-semibold text-slate-800">{storageStats.meditations}</div>
                <p className="text-xs text-slate-600">Meditations</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border text-center">
                <div className="text-lg font-semibold text-slate-800">{storageStats.profileData}</div>
                <p className="text-xs text-slate-600">Profile Data</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={exportData} variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </Button>
            <Button onClick={deleteAllData} variant="destructive" className="flex items-center space-x-2">
              <Trash2 className="h-4 w-4" />
              <span>Delete All Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pro Features */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-amber-600" />
            <span>Pro Features</span>
            <Badge className="bg-amber-100 text-amber-800">Upgrade</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-slate-700">Unlimited personality tests</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-slate-700">Advanced AI synthesis</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-slate-700">Custom meditation generation</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-slate-700">Downloadable PDF reports</span>
            </div>
          </div>
          <Button className="w-full bg-amber-600 hover:bg-amber-700">
            Upgrade to Pro
          </Button>
        </CardContent>
      </Card>

      {/* Help & Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5 text-indigo-600" />
            <span>Help & Support</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start">
              <ExternalLink className="h-4 w-4 mr-2" />
              User Guide
            </Button>
            <Button variant="outline" className="justify-start">
              <ExternalLink className="h-4 w-4 mr-2" />
              FAQ
            </Button>
            <Button variant="outline" className="justify-start">
              <ExternalLink className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline" className="justify-start">
              <ExternalLink className="h-4 w-4 mr-2" />
              Privacy Policy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Legal Disclaimers */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 space-y-2">
              <p className="font-medium">Important Medical Disclaimer</p>
              <p>
                This application is for entertainment and self-reflection purposes only. 
                It is not a medical or psychological diagnostic tool and should not be used 
                for clinical purposes. If you are experiencing mental health concerns, 
                please consult with a qualified healthcare professional.
              </p>
              <div className="flex space-x-4 mt-3">
                <Button variant="outline" size="sm" className="text-amber-700 border-amber-300">
                  Crisis Resources
                </Button>
                <Button variant="outline" size="sm" className="text-amber-700 border-amber-300">
                  Find Help
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card className="bg-slate-50">
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-slate-600 mb-2">Personal Blueprint PWA</p>
          <p className="text-xs text-slate-500">Version 1.0.0 • Built with React</p>
          <div className="flex justify-center space-x-4 mt-3 text-xs">
            <button className="text-slate-500 hover:text-slate-700">Terms of Service</button>
            <button className="text-slate-500 hover:text-slate-700">Privacy Policy</button>
            <button className="text-slate-500 hover:text-slate-700">About</button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;