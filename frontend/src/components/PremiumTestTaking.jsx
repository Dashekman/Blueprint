import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Brain, 
  Crown,
  CheckCircle,
  Star,
  Sparkles
} from 'lucide-react';
import { premiumTests } from '../data/premium-tests';
import { mockTests } from '../data/mock';

const PremiumTestTaking = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  const [currentTest, setCurrentTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeStarted, setTimeStarted] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    // Find test in both premium and free tests
    const allTests = { ...mockTests, ...premiumTests };
    const test = allTests[testId];
    
    if (!test) {
      navigate('/dashboard');
      return;
    }
    
    setCurrentTest(test);
  }, [testId, navigate]);

  useEffect(() => {
    if (currentTest && !timeStarted && !showInstructions) {
      setTimeStarted(new Date());
    }
  }, [currentTest, showInstructions]);

  if (!currentTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = currentTest.questions[currentQuestionIndex];
  const totalQuestions = currentTest.questions.length;
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Calculate time taken
    const timeCompleted = new Date();
    const timeTaken = Math.round((timeCompleted - timeStarted) / 1000 / 60); // in minutes
    
    // Save to localStorage (in a real app, this would be sent to the backend)
    const completedTests = JSON.parse(localStorage.getItem('completedTests') || '[]');
    if (!completedTests.includes(testId)) {
      completedTests.push(testId);
      localStorage.setItem('completedTests', JSON.stringify(completedTests));
    }
    
    // Store test results
    const testResults = {
      testId,
      testName: currentTest.name,
      answers,
      timeTaken,
      completedAt: timeCompleted.toISOString(),
      totalQuestions
    };
    
    localStorage.setItem(`testResult_${testId}`, JSON.stringify(testResults));
    
    // Navigate to results
    navigate(`/results/${testId}`);
  };

  const getCurrentAnswer = () => {
    return answers[currentQuestion.id];
  };

  const isCurrentQuestionAnswered = () => {
    const answer = getCurrentAnswer();
    if (currentQuestion.type === 'multiselect') {
      return answer && answer.length > 0;
    }
    return answer !== undefined && answer !== '';
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="container mx-auto py-8 max-w-4xl">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-12">
              <div className="text-6xl mb-4">{currentTest.icon}</div>
              <CardTitle className="text-3xl mb-2">{currentTest.name}</CardTitle>
              <p className="text-purple-100 text-lg">{currentTest.subtitle}</p>
              {currentTest.isPremium && (
                <Badge className="bg-white/20 text-white mt-4">
                  <Crown className="w-4 h-4 mr-1" />
                  Premium Test
                </Badge>
              )}
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Test</h3>
                    <p className="text-gray-700">{currentTest.description}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700">{currentTest.duration}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700">{totalQuestions} comprehensive questions</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700">Category: {currentTest.category}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">What You'll Discover</h3>
                    <div className="space-y-2">
                      {currentTest.dimensions.map((dimension, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-purple-500" />
                          <span className="text-gray-700 text-sm">{dimension}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">Instructions</h4>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• Answer honestly and spontaneously</li>
                      <li>• There are no right or wrong answers</li>
                      <li>• Take your time, but trust your first instinct</li>
                      <li>• You can navigate back to change answers</li>
                      <li>• Your results will be saved automatically</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={() => setShowInstructions(false)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
                >
                  Begin Test
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case 'scale':
        return (
          <RadioGroup
            value={getCurrentAnswer()?.toString()}
            onValueChange={(value) => handleAnswer(currentQuestion.id, parseInt(value))}
            className="space-y-4"
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <div key={value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <RadioGroupItem value={value.toString()} />
                <Label className="flex-1 cursor-pointer">
                  <div className="flex justify-between">
                    <span>{getScaleLabel(value)}</span>
                    <span className="text-sm text-gray-500">{value}</span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
        
      case 'select':
        return (
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={getCurrentAnswer() === option.value ? "default" : "outline"}
                className="w-full text-left justify-start p-4 h-auto"
                onClick={() => handleAnswer(currentQuestion.id, option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        );
        
      case 'multiselect':
        return (
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <Checkbox
                  checked={(getCurrentAnswer() || []).includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentAnswers = getCurrentAnswer() || [];
                    const newAnswers = checked
                      ? [...currentAnswers, option.value]
                      : currentAnswers.filter(val => val !== option.value);
                    handleAnswer(currentQuestion.id, newAnswers);
                  }}
                />
                <Label className="flex-1 cursor-pointer">{option.label}</Label>
              </div>
            ))}
          </div>
        );
        
      case 'text':
        return (
          <Input
            value={getCurrentAnswer() || ''}
            onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="w-full"
          />
        );
        
      case 'date':
        return (
          <Input
            type="date"
            value={getCurrentAnswer() || ''}
            onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            className="w-full"
          />
        );
        
      case 'time':
        return (
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={getCurrentAnswer() === option.value ? "default" : "outline"}
                className="w-full text-left justify-start p-4 h-auto"
                onClick={() => handleAnswer(currentQuestion.id, option.value)}
              >
                <div>
                  <div>{option.label}</div>
                  <div className="text-sm text-gray-500">Score: {option.score}</div>
                </div>
              </Button>
            ))}
          </div>
        );
        
      default:
        // Default to 5-point Likert scale
        return (
          <RadioGroup
            value={getCurrentAnswer()?.toString()}
            onValueChange={(value) => handleAnswer(currentQuestion.id, parseInt(value))}
            className="space-y-4"
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <div key={value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <RadioGroupItem value={value.toString()} />
                <Label className="flex-1 cursor-pointer">
                  <div className="flex justify-between">
                    <span>{getScaleLabel(value)}</span>
                    <span className="text-sm text-gray-500">{value}</span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
    }
  };

  const getScaleLabel = (value) => {
    const labels = {
      1: 'Strongly Disagree',
      2: 'Disagree',
      3: 'Neutral',
      4: 'Agree', 
      5: 'Strongly Agree'
    };
    return labels[value];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="container mx-auto py-8 max-w-4xl">
        
        {/* Progress Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <div className="text-2xl">{currentTest.icon}</div>
                <div>
                  <h1 className="font-semibold text-gray-900">{currentTest.name}</h1>
                  <p className="text-sm text-gray-600">{currentTest.category}</p>
                </div>
              </div>
              
              {currentTest.isPremium && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                <span>{getAnsweredCount()} answered</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">
              {currentQuestion.text}
            </CardTitle>
            {currentQuestion.dimension && (
              <div className="text-sm text-gray-500">
                Dimension: {currentQuestion.dimension}
              </div>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            {renderQuestionInput()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <div className="text-sm text-gray-500">
                {isCurrentQuestionAnswered() ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Answered
                  </div>
                ) : (
                  'Please select an answer'
                )}
              </div>
              
              {currentQuestionIndex === totalQuestions - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!isCurrentQuestionAnswered() || isSubmitting}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Test
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isCurrentQuestionAnswered()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PremiumTestTaking;