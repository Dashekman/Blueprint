import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hand, Sparkles, ArrowLeft, Eye, Heart, Brain, Star, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import PalmistryCameraComponent from '../components/PalmistryCameraComponent';
import { useToast } from '../hooks/use-toast';
import ApiService from '../services/api';

const PalmistryPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState('intro'); // 'intro', 'scan', 'analyzing', 'results'
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userSession] = useState(() => localStorage.getItem('userSession') || 'anonymous_' + Date.now());

  // Initialize user session
  useEffect(() => {
    if (!localStorage.getItem('userSession')) {
      localStorage.setItem('userSession', userSession);
    }
  }, [userSession]);

  const handleImageCapture = (imageData) => {
    setCapturedImage(imageData);
  };

  const handleAnalysisStart = async (imageData) => {
    setIsAnalyzing(true);
    setCurrentStep('analyzing');

    try {
      const response = await ApiService.analyzePalmScan(userSession, imageData);
      
      if (response.success && response.analysis) {
        setAnalysisResult(response.analysis);
        setCurrentStep('results');
        toast({
          title: "Palm Analysis Complete!",
          description: "Your detailed palm reading is ready.",
        });
      } else {
        throw new Error(response.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('Palm analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "There was an error analyzing your palm. Please try again.",
        variant: "destructive"
      });
      setCurrentStep('scan');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderIntroStep = () => (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      <div className="relative">
        <div className="absolute -top-2 -left-2 w-8 h-8 bg-purple-200 rounded-full animate-pulse" />
        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-200 rounded-full animate-pulse delay-300" />
        <Hand className="w-24 h-24 text-purple-600 mx-auto mb-4" />
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Palm Reading
        <Sparkles className="w-8 h-8 text-yellow-500 inline-block ml-2" />
      </h1>
      
      <p className="text-lg text-gray-600 mb-6 max-w-xl mx-auto">
        Discover the secrets hidden in your palm lines. Get AI-powered insights into your 
        personality, relationships, career path, and life journey through ancient palmistry wisdom.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Eye className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-purple-900">Life Line Analysis</h3>
            <p className="text-sm text-purple-700">Health, vitality, and life energy insights</p>
          </CardContent>
        </Card>
        
        <Card className="border-pink-200 bg-pink-50">
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 text-pink-600 mx-auto mb-2" />
            <h3 className="font-semibold text-pink-900">Heart Line Reading</h3>
            <p className="text-sm text-pink-700">Love, emotions, and relationships</p>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-blue-900">Head Line Insights</h3>
            <p className="text-sm text-blue-700">Intelligence, thinking patterns, creativity</p>
          </CardContent>
        </Card>
        
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-semibold text-yellow-900">Fate Line Destiny</h3>
            <p className="text-sm text-yellow-700">Career path and life purpose</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Button 
          onClick={() => setCurrentStep('scan')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
        >
          <Hand className="w-5 h-5 mr-2" />
          Start Palm Scan
        </Button>
        
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          * Palmistry is for entertainment and spiritual guidance. Results should not be used for important life decisions.
        </p>
      </div>
    </div>
  );

  const renderScanStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Capture Your Palm</h2>
        <p className="text-gray-600">
          Position your palm clearly in the camera frame for the most accurate reading.
        </p>
      </div>
      
      <PalmistryCameraComponent
        onImageCapture={handleImageCapture}
        onAnalysisComplete={handleAnalysisStart}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );

  const renderAnalyzingStep = () => (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className="relative">
        <Hand className="w-32 h-32 text-purple-300 mx-auto mb-4" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900">Analyzing Your Palm...</h2>
      <p className="text-gray-600">
        Our AI palmist is examining your palm lines, mounts, and hand shape to provide detailed insights.
      </p>
      
      <div className="space-y-2">
        <Progress value={33} className="h-2" />
        <div className="text-sm text-gray-500 space-y-1">
          <div>✓ Image processed and validated</div>
          <div className="flex items-center">
            <Loader2 className="w-3 h-3 animate-spin mr-2" />
            Analyzing palm lines and features...
          </div>
        </div>
      </div>
    </div>
  );

  const renderResultsStep = () => {
    if (!analysisResult) return null;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Palm Reading</h2>
          <Badge variant="secondary" className="text-sm">
            Confidence: {Math.round((analysisResult.confidence || 0.75) * 100)}%
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Life Line */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                Life Line
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-3">{analysisResult.life_line?.meaning}</p>
              <div className="text-sm space-y-1">
                <p><strong>Length:</strong> {analysisResult.life_line?.length}</p>
                <p><strong>Depth:</strong> {analysisResult.life_line?.depth}</p>
                {analysisResult.life_line?.health_indicators && (
                  <div>
                    <strong>Health Indicators:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {analysisResult.life_line.health_indicators.map((indicator, idx) => (
                        <li key={idx} className="text-gray-600">{indicator}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Heart Line */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-3 h-3 bg-pink-500 rounded-full mr-2" />
                Heart Line
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-3">{analysisResult.heart_line?.meaning}</p>
              <div className="text-sm space-y-1">
                <p><strong>Curve:</strong> {analysisResult.heart_line?.curve}</p>
                <p><strong>Ending:</strong> {analysisResult.heart_line?.ending}</p>
                {analysisResult.heart_line?.relationship_traits && (
                  <div>
                    <strong>Relationship Traits:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {analysisResult.heart_line.relationship_traits.map((trait, idx) => (
                        <li key={idx} className="text-gray-600">{trait}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Head Line */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                Head Line
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-3">{analysisResult.head_line?.meaning}</p>
              <div className="text-sm space-y-1">
                <p><strong>Length:</strong> {analysisResult.head_line?.length}</p>
                <p><strong>Slope:</strong> {analysisResult.head_line?.slope}</p>
                {analysisResult.head_line?.cognitive_traits && (
                  <div>
                    <strong>Cognitive Traits:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {analysisResult.head_line.cognitive_traits.map((trait, idx) => (
                        <li key={idx} className="text-gray-600">{trait}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Fate Line */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                Fate Line
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-3">{analysisResult.fate_line?.meaning}</p>
              <div className="text-sm space-y-1">
                <p><strong>Presence:</strong> {analysisResult.fate_line?.presence}</p>
                <p><strong>Start Point:</strong> {analysisResult.fate_line?.start_point}</p>
                {analysisResult.fate_line?.career_indicators && (
                  <div>
                    <strong>Career Indicators:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {analysisResult.fate_line.career_indicators.map((indicator, idx) => (
                        <li key={idx} className="text-gray-600">{indicator}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personality Traits */}
        {analysisResult.personality_traits && (
          <Card>
            <CardHeader>
              <CardTitle>Personality Traits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysisResult.personality_traits.map((trait, idx) => (
                  <li key={idx} className="flex items-start">
                    <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{trait}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Life Predictions */}
        {analysisResult.life_predictions && (
          <Card>
            <CardHeader>
              <CardTitle>Life Guidance & Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysisResult.life_predictions.map((prediction, idx) => (
                  <li key={idx} className="flex items-start">
                    <Star className="w-4 h-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{prediction}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <div className="text-center space-y-4 pt-6">
          <Button 
            onClick={() => {
              setCurrentStep('intro');
              setCapturedImage(null);
              setAnalysisResult(null);
            }}
            variant="outline"
            className="mr-4"
          >
            Read Another Palm
          </Button>
          
          <Button onClick={() => navigate('/profile')}>
            View Full Profile
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Step Content */}
        <div className="min-h-[600px] flex items-center justify-center">
          {currentStep === 'intro' && renderIntroStep()}
          {currentStep === 'scan' && renderScanStep()}
          {currentStep === 'analyzing' && renderAnalyzingStep()}
          {currentStep === 'results' && renderResultsStep()}
        </div>
      </div>
    </div>
  );
};

export default PalmistryPage;