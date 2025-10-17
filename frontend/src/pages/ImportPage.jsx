import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const ImportPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Import External Results
          </h1>
          <p className="text-gray-600">Import test results from external services</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">File import and external API integration will be available here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImportPage;