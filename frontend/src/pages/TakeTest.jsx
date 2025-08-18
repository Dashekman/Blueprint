import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { mockTests } from '../data/mock';
import { premiumTests } from '../data/premium-tests';
import { useToast } from '../hooks/use-toast';

const TakeTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [test, setTest] = useState(null);

  useEffect(() => {
    // Check if it's a premium test first
    if (premiumTests[testId]) {
      navigate(`/premium-test/${testId}`);
      return;
    }
    
    const testData = mockTests[testId];
    if (!testData) {
      navigate('/');
      return;
    }
    setTest(testData);

    // Load existing progress
    const savedProgress = localStorage.getItem(`test_progress_${testId}`);
    if (savedProgress) {
      const { currentQ, savedAnswers } = JSON.parse(savedProgress);
      setCurrentQuestion(currentQ);
      setAnswers(savedAnswers);
    }
  }, [testId, navigate]);

  const saveProgress = (questionIndex, newAnswers) => {
    localStorage.setItem(`test_progress_${testId}`, JSON.stringify({
      currentQ: questionIndex,
      savedAnswers: newAnswers
    }));
  };

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    saveProgress(currentQuestion, newAnswers);
  };

  const goToNext = () => {
    const question = test.questions[currentQuestion];
    if (!answers[question.id]) {
      toast({
        title: "Please answer the question",
        description: "You need to select an answer before proceeding.",
        variant: "destructive"
      });
      return;
    }
    
    if (currentQuestion < test.questions.length - 1) {
      const nextQ = currentQuestion + 1;
      setCurrentQuestion(nextQ);
      saveProgress(nextQ, answers);
    } else {
      submitTest();
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      const prevQ = currentQuestion - 1;
      setCurrentQuestion(prevQ);
      saveProgress(prevQ, answers);
    }
  };

  const submitTest = () => {
    // Save test results
    const results = {
      testId,
      answers,
      completedAt: new Date().toISOString(),
      score: calculateScore()
    };
    
    localStorage.setItem(`test_results_${testId}`, JSON.stringify(results));
    
    // Mark test as completed
    const completedTests = JSON.parse(localStorage.getItem('completedTests') || '[]');
    if (!completedTests.includes(testId)) {
      completedTests.push(testId);
      localStorage.setItem('completedTests', JSON.stringify(completedTests));
    }
    
    // Clear progress
    localStorage.removeItem(`test_progress_${testId}`);
    
    toast({
      title: "Test completed!",
      description: "Analyzing your results...",
    });
    
    navigate(`/results/${testId}`);
  };

  const calculateScore = () => {
    if (testId === 'mbti') {
      const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
      Object.values(answers).forEach(answer => {
        if (scores.hasOwnProperty(answer)) {
          scores[answer]++;
        }
      });
      
      const type = 
        (scores.E > scores.I ? 'E' : 'I') +
        (scores.S > scores.N ? 'S' : 'N') +
        (scores.T > scores.F ? 'T' : 'F') +
        (scores.J > scores.P ? 'J' : 'P');
      
      return { type, scores };
    }
    
    if (testId === 'enneagram') {
      // Simplified scoring - in real implementation would be more complex
      const avgScore = Object.values(answers).reduce((sum, val) => sum + val, 0) / Object.values(answers).length;
      const types = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      const dominantType = avgScore <= 2 ? '1' : avgScore <= 4 ? '7' : '5';
      return { type: dominantType, averageScore: avgScore };
    }
    
    if (testId === 'disc') {
      const scores = { D: 0, I: 0, S: 0, C: 0 };
      Object.values(answers).forEach(answer => {
        if (scores.hasOwnProperty(answer)) {
          scores[answer]++;
        }
      });
      
      const dominantType = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
      return { type: dominantType, scores };
    }
    
    if (testId === 'humanDesign') {
      // Simplified - would need actual chart calculation
      return { 
        type: answers[5] || 'manifesting-generator',
        authority: answers[4] || 'sacral',
        birthData: {
          date: answers[1],
          time: answers[2],
          location: answers[3]
        }
      };
    }
    
    return {};
  };

  if (!test) {
    return <div>Loading...</div>;
  }

  const progress = ((currentQuestion + 1) / test.questions.length) * 100;
  const question = test.questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{test.name}</h1>
          <p className="text-slate-600">Question {currentQuestion + 1} of {test.questions.length}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      {/* Question Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">
            {question.text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {question.type === 'date' && (
            <div className="space-y-2">
              <Label htmlFor="date-input">Select Date</Label>
              <Input
                id="date-input"
                type="date"
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
                required={question.required}
              />
            </div>
          )}
          
          {question.type === 'time' && (
            <div className="space-y-2">
              <Label htmlFor="time-input">Select Time</Label>
              <Input
                id="time-input"
                type="time"
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
                required={question.required}
              />
            </div>
          )}
          
          {question.type === 'text' && (
            <div className="space-y-2">
              <Label htmlFor="text-input">{question.text}</Label>
              <Input
                id="text-input"
                type="text"
                placeholder="Enter your answer..."
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
                required={question.required}
              />
            </div>
          )}

          {question.options && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-slate-50 ${
                    answers[question.id] === option.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.value}
                    checked={answers[question.id] === option.value}
                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                    className="mt-1"
                  />
                  <span className="text-slate-700 flex-1">{option.text}</span>
                </label>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPrevious}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={goToNext}
          className="bg-slate-900 hover:bg-slate-800"
        >
          {currentQuestion === test.questions.length - 1 ? 'Complete Test' : 'Next'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default TakeTest;