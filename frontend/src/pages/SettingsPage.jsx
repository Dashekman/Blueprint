import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { clearAllData, exportAllData, getLanguage, setLanguage, getPremiumStatus } from '../utils/indexedDB';
import { Download, Trash2, Globe } from 'lucide-react';

const SettingsPage = () => {
  const [language, setLang] = React.useState('en');
  const [isPremium, setIsPremium] = React.useState(false);

  React.useEffect(() => {
    setLang(getLanguage());
    setIsPremium(getPremiumStatus());
  }, []);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setLang(newLang);
  };

  const handleExport = async () => {
    try {
      const data = await exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `personal-blueprint-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data');
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      try {
        await clearAllData();
        alert('All data cleared successfully');
        window.location.reload();
      } catch (error) {
        console.error('Clear failed:', error);
        alert('Failed to clear data');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Settings
          </h1>
          <p className="text-gray-600">Manage your preferences and data</p>
        </div>
        
        <div className="space-y-6">
          {/* Premium Status */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{isPremium ? 'Premium' : 'Free'}</p>
                  <p className="text-sm text-gray-600">
                    {isPremium ? 'You have access to all features' : 'Upgrade to unlock premium features'}
                  </p>
                </div>
                {!isPremium && (
                  <Button onClick={() => window.location.href = '/premium'}>
                    Upgrade
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Language
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  variant={language === 'en' ? 'default' : 'outline'}
                  onClick={() => handleLanguageChange('en')}
                >
                  English
                </Button>
                <Button
                  variant={language === 'pl' ? 'default' : 'outline'}
                  onClick={() => handleLanguageChange('pl')}
                >
                  Polski
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">Polish language support coming soon</p>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="w-full justify-start"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export All Data (JSON)
                </Button>
                <p className="text-sm text-gray-600 mt-2">Download a backup of all your data</p>
              </div>
              
              <div>
                <Button
                  variant="destructive"
                  onClick={handleClearData}
                  className="w-full justify-start"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All Data
                </Button>
                <p className="text-sm text-gray-600 mt-2">Permanently delete all local data</p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <p className="text-sm text-blue-900">
                🔒 <strong>Privacy:</strong> All your data is stored locally on your device. 
                We never send your personal information to any servers. You have complete control.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;