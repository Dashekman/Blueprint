import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Hand, Sparkles, Star, Heart, TrendingUp } from 'lucide-react';

const AnalysisPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Initializing...');
  
  const { image, isDemo } = location.state || {};

  const analysisSteps = [
    { text: 'Initializing AI analysis...', duration: 1000 },
    { text: 'Detecting palm features...', duration: 1500 },
    { text: 'Analyzing life line patterns...', duration: 2000 },
    { text: 'Reading heart line characteristics...', duration: 1800 },
    { text: 'Interpreting head line formations...', duration: 1600 },
    { text: 'Examining fate line indicators...', duration: 1400 },
    { text: 'Processing personality insights...', duration: 2200 },
    { text: 'Generating your reading...', duration: 1000 },
  ];

  const mysticalMessages = [
    "✨ Your destiny is being unveiled...",
    "🔮 The ancient wisdom of palmistry awakens...",
    "⭐ Cosmic patterns in your palm are revealing themselves...",
    "🌙 Your palm holds secrets waiting to be discovered...",
    "💫 The lines of your life are speaking their truth...",
  ];

  useEffect(() => {
    if (!image) {
      navigate('/upload');
      return;
    }

    let stepIndex = 0;
    let totalDuration = 0;
    let currentProgress = 0;

    const runAnalysis = () => {
      if (stepIndex < analysisSteps.length) {
        const step = analysisSteps[stepIndex];
        setCurrentStep(step.text);
        
        const stepProgress = (stepIndex + 1) / analysisSteps.length * 100;
        
        // Animate progress for this step
        const progressInterval = setInterval(() => {
          currentProgress += 2;
          if (currentProgress >= stepProgress) {
            currentProgress = stepProgress;
            clearInterval(progressInterval);
          }
          setProgress(currentProgress);
        }, 50);

        setTimeout(() => {
          stepIndex++;
          runAnalysis();
        }, step.duration);
        
      } else {
        // Analysis complete - navigate to results
        setTimeout(() => {
          navigate('/results', { 
            state: { 
              image,
              isDemo,
              analysisComplete: true 
            } 
          });
        }, 500);
      }
    };

    runAnalysis();
  }, [image, navigate, isDemo]);

  if (!image) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 flex items-center justify-center px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardContent className="p-8 text-center">
            {/* Animated Palm Icon */}
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Hand className="w-12 h-12 text-white" />
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
              <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-blue-400 rounded-full animate-ping animation-delay-300" />
              <div className="absolute top-1/2 -left-4 w-2 h-2 bg-pink-400 rounded-full animate-ping animation-delay-700" />
            </div>

            {/* Main Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Analyzing Your Palm
            </h1>
            <p className="text-purple-200 text-lg mb-8">
              {mysticalMessages[Math.floor(progress / 20) % mysticalMessages.length]}
            </p>

            {/* Progress Section */}
            <div className="mb-8 space-y-4">
              <Progress 
                value={progress} 
                className="h-3 bg-white/20" 
              />
              <div className="flex justify-between text-sm text-purple-200">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>

            {/* Current Step */}
            <div className="bg-white/10 rounded-lg p-4 mb-8">
              <div className="flex items-center justify-center space-x-2 text-white">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="font-medium">{currentStep}</span>
              </div>
            </div>

            {/* Preview Image */}
            <div className="aspect-[4/3] bg-white/20 rounded-lg overflow-hidden mb-6 max-w-xs mx-auto">
              <img 
                src={image} 
                alt="Your palm" 
                className="w-full h-full object-cover opacity-80"
              />
            </div>

            {/* Feature Icons */}
            <div className="flex justify-center space-x-6 text-purple-200">
              <div className="text-center">
                <TrendingUp className="w-6 h-6 mx-auto mb-1" />
                <div className="text-xs">Life</div>
              </div>
              <div className="text-center">
                <Heart className="w-6 h-6 mx-auto mb-1" />
                <div className="text-xs">Love</div>
              </div>
              <div className="text-center">
                <Star className="w-6 h-6 mx-auto mb-1" />
                <div className="text-xs">Success</div>
              </div>
              <div className="text-center">
                <Sparkles className="w-6 h-6 mx-auto mb-1" />
                <div className="text-xs">Destiny</div>
              </div>
            </div>

            {/* Bottom disclaimer */}
            <p className="text-xs text-purple-300 mt-6 opacity-75">
              AI analysis in progress • For entertainment purposes
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalysisPage;