import React from 'react';
import { Card, CardContent } from './ui/card';

// Superhuman decorative elements and theme components
export const SuperhumanOrb = ({ size = 'medium', color = 'purple', animate = true }) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24', 
    large: 'w-32 h-32'
  };

  const colorClasses = {
    purple: 'from-purple-400 to-indigo-600',
    gold: 'from-amber-400 to-yellow-600',
    cosmic: 'from-violet-500 via-purple-500 to-indigo-500',
    enlightened: 'from-emerald-400 to-teal-500'
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${colorClasses[color]} opacity-80 ${animate ? 'animate-pulse' : ''}`}>
      </div>
      <div className={`absolute inset-2 rounded-full bg-gradient-to-br ${colorClasses[color]} blur-sm ${animate ? 'animate-spin' : ''}`} 
           style={{ animation: animate ? 'spin 8s linear infinite' : 'none' }}>
      </div>
      <div className="absolute inset-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
      </div>
    </div>
  );
};

export const EnlightenmentSymbol = ({ className = "" }) => (
  <div className={`relative ${className}`}>
    <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
      <div className="text-white text-sm font-bold">✧</div>
    </div>
    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full animate-pulse"></div>
  </div>
);

export const PuzzlePiece = ({ 
  name, 
  icon, 
  unlocked = false, 
  color = 'purple', 
  onClick,
  className = "" 
}) => {
  const colorClasses = {
    purple: unlocked ? 'from-purple-500 to-indigo-600' : 'from-slate-300 to-slate-400',
    rose: unlocked ? 'from-rose-500 to-pink-600' : 'from-slate-300 to-slate-400',
    emerald: unlocked ? 'from-emerald-500 to-teal-600' : 'from-slate-300 to-slate-400',
    amber: unlocked ? 'from-amber-500 to-orange-600' : 'from-slate-300 to-slate-400',
    violet: unlocked ? 'from-violet-500 to-purple-600' : 'from-slate-300 to-slate-400'
  };

  return (
    <div 
      className={`relative cursor-pointer transform transition-all duration-300 hover:scale-105 ${className}`}
      onClick={onClick}
    >
      <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses[color]} rounded-2xl shadow-lg flex items-center justify-center relative overflow-hidden`}>
        <div className="text-2xl">{unlocked ? icon : '🔒'}</div>
        {unlocked && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        )}
        {unlocked && (
          <div className="absolute -top-1 -right-1">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <div className="text-white text-xs">✓</div>
            </div>
          </div>
        )}
      </div>
      {unlocked && (
        <div className="absolute inset-0 rounded-2xl animate-pulse bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
      )}
    </div>
  );
};

export const SuperhumanProgress = ({ 
  completedPuzzles = 0, 
  totalPuzzles = 5,
  superhumanQualities = []
}) => {
  const progressPercentage = (completedPuzzles / totalPuzzles) * 100;
  const unlockedQualities = Math.floor((completedPuzzles / totalPuzzles) * superhumanQualities.length);

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-purple-900 border-purple-500/20 text-white">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <SuperhumanOrb size="large" color="cosmic" />
          </div>
          
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
            Superhuman Evolution
          </h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Superhuman</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {superhumanQualities.slice(0, unlockedQualities).map((quality, index) => (
              <div key={index} className="flex items-center space-x-2 text-emerald-300">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span>{quality.name}</span>
              </div>
            ))}
            {superhumanQualities.slice(unlockedQualities).map((quality, index) => (
              <div key={index} className="flex items-center space-x-2 text-slate-400">
                <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                <span>{quality.name}</span>
              </div>
            ))}
          </div>

          {completedPuzzles === totalPuzzles && (
            <div className="mt-4 p-4 bg-gradient-to-r from-gold-400/20 to-amber-500/20 rounded-lg border border-amber-400/30">
              <div className="text-amber-300 font-bold">🎉 Superhuman Achieved!</div>
              <div className="text-xs text-amber-200 mt-1">
                You have unlocked all puzzle pieces of your identity
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const CosmicBackground = ({ children, intensity = 'medium' }) => {
  const intensityClasses = {
    low: 'opacity-30',
    medium: 'opacity-50', 
    high: 'opacity-70'
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Cosmic background */}
      <div className={`fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-indigo-900/20 ${intensityClasses[intensity]}`}>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #7c3aed 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #ec4899 0%, transparent 50%),
                           radial-gradient(circle at 50% 50%, #8b5cf6 0%, transparent 50%)`
        }}></div>
      </div>
      
      {/* Floating orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">
          <SuperhumanOrb size="small" color="purple" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <SuperhumanOrb size="small" color="gold" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float-slow">
          <SuperhumanOrb size="small" color="cosmic" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export const TestCompletionCelebration = ({ testName, puzzlePiece }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <Card className="bg-gradient-to-br from-purple-900 to-indigo-900 border-purple-500/30 text-white max-w-md">
      <CardContent className="p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <SuperhumanOrb size="large" color="cosmic" />
            <div className="absolute -top-2 -right-2">
              <EnlightenmentSymbol />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
            Puzzle Unlocked!
          </h2>
          <p className="text-purple-200">
            You've discovered your <strong>{puzzlePiece}</strong> puzzle piece
          </p>
        </div>

        <div className="p-4 bg-purple-800/50 rounded-lg border border-purple-400/30">
          <div className="text-lg font-semibold">{testName}</div>
          <div className="text-sm text-purple-200">Complete</div>
        </div>

        <div className="text-sm text-purple-300">
          Each puzzle piece brings you closer to your superhuman potential
        </div>
      </CardContent>
    </Card>
  </div>
);

// CSS animations to add to your global styles
export const superhumanAnimations = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(180deg); }
  }

  @keyframes float-delayed {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(-180deg); }
  }

  @keyframes float-slow {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-8px) rotate(90deg); }
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-float-delayed {
    animation: float-delayed 8s ease-in-out infinite;
    animation-delay: -2s;
  }

  .animate-float-slow {
    animation: float-slow 10s ease-in-out infinite;
    animation-delay: -4s;
  }
`;

export default {
  SuperhumanOrb,
  EnlightenmentSymbol,
  PuzzlePiece,
  SuperhumanProgress,
  CosmicBackground,
  TestCompletionCelebration
};