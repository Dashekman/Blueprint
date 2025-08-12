import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Brain, Sparkles, MessageSquare, Zap } from 'lucide-react';
import { CosmicBackground, SuperhumanOrb } from '../components/SuperhumanTheme';
import AICoach from '../components/AICoach';
import { useUser } from '../contexts/UserContext';

const AICoachPage = () => {
  const { userSession, userSummary } = useUser();

  return (
    <CosmicBackground intensity="low">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">AI Personality Coach</h1>
            <p className="text-purple-300">Your guide to superhuman transformation</p>
          </div>

          <div className="w-24"> {/* Spacer for centering */}</div>
        </div>

        {/* Stats Row */}
        {userSummary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-purple-900/50 border-purple-500/30 text-white">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-300">
                  {userSummary.tests_completed || 0}
                </div>
                <div className="text-sm text-purple-200">Tests Completed</div>
              </CardContent>
            </Card>
            
            <Card className="bg-emerald-900/50 border-emerald-500/30 text-white">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-300">
                  {Math.round((userSummary.superhuman_progress || 0) * 100)}%
                </div>
                <div className="text-sm text-emerald-200">Superhuman Progress</div>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-900/50 border-amber-500/30 text-white">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-amber-300">
                  {userSummary.puzzle_pieces_unlocked?.length || 0}/5
                </div>
                <div className="text-sm text-amber-200">Puzzle Pieces</div>
              </CardContent>
            </Card>
            
            <Card className="bg-rose-900/50 border-rose-500/30 text-white">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-rose-300">
                  {Math.round((userSummary.profile_confidence || 0) * 100)}%
                </div>
                <div className="text-sm text-rose-200">Profile Confidence</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* AI Coach Interface */}
          <div className="lg:col-span-3">
            <AICoach />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Coach Info */}
            <Card className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border-purple-500/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <SuperhumanOrb size="small" color="cosmic" />
                  <span>Your AI Guide</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-purple-200 text-sm leading-relaxed">
                  I'm your personal AI coach trained in psychology, personality systems, 
                  and human development. I can help you understand your test results, 
                  provide personalized growth guidance, and answer any questions about 
                  your superhuman journey.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs">
                    <Brain className="h-3 w-3 text-purple-400" />
                    <span className="text-purple-300">Personality Expert</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <Sparkles className="h-3 w-3 text-purple-400" />
                    <span className="text-purple-300">Growth Coach</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <MessageSquare className="h-3 w-3 text-purple-400" />
                    <span className="text-purple-300">24/7 Available</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-900/50 border-slate-700 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-purple-400/30 text-purple-300 hover:bg-purple-900/50"
                  asChild
                >
                  <Link to="/profile">
                    <Brain className="mr-2 h-4 w-4" />
                    View Full Profile
                  </Link>
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full justify-start border-emerald-400/30 text-emerald-300 hover:bg-emerald-900/50"
                  asChild
                >
                  <Link to="/daily">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Today's Guidance
                  </Link>
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full justify-start border-amber-400/30 text-amber-300 hover:bg-amber-900/50"
                  asChild
                >
                  <Link to="/">
                    <Zap className="mr-2 h-4 w-4" />
                    Take More Tests
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Featured Questions */}
            <Card className="bg-gradient-to-br from-slate-900/80 to-purple-900/80 border-purple-500/30 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Popular Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-purple-800/30 rounded text-purple-200">
                    "How can I use my personality type for career growth?"
                  </div>
                  <div className="p-2 bg-purple-800/30 rounded text-purple-200">
                    "What meditation practices work best for me?"
                  </div>
                  <div className="p-2 bg-purple-800/30 rounded text-purple-200">
                    "How do I improve my relationships?"
                  </div>
                  <div className="p-2 bg-purple-800/30 rounded text-purple-200">
                    "What's my path to becoming superhuman?"
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CosmicBackground>
  );
};

export default AICoachPage;