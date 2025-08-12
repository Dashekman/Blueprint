import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Send, Brain, Sparkles, MessageCircle, Lightbulb, 
  Users, TrendingUp, Heart, Star, Zap 
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../hooks/use-toast';
import { SuperhumanOrb, CosmicBackground } from './SuperhumanTheme';
import ApiService from '../services/api';

const AICoach = ({ className = "" }) => {
  const { userSession } = useUser();
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickQuestions, setQuickQuestions] = useState([]);
  const [personalityContext, setPersonalityContext] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (userSession) {
      loadChatHistory();
      loadQuickQuestions();
      loadPersonalityContext();
    }
  }, [userSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatHistory = async () => {
    try {
      const response = await fetch(`/api/chat/history/${userSession}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.messages.map(msg => ({
          id: msg.id,
          type: 'user',
          content: msg.message,
          timestamp: msg.timestamp,
          response: {
            id: msg.id + '_response',
            type: 'assistant',
            content: msg.response,
            timestamp: msg.timestamp,
            contextUsed: msg.context_tests
          }
        })).flatMap(msg => [msg, msg.response]));
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const loadQuickQuestions = async () => {
    try {
      const response = await fetch('/api/chat/quick-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ user_session: userSession })
      });
      const data = await response.json();
      
      if (data.success) {
        setQuickQuestions(data.questions);
      }
    } catch (error) {
      console.error('Failed to load quick questions:', error);
    }
  };

  const loadPersonalityContext = async () => {
    try {
      const response = await fetch(`/api/chat/context/${userSession}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setPersonalityContext(data);
      }
    } catch (error) {
      console.error('Failed to load personality context:', error);
    }
  };

  const sendMessage = async (message = inputMessage) => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user_session: userSession,
          message: message,
          include_context: true
        })
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString(),
          contextUsed: data.context_used,
          confidence: data.confidence
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "Chat Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getPersonalityBadges = () => {
    if (!personalityContext?.context) return [];
    
    const badges = [];
    const context = personalityContext.context;
    
    Object.keys(context).forEach(testId => {
      if (testId !== 'unified_profile') {
        const test = context[testId];
        badges.push({
          text: `${testId.toUpperCase()}: ${test.type}`,
          color: getTestColor(testId)
        });
      }
    });

    return badges;
  };

  const getTestColor = (testId) => {
    const colors = {
      mbti: 'bg-purple-100 text-purple-800',
      enneagram: 'bg-rose-100 text-rose-800',
      disc: 'bg-emerald-100 text-emerald-800',
      humanDesign: 'bg-violet-100 text-violet-800',
      palmistry: 'bg-amber-100 text-amber-800'
    };
    return colors[testId] || 'bg-slate-100 text-slate-800';
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <Card className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-sm border-purple-500/30 text-white h-[600px] flex flex-col">
        {/* Header */}
        <CardHeader className="pb-4 border-b border-purple-500/20">
          <CardTitle className="flex items-center space-x-3">
            <div className="relative">
              <SuperhumanOrb size="small" color="cosmic" />
            </div>
            <div>
              <span className="text-xl">AI Personality Coach</span>
              <div className="text-sm text-purple-300 font-normal">
                Your personal guide to superhuman transformation
              </div>
            </div>
          </CardTitle>
          
          {/* Personality Context Badges */}
          {personalityContext && (
            <div className="flex flex-wrap gap-2 mt-3">
              {getPersonalityBadges().map((badge, index) => (
                <Badge key={index} className={badge.color} variant="outline">
                  {badge.text}
                </Badge>
              ))}
              {personalityContext.has_unified_profile && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Unified Profile
                </Badge>
              )}
            </div>
          )}
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 space-y-4">
              <SuperhumanOrb size="medium" color="enlightened" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-purple-300">
                  Welcome to Your AI Coach
                </h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  I'm here to help you understand your personality, unlock your potential, 
                  and guide you on your superhuman journey. Ask me anything!
                </p>
              </div>
              
              {/* Quick Questions */}
              {quickQuestions.length > 0 && (
                <div className="space-y-3">
                  <p className="text-purple-300 text-sm font-medium">
                    Try asking me:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {quickQuestions.slice(0, 4).map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-left text-xs p-2 h-auto border-purple-400/30 text-purple-300 hover:bg-purple-900/50"
                        onClick={() => sendMessage(question)}
                      >
                        <Lightbulb className="h-3 w-3 mr-2 flex-shrink-0" />
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                <Avatar className="flex-shrink-0">
                  <AvatarFallback className={`${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                  } text-white`}>
                    {message.type === 'user' ? <Users className="h-4 w-4" /> : <Brain className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`rounded-2xl p-4 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                    : message.isError
                    ? 'bg-red-900/50 border border-red-500/30'
                    : 'bg-slate-800/50 backdrop-blur-sm border border-slate-700'
                }`}>
                  <div className="text-sm leading-relaxed">
                    {message.content}
                  </div>
                  
                  {message.contextUsed && message.contextUsed.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-600">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-3 w-3 text-amber-400" />
                        <span className="text-xs text-amber-300">
                          Personalized using: {message.contextUsed.join(', ')}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {message.confidence && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <Star className="h-3 w-3 text-yellow-400" />
                        <span className="text-xs text-yellow-300">
                          Confidence: {Math.round(message.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-slate-400 mt-2">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    <Brain className="h-4 w-4 animate-pulse" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-slate-800/50 rounded-2xl p-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-purple-300">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input */}
        <div className="p-4 border-t border-purple-500/20">
          <div className="flex items-center space-x-3">
            <Input
              placeholder="Ask me about your personality, growth, or anything else..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
              disabled={isLoading}
            />
            <Button 
              onClick={() => sendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Quick Questions Row */}
          {quickQuestions.length > 0 && messages.length === 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {quickQuestions.slice(4, 8).map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-purple-300 hover:text-white hover:bg-purple-900/50"
                  onClick={() => sendMessage(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AICoach;