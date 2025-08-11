import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { ArrowLeft, ArrowRight, Brain, TrendingUp, Users, Briefcase, BookOpen, Heart } from 'lucide-react';
import { mockTests, mockResults } from '../data/mock';

const TestResults = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [test, setTest] = useState(null);

  useEffect(() => {
    const testData = mockTests[testId];
    const savedResults = localStorage.getItem(`test_results_${testId}`);
    
    if (!testData || !savedResults) {
      navigate('/');
      return;
    }

    setTest(testData);
    
    const { score } = JSON.parse(savedResults);
    const resultData = mockResults[testId]?.[score.type];
    
    if (resultData) {
      setResult({ ...resultData, score });
    }
  }, [testId, navigate]);

  if (!result || !test) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-slate-600">Analyzing your results...</p>
      </div>
    );
  }

  const getResultIcon = () => {
    switch (testId) {
      case 'mbti':
        return <Brain className="h-8 w-8 text-indigo-600" />;
      case 'enneagram':
        return <Heart className="h-8 w-8 text-rose-600" />;
      case 'disc':
        return <TrendingUp className="h-8 w-8 text-emerald-600" />;
      case 'humanDesign':
        return <Users className="h-8 w-8 text-purple-600" />;
      default:
        return <Brain className="h-8 w-8 text-slate-600" />;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'bg-emerald-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <Button className="bg-slate-900 hover:bg-slate-800" asChild>
          <Link to="/profile">
            View Full Profile
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>

      {/* Main Result Card */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="pb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
              {getResultIcon()}
            </div>
            <div className="flex-1">
              <CardTitle className="text-3xl text-slate-900 mb-2">
                {result.name || `Type ${result.type}`}
              </CardTitle>
              <p className="text-lg text-slate-600 leading-relaxed">
                {result.description}
              </p>
            </div>
          </div>
          
          {/* Confidence Score */}
          <div className="mt-6 p-4 bg-white rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Confidence Level</span>
              <span className="text-sm text-slate-600">{Math.round(result.confidence * 100)}%</span>
            </div>
            <Progress 
              value={result.confidence * 100} 
              className={`w-full h-2 ${getConfidenceColor(result.confidence)}`}
            />
            <p className="text-xs text-slate-500 mt-2">
              Based on {result.source}
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Detailed Results */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <span>Key Strengths</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.strengths?.map((strength, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-700">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Challenges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-orange-500" />
              <span>Growth Areas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.challenges?.map((challenge, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-700">{challenge}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Career Suggestions */}
        {result.careerSuggestions && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <span>Career Paths</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.careerSuggestions.map((career, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {career}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Communication Style */}
        {result.communicationStyle && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span>Communication Style</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed">
                {result.communicationStyle}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Relationships */}
        {result.relationships && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-rose-600" />
                <span>Relationships & Interactions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed">
                {result.relationships}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Enneagram Specific */}
        {testId === 'enneagram' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Core Motivation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">{result.coreMotivation}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Basic Fear & Desire</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-slate-900 mb-1">Fear:</h4>
                  <p className="text-slate-700 text-sm">{result.basicFear}</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-1">Desire:</h4>
                  <p className="text-slate-700 text-sm">{result.basicDesire}</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Human Design Specific */}
        {testId === 'humanDesign' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Strategy & Authority</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-slate-900 mb-1">Strategy:</h4>
                  <p className="text-slate-700 text-sm">{result.strategy}</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-1">Authority:</h4>
                  <p className="text-slate-700 text-sm">{result.authority}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Life Theme</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">{result.lifeTheme}</p>
                <Badge className="mt-2 bg-amber-100 text-amber-800" variant="outline">
                  Entertainment/Spiritual Guidance
                </Badge>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* What's Next */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-900">What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-indigo-800">
            This is just one piece of your personality puzzle. Complete more tests to unlock your comprehensive Personal Blueprint with AI-powered synthesis.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
              <Link to="/">Take More Tests</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/profile">View Current Profile</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-amber-500 rounded-full flex-shrink-0 mt-0.5"></div>
            <div className="text-sm text-amber-800 space-y-2">
              <p className="font-medium">Important Disclaimer</p>
              <p>
                This assessment is for entertainment and self-reflection purposes only. It is not a clinical tool and should not be used for diagnosis or treatment of any condition. 
                {testId === 'humanDesign' && ' Human Design is considered spiritual/entertainment guidance and not scientifically validated.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestResults;