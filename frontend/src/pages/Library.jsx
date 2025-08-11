import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  Search, Play, Download, Clock, Heart, Brain, 
  Star, Filter, Headphones, Volume2 
} from 'lucide-react';
import { mockMeditations } from '../data/mock';

const Library = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPlaying, setIsPlaying] = useState(null);

  const categories = [
    { id: 'all', name: 'All Meditations', icon: Star },
    { id: 'focus', name: 'Focus & Clarity', icon: Brain },
    { id: 'confidence', name: 'Confidence Building', icon: Heart },
    { id: 'relationships', name: 'Relationships', icon: Heart },
    { id: 'stress', name: 'Stress Relief', icon: Clock }
  ];

  const filteredMeditations = mockMeditations.filter(meditation => {
    const matchesSearch = meditation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meditation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || meditation.id.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handlePlay = (meditationId) => {
    setIsPlaying(isPlaying === meditationId ? null : meditationId);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full">
            <Headphones className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Meditation Library
        </h1>
        <p className="text-slate-600">
          Personalized guided meditations for your growth journey
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search meditations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-1"
                >
                  <Icon className="h-3 w-3" />
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {mockMeditations.length}
            </div>
            <p className="text-sm text-blue-800">Total Meditations</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-emerald-600 mb-1">
              {Math.round(mockMeditations.reduce((sum, m) => sum + parseInt(m.duration), 0) / mockMeditations.length)}
            </div>
            <p className="text-sm text-emerald-800">Avg Duration (min)</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">3</div>
            <p className="text-sm text-purple-800">Played Today</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-amber-600 mb-1">12</div>
            <p className="text-sm text-amber-800">Favorites</p>
          </CardContent>
        </Card>
      </div>

      {/* Meditations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeditations.map((meditation) => (
          <Card key={meditation.id} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {meditation.duration}
                </Badge>
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-lg leading-tight group-hover:text-indigo-600 transition-colors">
                {meditation.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-slate-600 text-sm leading-relaxed">
                {meditation.description}
              </p>
              
              {/* Audio Player Preview */}
              <div className="p-3 bg-slate-50 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => handlePlay(meditation.id)}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 rounded-full w-8 h-8 p-0"
                  >
                    <Play className="h-3 w-3 ml-0.5" />
                  </Button>
                  
                  <div className="flex-1">
                    <div className="w-full bg-slate-200 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full transition-all duration-300 ${
                          isPlaying === meditation.id ? 'bg-indigo-600 w-1/3' : 'bg-slate-300 w-0'
                        }`}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Volume2 className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {isPlaying === meditation.id && (
                  <div className="mt-2">
                    <p className="text-xs text-indigo-600 font-medium">Now Playing</p>
                    <p className="text-xs text-slate-500 truncate">
                      {meditation.script.substring(0, 60)}...
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button size="sm" className="flex-1 bg-slate-900 hover:bg-slate-800">
                  <Play className="h-3 w-3 mr-2" />
                  Play Full
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMeditations.length === 0 && (
        <div className="text-center py-12">
          <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No meditations found</h3>
          <p className="text-slate-600 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button variant="outline" onClick={() => {
            setSearchTerm('');
            setSelectedCategory('all');
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Custom Meditation CTA */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardContent className="pt-6 text-center">
          <h3 className="text-lg font-semibold text-indigo-900 mb-2">
            Need Something Specific?
          </h3>
          <p className="text-indigo-700 mb-4">
            Our AI can create personalized meditations based on your current needs and personality profile.
          </p>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Request Custom Meditation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Library;