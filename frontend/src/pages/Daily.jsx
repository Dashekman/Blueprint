import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Calendar, Star, Heart, Clock, Play, Pause, 
  Volume2, Download, RefreshCw, Sun, Moon 
} from 'lucide-react';
import { mockDailyContent } from '../data/mock';

const Daily = () => {
  const [isPlayingMeditation, setIsPlayingMeditation] = useState(false);
  const [meditationProgress, setMeditationProgress] = useState(0);
  const [completedRoutine, setCompletedRoutine] = useState(false);

  useEffect(() => {
    // Check if daily routine was completed today
    const today = new Date().toDateString();
    const lastCompleted = localStorage.getItem('lastCompletedRoutine');
    setCompletedRoutine(lastCompleted === today);
  }, []);

  const handleCompleteRoutine = () => {
    const today = new Date().toDateString();
    localStorage.setItem('lastCompletedRoutine', today);
    setCompletedRoutine(true);
  };

  const handlePlayMeditation = () => {
    setIsPlayingMeditation(!isPlayingMeditation);
    // In real app, this would control audio playback
    if (!isPlayingMeditation) {
      // Simulate meditation progress
      const interval = setInterval(() => {
        setMeditationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlayingMeditation(false);
            return 0;
          }
          return prev + 1;
        });
      }, 100);
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full">
            <Sun className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Today's Guidance
        </h1>
        <p className="text-slate-600 flex items-center justify-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>{currentDate}</span>
        </p>
      </div>

      {/* Daily Overview */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-4 text-center">
            <Star className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-800 font-medium">Daily Insights</p>
            <p className="text-xs text-blue-600">Personalized for you</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="pt-4 text-center">
            <Heart className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm text-emerald-800 font-medium">Wellness Focus</p>
            <p className="text-xs text-emerald-600">Mind & spirit</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="pt-4 text-center">
            <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-purple-800 font-medium">Quick Practice</p>
            <p className="text-xs text-purple-600">3-7 minutes</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Horoscope */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-amber-500" />
            <span>Today's Cosmic Guidance</span>
            <Badge variant="outline" className="ml-auto text-xs">
              Entertainment/Guidance
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
            <p className="text-slate-700 leading-relaxed italic">
              {mockDailyContent.horoscope}
            </p>
          </div>
          <div className="flex justify-end mt-3">
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate New
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Daily Mantra */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-rose-500" />
            <span>Today's Mantra</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-200">
            <p className="text-lg font-medium text-slate-800 leading-relaxed">
              "{mockDailyContent.mantra}"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Micro-Routine */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-emerald-500" />
            <span>Today's Micro-Routine</span>
            <Badge className="ml-auto bg-emerald-100 text-emerald-800">
              {mockDailyContent.microRoutine.duration}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">
              {mockDailyContent.microRoutine.name}
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              {mockDailyContent.microRoutine.description}
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-slate-800">Steps:</h4>
            <div className="space-y-2">
              {mockDailyContent.microRoutine.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium">
                    {index + 1}
                  </div>
                  <span className="text-slate-700 text-sm">{step}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-3 pt-4">
            <Button 
              onClick={handleCompleteRoutine}
              disabled={completedRoutine}
              className={completedRoutine ? 'bg-emerald-600' : 'bg-slate-900 hover:bg-slate-800'}
            >
              {completedRoutine ? 'Completed Today!' : 'Mark as Complete'}
            </Button>
            {completedRoutine && (
              <Badge className="bg-emerald-100 text-emerald-800">
                ✓ Done for today
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Guided Meditation */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Moon className="h-5 w-5 text-indigo-500" />
            <span>Guided Meditation</span>
            <Badge className="ml-auto bg-indigo-100 text-indigo-800">
              {mockDailyContent.meditation.duration}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">
              {mockDailyContent.meditation.title}
            </h3>
          </div>
          
          {/* Audio Player Mockup */}
          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handlePlayMeditation}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 rounded-full w-10 h-10 p-0"
              >
                {isPlayingMeditation ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" />
                )}
              </Button>
              
              <div className="flex-1">
                <div className="w-full bg-indigo-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${meditationProgress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {isPlayingMeditation && (
              <div className="mt-3 text-xs text-indigo-600">
                Playing: {mockDailyContent.meditation.title}
              </div>
            )}
          </div>
          
          {/* Meditation Script Preview */}
          <div className="p-4 bg-slate-50 rounded-lg border">
            <h4 className="font-medium text-slate-800 mb-2">Preview:</h4>
            <p className="text-sm text-slate-600 italic leading-relaxed">
              {mockDailyContent.meditation.script.substring(0, 200)}...
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" asChild>
              <Link to="/library">View All Meditations</Link>
            </Button>
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate New
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Goals */}
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-slate-600" />
            <span>This Week's Focus</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <h4 className="font-medium text-slate-800 text-sm">Personal Growth</h4>
              <p className="text-slate-600 text-xs">Practice emotional expression daily</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <h4 className="font-medium text-slate-800 text-sm">Professional</h4>
              <p className="text-slate-600 text-xs">Focus on strategic planning and long-term goals</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <h4 className="font-medium text-slate-800 text-sm">Wellness</h4>
              <p className="text-slate-600 text-xs">Maintain consistent meditation practice</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="text-center pt-6">
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link to="/profile">View Full Profile</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/library">Meditation Library</Link>
          </Button>
          <Button className="bg-slate-900 hover:bg-slate-800" asChild>
            <Link to="/">Take More Tests</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Daily;