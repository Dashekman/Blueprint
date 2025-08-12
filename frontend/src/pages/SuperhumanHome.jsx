import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { 
  Brain, Clock, Star, ArrowRight, CheckCircle, Zap, 
  Trophy, Lock, Unlock, Sparkles, Target 
} from 'lucide-react';
import { 
  SuperhumanOrb, 
  CosmicBackground, 
  PuzzlePiece, 
  SuperhumanProgress,
  EnlightenmentSymbol 
} from '../components/SuperhumanTheme';
import { superhumanTests, puzzleTheme } from '../data/superhuman-tests';
import { useUser } from '../contexts/UserContext';
import { useApi } from '../hooks/useApi';
import ApiService from '../services/api';

const SuperhumanHome = () => {
  const { userSession, userSummary, isLoading } = useUser();
  const { execute } = useApi();
  const [superhumanProgress, setSuperhumanProgress] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    if (userSession) {
      loadSuperhumanProgress();
    }
  }, [userSession, userSummary]);

  const loadSuperhumanProgress = async () => {
    try {
      const response = await ApiService.getSuperhumanProgress(userSession);
      if (response.success) {
        setSuperhumanProgress(response.progress);
      }
    } catch (error) {
      console.error('Failed to load superhuman progress:', error);
    }
  };

  const availableTests = Object.entries(superhumanTests).map(([key, test]) => ({
    ...test,
    completed: userSummary?.completed_test_types?.includes(key) || false
  }));

  const getTestColor = (testId) => {
    const colors = {
      mbti: 'purple',
      enneagram: 'rose', 
      disc: 'emerald',
      humanDesign: 'violet',
      palmistry: 'amber'
    };
    return colors[testId] || 'purple';
  };

  if (isLoading) {
    return (
      <CosmicBackground>
        <div className="min-h-screen flex items-center justify-center">
          <SuperhumanOrb size="large" color="cosmic" />
        </div>
      </CosmicBackground>
    );
  }

  return (
    <CosmicBackground intensity="medium">
      <div className="space-y-12 relative">
        {/* Cosmic Hero Section */}
        <section className="text-center py-16 relative">
          <div className="absolute inset-0 cosmic-particles"></div>
          
          <div className="max-w-4xl mx-auto space-y-8 relative z-10">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <SuperhumanOrb size="large" color="cosmic" animate={true} />
                <div className="absolute -top-4 -right-4">
                  <EnlightenmentSymbol />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="text-white">Unlock Your</span>
                <br />
                <span className="text-superhuman-gradient animate-cosmic-pulse">
                  Superhuman Identity
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
                Collect the mystical puzzle pieces of your consciousness. Each test unlocks ancient wisdom 
                and cutting-edge insights to transform you into your most powerful self.
              </p>

              <div className="flex items-center justify-center space-x-2 text-amber-300">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span className="text-lg font-medium">{puzzleTheme.subtitle}</span>
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl transform hover:scale-105 transition-all duration-300" 
                asChild
              >
                <Link to="#puzzle-collection">
                  <Zap className="mr-2 h-5 w-5" />
                  Begin Transformation
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-purple-400 text-purple-300 hover:bg-purple-900/50" 
                asChild
              >
                <Link to="/ai-coach">
                  <Brain className="mr-2 h-5 w-5" />
                  Consult AI Coach
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Superhuman Progress Dashboard */}
        {userSummary && (
          <section className="max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="bg-gradient-to-br from-slate-900/80 to-purple-900/80 backdrop-blur-sm border-purple-500/30 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <Trophy className="h-6 w-6 text-amber-400" />
                      <span>Your Superhuman Evolution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {superhumanProgress && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-lg">Consciousness Unlocked</span>
                          <span className="text-2xl font-bold text-amber-400">
                            {Math.round(superhumanProgress.percentage)}%
                          </span>
                        </div>
                        
                        <Progress 
                          value={superhumanProgress.percentage} 
                          className="w-full h-4 bg-slate-700"
                        />

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {superhumanProgress.puzzle_pieces?.map((puzzle) => (
                            <div key={puzzle.id} className="text-center space-y-2">
                              <PuzzlePiece
                                name={puzzle.name}
                                icon={puzzle.icon}
                                unlocked={puzzle.unlocked}
                                color={getTestColor(puzzle.test)}
                                className="mx-auto"
                                onClick={() => !puzzle.unlocked && setSelectedTest(puzzle.test)}
                              />
                              <div className={`text-xs ${puzzle.unlocked ? 'text-emerald-300' : 'text-slate-400'}`}>
                                {puzzle.name}
                              </div>
                            </div>
                          ))}
                        </div>

                        {superhumanProgress.superhuman_qualities && (
                          <div className="grid grid-cols-2 gap-2 mt-6">
                            {superhumanProgress.superhuman_qualities.unlocked.map((quality, index) => (
                              <div key={index} className="flex items-center space-x-2 text-emerald-300">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm">{quality}</span>
                              </div>
                            ))}
                            {superhumanProgress.superhuman_qualities.locked.map((quality, index) => (
                              <div key={index} className="flex items-center space-x-2 text-slate-500">
                                <Lock className="h-4 w-4" />
                                <span className="text-sm">{quality}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <SuperhumanProgress 
                  completedPuzzles={userSummary?.puzzle_pieces_unlocked?.length || 0}
                  totalPuzzles={5}
                  superhumanQualities={puzzleTheme.superhumanQualities}
                />
              </div>
            </div>
          </section>
        )}

        {/* Puzzle Collection */}
        <section id="puzzle-collection" className="max-w-7xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-white">
              The Identity Puzzle Collection
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Each mystical assessment unlocks a unique piece of your consciousness. 
              Collect them all to ascend to your superhuman potential.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {availableTests.map((test) => (
              <Card 
                key={test.id} 
                className={`group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                  test.completed 
                    ? 'bg-gradient-to-br from-emerald-900/80 to-teal-900/80 border-emerald-400/50' 
                    : 'bg-gradient-to-br from-slate-900/80 to-purple-900/80 border-purple-400/30'
                } backdrop-blur-sm`}
              >
                {/* Completion Status */}
                {test.completed && (
                  <div className="absolute top-4 right-4 z-20">
                    <Badge className="bg-emerald-500 text-white shadow-lg">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Unlocked
                    </Badge>
                  </div>
                )}

                {/* Test Icon */}
                <div className="absolute top-4 left-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${test.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {test.icon}
                  </div>
                </div>

                <CardHeader className="pt-20 pb-4">
                  <CardTitle className="text-xl text-white group-hover:text-amber-300 transition-colors">
                    {test.name}
                  </CardTitle>
                  <CardDescription className="text-slate-300 text-sm">
                    {test.shortDescription}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="p-3 bg-black/20 rounded-lg backdrop-blur-sm">
                    <div className="text-amber-400 font-medium text-sm mb-1">
                      Unlocks: {test.puzzle}
                    </div>
                    <div className="text-slate-300 text-xs">
                      {test.fullDescription}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{test.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="h-4 w-4" />
                      <span>{test.questions?.length || 'Variable'} questions</span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button 
                      className={`w-full ${
                        test.completed
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                      } text-white shadow-lg transform hover:scale-105 transition-all duration-300`}
                      asChild
                    >
                      <Link to={`/test/${test.id}`}>
                        {test.completed ? (
                          <>
                            <Unlock className="mr-2 h-4 w-4" />
                            Experience Again
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Unlock Puzzle
                          </>
                        )}
                      </Link>
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                          Learn More About This Puzzle
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gradient-to-br from-slate-900 to-purple-900 border-purple-500/30 text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${test.color} flex items-center justify-center text-lg`}>
                              {test.icon}
                            </div>
                            <span>{test.name}</span>
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-amber-400 mb-2">Purpose & Power</h4>
                            <p className="text-slate-300 leading-relaxed">{test.purpose}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-emerald-400 mb-2">What You'll Unlock</h4>
                            <p className="text-slate-300 leading-relaxed">{test.fullDescription}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-400 mb-2">Puzzle Piece</h4>
                            <p className="text-slate-300 leading-relaxed">
                              This assessment reveals your <strong>{test.puzzle}</strong> - a crucial component 
                              of your superhuman identity that will integrate with other pieces to create your complete blueprint.
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-center">
              <SuperhumanOrb size="large" color="enlightened" />
            </div>
            
            <h2 className="text-4xl font-bold text-white">
              Ready to Unlock Your Superhuman Potential?
            </h2>
            
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Join thousands who have discovered their true identity and transformed into 
              the most powerful version of themselves.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-2xl transform hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link to="#puzzle-collection">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Your Journey
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-amber-400 text-amber-300 hover:bg-amber-900/50"
                asChild
              >
                <Link to="/profile">
                  <Trophy className="mr-2 h-5 w-5" />
                  View Progress
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </CosmicBackground>
  );
};

export default SuperhumanHome;