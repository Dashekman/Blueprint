import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import ApiService from '../services/api';

const PalmistryTestPage = () => {
  const testPalmistryAnalysis = async () => {
    try {
      // Create a simple test image (1x1 pixel in base64)
      const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
      
      console.log('Testing palmistry analysis...');
      
      const result = await ApiService.analyzePalmScan('test-session', testImageBase64);
      
      console.log('Palmistry analysis result:', result);
      alert('Palmistry test successful! Check console for details.');
      
    } catch (error) {
      console.error('Palmistry test failed:', error);
      alert('Palmistry test failed: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="container mx-auto py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Palmistry Debug Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              This is a debug page to test the palmistry backend API directly.
            </p>
            
            <Button onClick={testPalmistryAnalysis} className="w-full">
              Test Palmistry Analysis API
            </Button>
            
            <div className="text-sm text-gray-500">
              <p>This will:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Send a test image to the palmistry API</li>
                <li>Test the AI analysis pipeline</li>
                <li>Show results in browser console</li>
                <li>Verify the complete backend flow</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PalmistryTestPage;