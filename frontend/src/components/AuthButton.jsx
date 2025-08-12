import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import { LogIn, LogOut, User, Settings, Crown } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import ApiService from '../services/api';

const AuthButton = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
    
    // Listen for auth changes from URL fragment
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes('session_id=')) {
        handleAuthCallback();
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Check on initial load
    if (window.location.hash.includes('session_id=')) {
      handleAuthCallback();
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.authenticated) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthCallback = async () => {
    try {
      // Parse session_id from URL fragment
      const hash = window.location.hash;
      const sessionMatch = hash.match(/session_id=([^&]+)/);
      
      if (sessionMatch) {
        const sessionId = sessionMatch[1];
        
        // Send session_id to backend for authentication
        const response = await fetch('/api/auth/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Session': localStorage.getItem('userSession') || ''
          },
          credentials: 'include',
          body: JSON.stringify({ session_id: sessionId })
        });

        const data = await response.json();
        
        if (data.success && data.user) {
          setUser(data.user);
          
          toast({
            title: "Welcome!",
            description: `Successfully logged in as ${data.user.name}`,
          });

          // Clear the hash and redirect to profile
          window.location.hash = '';
          window.location.href = '/profile';
        } else {
          toast({
            title: "Login failed",
            description: data.message || "Authentication failed",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      toast({
        title: "Authentication error",
        description: "Please try logging in again",
        variant: "destructive"
      });
    }
  };

  const handleLogin = () => {
    // Get current URL for redirect
    const currentUrl = window.location.href;
    const redirectUrl = `${window.location.origin}/profile`;
    
    // Redirect to Emergent Auth
    const authUrl = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
    window.location.href = authUrl;
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setUser(null);
        
        toast({
          title: "Logged out",
          description: "You have been successfully logged out",
        });

        // Redirect to home
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse"></div>
    );
  }

  if (!user) {
    return (
      <Button 
        onClick={handleLogin}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
      >
        <LogIn className="mr-2 h-4 w-4" />
        Unlock Access
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-purple-400">
            <AvatarImage src={user.picture} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          {user.is_premium && (
            <Crown className="absolute -top-1 -right-1 h-4 w-4 text-amber-400" />
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user.name}</p>
            <p className="w-[200px] truncate text-sm text-slate-600">
              {user.email}
            </p>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <a href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Your Blueprint</span>
          </a>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <a href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </a>
        </DropdownMenuItem>
        
        {user.is_premium && (
          <DropdownMenuItem className="text-amber-600">
            <Crown className="mr-2 h-4 w-4" />
            <span>Premium Member</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthButton;