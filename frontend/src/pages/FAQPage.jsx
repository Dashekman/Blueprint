import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { HelpCircle, MessageCircle, Mail, ArrowRight } from 'lucide-react';

const FAQPage = () => {
  const faqs = [
    {
      question: "How accurate is AI palm reading?",
      answer: "Our AI has been trained on traditional palmistry knowledge and thousands of readings. While palmistry is for entertainment, many users find our insights remarkably accurate and helpful for self-reflection."
    },
    {
      question: "Is my palm photo stored or shared?",
      answer: "No, your privacy is important to us. Palm photos are processed securely and not stored permanently on our servers. We never share your images with third parties."
    },
    {
      question: "What's the difference between free and premium readings?",
      answer: "Free readings include basic life line and heart line analysis. Premium readings provide complete analysis of all palm features, personality insights, career guidance, relationship compatibility, and a downloadable PDF report."
    },
    {
      question: "How should I take a photo of my palm?",
      answer: "Use good lighting, hold your hand flat with palm facing up, keep fingers slightly apart, and make sure palm lines are clearly visible. Fill most of the frame with your palm for best results."
    },
    {
      question: "Can I get a refund?",
      answer: "Yes, we offer a 30-day money-back guarantee for premium readings. If you're not satisfied, contact us for a full refund."
    },
    {
      question: "Is palmistry scientifically proven?",
      answer: "Palmistry is an ancient art form, not a science. Our readings are designed for entertainment and self-reflection purposes only. They should not be used for making important life decisions."
    },
    {
      question: "Can I read multiple palms?",
      answer: "Yes! You can upload and analyze as many palm photos as you'd like. Each reading is processed independently."
    },
    {
      question: "What if my palm lines aren't clear in the photo?",
      answer: "Try retaking the photo with better lighting, or try our tips for optimal photo capture. If you continue having issues, contact our support team for assistance."
    },
    {
      question: "Do you offer readings in other languages?",
      answer: "Currently, our readings are available in English only. We're working on adding more languages in the future."
    },
    {
      question: "How long does analysis take?",
      answer: "AI analysis typically takes 30-60 seconds. You'll see a progress indicator during processing, and results are displayed immediately after analysis is complete."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about Palmistry AI
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-6 mb-12">
          {faqs.map((faq, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">
                  {faq.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {faq.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-purple-900 mb-2">
              Still Have Questions?
            </h2>
            <p className="text-purple-700 mb-6">
              Can't find what you're looking for? We're here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                asChild
              >
                <Link to="/contact">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
              <Button variant="outline" className="border-purple-300 text-purple-700" asChild>
                <Link to="/upload">
                  Try Palmistry AI
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQPage;