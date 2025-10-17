import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { FileText } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-600 rounded-full mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Terms of Service
          </h1>
          <p className="text-gray-600">
            Last updated: January 2025
          </p>
        </div>

        <Card>
          <CardContent className="p-8 prose max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Palmistry AI, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2>2. Use of Service</h2>
            <p>
              Palmistry AI provides AI-powered palm reading analysis for entertainment purposes only. Our service is not intended for:
            </p>
            <ul>
              <li>Making important life decisions</li>
              <li>Medical, legal, or professional advice</li>
              <li>Predicting actual future events</li>
              <li>Providing scientifically proven information</li>
            </ul>

            <h2>3. User Content</h2>
            <p>
              When you upload palm images, you represent that:
            </p>
            <ul>
              <li>You own the rights to the images</li>
              <li>The images do not violate any laws or third-party rights</li>
              <li>You consent to processing of these images for palm reading analysis</li>
            </ul>

            <h2>4. Privacy and Data</h2>
            <p>
              We respect your privacy. Palm images are processed for analysis and not permanently stored. See our Privacy Policy for details.
            </p>

            <h2>5. Payment Terms</h2>
            <p>
              Premium readings require a one-time payment. All sales are final, subject to our 30-day money-back guarantee. Refunds are processed within 5-7 business days.
            </p>

            <h2>6. Disclaimer</h2>
            <p>
              PALMISTRY AI IS PROVIDED "AS IS" WITHOUT WARRANTIES. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED. PALM READINGS ARE FOR ENTERTAINMENT ONLY.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              We shall not be liable for any damages arising from use of our service, including but not limited to direct, indirect, incidental, or consequential damages.
            </p>

            <h2>8. Prohibited Uses</h2>
            <p>
              You may not:
            </p>
            <ul>
              <li>Use the service for illegal purposes</li>
              <li>Upload inappropriate or offensive content</li>
              <li>Attempt to reverse engineer our AI technology</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>

            <h2>9. Modifications</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date.
            </p>

            <h2>10. Governing Law</h2>
            <p>
              These terms are governed by the laws of the jurisdiction in which our company is established.
            </p>

            <h2>11. Contact</h2>
            <p>
              If you have questions about these Terms of Service, please contact us at support@palmistry-ai.com.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsPage;