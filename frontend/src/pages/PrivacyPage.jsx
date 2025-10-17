import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Shield } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-600">
            Last updated: January 2025
          </p>
        </div>

        <Card>
          <CardContent className="p-8 prose max-w-none">
            <h2>1. Information We Collect</h2>
            <p>
              We collect the following types of information:
            </p>
            <ul>
              <li><strong>Palm Images:</strong> Photos you upload for analysis</li>
              <li><strong>Contact Information:</strong> Email address when you contact us</li>
              <li><strong>Payment Information:</strong> Processed securely through our payment provider</li>
              <li><strong>Usage Data:</strong> How you interact with our service</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>
              We use your information to:
            </p>
            <ul>
              <li>Provide palm reading analysis services</li>
              <li>Process payments for premium features</li>
              <li>Respond to customer support inquiries</li>
              <li>Improve our AI analysis capabilities</li>
              <li>Send important service updates (only when necessary)</li>
            </ul>

            <h2>3. Palm Image Processing</h2>
            <p>
              Your privacy is important to us:
            </p>
            <ul>
              <li>Palm images are processed immediately upon upload</li>
              <li>Images are not permanently stored on our servers</li>
              <li>Analysis data may be temporarily cached for performance</li>
              <li>We do not use your images to train our AI models</li>
              <li>Images are automatically deleted after processing</li>
            </ul>

            <h2>4. Information Sharing</h2>
            <p>
              We do not sell, trade, or share your personal information with third parties, except:
            </p>
            <ul>
              <li>With payment processors for transaction processing</li>
              <li>When required by law or legal process</li>
              <li>To protect our rights and safety</li>
            </ul>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate security measures including:
            </p>
            <ul>
              <li>SSL encryption for data transmission</li>
              <li>Secure servers with access controls</li>
              <li>Regular security audits and updates</li>
              <li>Industry-standard security practices</li>
            </ul>

            <h2>6. Cookies and Tracking</h2>
            <p>
              We use minimal tracking technologies:
            </p>
            <ul>
              <li>Essential cookies for service functionality</li>
              <li>Analytics to understand service usage</li>
              <li>No advertising or marketing cookies</li>
            </ul>

            <h2>7. Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul>
              <li>Request information about data we have collected</li>
              <li>Request deletion of your personal information</li>
              <li>Opt out of non-essential communications</li>
              <li>Contact us with privacy concerns</li>
            </ul>

            <h2>8. Children's Privacy</h2>
            <p>
              Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
            </p>

            <h2>9. International Users</h2>
            <p>
              If you are accessing our service from outside our jurisdiction, please note that your information may be transferred to and processed in our servers.
            </p>

            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>

            <h2>11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <ul>
              <li>Email: privacy@palmistry-ai.com</li>
              <li>Contact form: <a href="/contact">Contact Page</a></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPage;