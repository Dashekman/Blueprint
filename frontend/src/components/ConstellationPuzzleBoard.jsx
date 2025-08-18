import React from 'react';

const ConstellationPuzzleBoard = ({ completedTests = [], totalTests = 8, className = "" }) => {
  // Define the constellation pieces and their positions
  const constellationPieces = [
    {
      id: 'mbti',
      testId: 'mbti',
      name: 'Core Self',
      position: { x: 50, y: 20 }, // Top center
      icon: '🧠',
      color: '#4F46E5',
      size: 'large'
    },
    {
      id: 'bigFive',
      testId: 'bigFive', 
      name: 'Personality Dimensions',
      position: { x: 80, y: 35 },
      icon: '⭐',
      color: '#3B82F6',
      size: 'large'
    },
    {
      id: 'values',
      testId: 'values',
      name: 'Core Values',
      position: { x: 85, y: 65 },
      icon: '💎',
      color: '#8B5CF6',
      size: 'medium'
    },
    {
      id: 'riasec',
      testId: 'riasec',
      name: 'Career Path', 
      position: { x: 65, y: 85 },
      icon: '🎯',
      color: '#10B981',
      size: 'medium'
    },
    {
      id: 'enneagram',
      testId: 'enneagram',
      name: 'Inner Motivations',
      position: { x: 35, y: 85 },
      icon: '🌟',
      color: '#F59E0B',
      size: 'medium'
    },
    {
      id: 'grit',
      testId: 'grit',
      name: 'Drive & Persistence',
      position: { x: 15, y: 65 },
      icon: '🔥',
      color: '#EF4444',
      size: 'medium'
    },
    {
      id: 'darkTriad',
      testId: 'darkTriad',
      name: 'Shadow Self',
      position: { x: 20, y: 35 },
      icon: '🌑',
      color: '#6B7280',
      size: 'small'
    },
    {
      id: 'chronotype',
      testId: 'chronotype',
      name: 'Natural Rhythm',
      position: { x: 50, y: 50 }, // Center
      icon: '🌙',
      color: '#6366F1',
      size: 'medium'
    },
    {
      id: 'numerology',
      testId: 'numerology',
      name: 'Cosmic Numbers',
      position: { x: 50, y: 75 },
      icon: '🔢',
      color: '#FBBF24',
      size: 'small'
    },
    {
      id: 'palmistry',
      testId: 'palmistry',
      name: 'Palm Wisdom',
      position: { x: 75, y: 50 },
      icon: '👋',
      color: '#EC4899',
      size: 'small'
    }
  ];

  const isTestCompleted = (testId) => {
    return completedTests.includes(testId);
  };

  const getCompletionPercentage = () => {
    return Math.round((completedTests.length / totalTests) * 100);
  };

  const getSizeClass = (size) => {
    switch (size) {
      case 'large': return 'w-16 h-16 text-2xl';
      case 'medium': return 'w-12 h-12 text-lg';
      case 'small': return 'w-8 h-8 text-sm';
      default: return 'w-12 h-12 text-lg';
    }
  };

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      {/* Constellation Background */}
      <div className="relative bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 rounded-3xl p-8 overflow-hidden">
        {/* Animated stars background */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {constellationPieces.map((piece, index) => {
            if (!isTestCompleted(piece.testId)) return null;
            
            return constellationPieces
              .filter((otherPiece, otherIndex) => 
                otherIndex > index && 
                isTestCompleted(otherPiece.testId) &&
                Math.sqrt(
                  Math.pow(piece.position.x - otherPiece.position.x, 2) +
                  Math.pow(piece.position.y - otherPiece.position.y, 2)
                ) < 40 // Only connect nearby pieces
              )
              .map((connectedPiece, connectionIndex) => (
                <line
                  key={`${piece.id}-${connectedPiece.id}-${connectionIndex}`}
                  x1={`${piece.position.x}%`}
                  y1={`${piece.position.y}%`}
                  x2={`${connectedPiece.position.x}%`}
                  y2={`${connectedPiece.position.y}%`}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="1"
                  className="animate-pulse"
                />
              ));
          })}
        </svg>

        {/* Constellation Pieces */}
        {constellationPieces.map((piece) => {
          const completed = isTestCompleted(piece.testId);
          
          return (
            <div
              key={piece.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                completed ? 'scale-100 opacity-100' : 'scale-75 opacity-40'
              }`}
              style={{
                left: `${piece.position.x}%`,
                top: `${piece.position.y}%`
              }}
            >
              {/* Glow effect for completed pieces */}
              {completed && (
                <div
                  className={`absolute inset-0 rounded-full animate-pulse ${getSizeClass(piece.size)}`}
                  style={{
                    backgroundColor: piece.color,
                    filter: 'blur(8px)',
                    opacity: 0.6
                  }}
                />
              )}
              
              {/* Main piece */}
              <div
                className={`relative ${getSizeClass(piece.size)} rounded-full flex items-center justify-center font-bold text-white shadow-lg transition-all duration-300 cursor-pointer hover:scale-110 ${
                  completed 
                    ? 'animate-pulse hover:animate-none' 
                    : 'border-2 border-dashed border-white/30'
                }`}
                style={{
                  backgroundColor: completed ? piece.color : 'rgba(255, 255, 255, 0.1)'
                }}
                title={piece.name}
              >
                {completed ? piece.icon : '?'}
              </div>
              
              {/* Piece label */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center">
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                  completed 
                    ? 'bg-white/20 text-white' 
                    : 'bg-white/10 text-white/60'
                }`}>
                  {piece.name}
                </div>
              </div>
            </div>
          );
        })}

        {/* Center mandala design */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {/* Outer ring */}
          <div className="w-64 h-64 border border-white/20 rounded-full animate-spin" style={{ animationDuration: '60s' }} />
          
          {/* Middle ring */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/15 rounded-full animate-spin" style={{ animationDuration: '45s', animationDirection: 'reverse' }} />
          
          {/* Inner ring */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/10 rounded-full animate-spin" style={{ animationDuration: '30s' }} />
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center space-x-4 mb-3">
          <div className="text-2xl font-bold text-gray-800">
            {completedTests.length} / {totalTests}
          </div>
          <div className="text-sm text-gray-600">
            Tests Completed
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${getCompletionPercentage()}%` }}
          />
        </div>
        
        <div className="mt-2 text-sm text-gray-500">
          {getCompletionPercentage()}% Complete - {getCompletionPercentage() === 100 ? 'Your constellation is complete! ✨' : 'Keep going to complete your constellation! 🌟'}
        </div>
      </div>

      {/* Completion message */}
      {getCompletionPercentage() === 100 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
          <div className="text-center">
            <div className="text-2xl mb-2">🎉</div>
            <div className="text-lg font-semibold text-purple-900 mb-1">
              Constellation Complete!
            </div>
            <div className="text-sm text-purple-700">
              You've unlocked your complete personality constellation. Your superhuman identity puzzle is now complete!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConstellationPuzzleBoard;