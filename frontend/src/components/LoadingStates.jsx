import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Skeleton } from './ui/skeleton';
import { Brain, Sparkles, Zap } from 'lucide-react';

export const TestSubmissionLoader = ({ progress = 0, testName }) => (
  <div className="max-w-2xl mx-auto text-center space-y-6 p-8">
    <div className="flex justify-center mb-6">
      <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse">
        <Brain className="h-12 w-12 text-white" />
      </div>
    </div>
    
    <h2 className="text-2xl font-bold text-slate-900">
      Analyzing Your {testName} Results
    </h2>
    
    <p className="text-slate-600 leading-relaxed">
      Our AI is processing your responses and generating personalized insights...
    </p>
    
    <div className="space-y-2">
      <Progress value={progress} className="w-full h-3" />
      <p className="text-sm text-slate-500">{Math.round(progress)}% complete</p>
    </div>

    <div className="flex justify-center space-x-8 text-sm text-slate-500">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        <span>Scoring responses</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <span>Generating insights</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        <span>Preparing results</span>
      </div>
    </div>
  </div>
);

export const ProfileSynthesisLoader = ({ progress = 0, testsCount = 0 }) => (
  <div className="max-w-3xl mx-auto text-center space-y-8 p-8">
    <div className="flex justify-center mb-6">
      <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full animate-spin">
        <Sparkles className="h-12 w-12 text-white" />
      </div>
    </div>
    
    <h2 className="text-3xl font-bold text-slate-900">
      Creating Your Personal Blueprint
    </h2>
    
    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
      Our AI is synthesizing insights from your {testsCount} completed assessment{testsCount !== 1 ? 's' : ''} 
      to create a comprehensive personality profile with actionable guidance.
    </p>
    
    <div className="space-y-3">
      <Progress value={progress} className="w-full h-4" />
      <p className="text-sm text-slate-500">{Math.round(progress)}% synthesized</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2 text-blue-700">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Analyzing patterns</span>
        </div>
      </div>
      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
        <div className="flex items-center space-x-2 text-emerald-700">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          <span className="text-sm font-medium">Generating insights</span>
        </div>
      </div>
      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-center space-x-2 text-purple-700">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
          <span className="text-sm font-medium">Creating guidance</span>
        </div>
      </div>
    </div>
  </div>
);

export const DailyContentLoader = () => (
  <div className="max-w-4xl mx-auto space-y-6">
    <div className="text-center space-y-4 py-8">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-bounce">
          <Zap className="h-8 w-8 text-white" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900">
        Generating Your Daily Guidance
      </h2>
      
      <p className="text-slate-600">
        Creating personalized content based on your personality profile...
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-28" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export const PageSkeleton = () => (
  <div className="max-w-4xl mx-auto space-y-6">
    <div className="space-y-4">
      <Skeleton className="h-8 w-64 mx-auto" />
      <Skeleton className="h-4 w-96 mx-auto" />
    </div>
    
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export const ErrorState = ({ 
  title = "Something went wrong", 
  description = "Please try again later", 
  onRetry,
  showRetry = true 
}) => (
  <div className="max-w-2xl mx-auto text-center space-y-6 p-8">
    <div className="flex justify-center mb-6">
      <div className="p-4 bg-red-100 rounded-full">
        <div className="w-12 h-12 text-red-600 flex items-center justify-center">
          ⚠️
        </div>
      </div>
    </div>
    
    <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
    <p className="text-slate-600 leading-relaxed">{description}</p>
    
    {showRetry && onRetry && (
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

export default {
  TestSubmissionLoader,
  ProfileSynthesisLoader,
  DailyContentLoader,
  PageSkeleton,
  ErrorState
};