import { useState, useCallback } from 'react';
import { useToast } from './use-toast';
import ApiService from '../services/api';

/**
 * Custom hook for API calls with loading states and error handling
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const execute = useCallback(async (apiCall, options = {}) => {
    const {
      loadingMessage,
      successMessage,
      errorMessage,
      showSuccess = false,
      showError = true,
      onSuccess,
      onError
    } = options;

    setLoading(true);
    setError(null);

    try {
      if (loadingMessage) {
        toast({
          title: loadingMessage,
          description: "Please wait...",
        });
      }

      const result = await apiCall();

      if (result.success) {
        if (successMessage && showSuccess) {
          toast({
            title: "Success",
            description: successMessage,
          });
        }
        
        if (onSuccess) {
          onSuccess(result);
        }
        
        return result;
      } else {
        throw new Error(result.error || 'API call failed');
      }
    } catch (err) {
      const errorMsg = err.message || errorMessage || 'An error occurred';
      setError(errorMsg);
      
      if (showError) {
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      }
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    error,
    execute,
    clearError: () => setError(null)
  };
};

/**
 * Hook specifically for test submissions with progress tracking
 */
export const useTestSubmission = () => {
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const submitTest = useCallback(async (testId, answers, userSession) => {
    setSubmitting(true);
    setProgress(0);

    try {
      // Simulate progress for UX
      setProgress(25);
      
      toast({
        title: "Analyzing your responses...",
        description: "AI is processing your personality assessment",
      });

      const result = await ApiService.submitTest(testId, answers, userSession);
      
      setProgress(75);
      
      if (result.success) {
        setProgress(100);
        
        toast({
          title: "Test completed!",
          description: "Your results are ready for viewing",
        });
        
        return result;
      } else {
        throw new Error(result.error || 'Test submission failed');
      }
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setSubmitting(false);
      setProgress(0);
    }
  }, [toast]);

  return {
    submitting,
    progress,
    submitTest
  };
};

/**
 * Hook for profile synthesis with detailed status tracking
 */
export const useProfileSynthesis = () => {
  const [synthesizing, setSynthesizing] = useState(false);
  const [synthesisProgress, setSynthesisProgress] = useState(0);
  const { toast } = useToast();

  const synthesizeProfile = useCallback(async (userSession, userGoals, regenerate = false) => {
    setSynthesizing(true);
    setSynthesisProgress(0);

    try {
      const actionText = regenerate ? "Regenerating" : "Creating";
      
      toast({
        title: `${actionText} your Personal Blueprint...`,
        description: "AI is analyzing your personality patterns",
      });

      setSynthesisProgress(25);

      const result = await ApiService.synthesizeProfile(userSession, userGoals, regenerate);
      
      setSynthesisProgress(75);

      if (result.success) {
        setSynthesisProgress(100);
        
        toast({
          title: "Blueprint ready!",
          description: `Your personalized insights are now available`,
        });
        
        return result;
      } else {
        throw new Error(result.error || 'Profile synthesis failed');
      }
    } catch (error) {
      toast({
        title: "Synthesis failed",
        description: error.message || "Unable to generate profile. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setSynthesizing(false);
      setSynthesisProgress(0);
    }
  }, [toast]);

  return {
    synthesizing,
    synthesisProgress,
    synthesizeProfile
  };
};

/**
 * Hook for daily content generation
 */
export const useDailyContent = () => {
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const generateDailyContent = useCallback(async (userSession, options = {}) => {
    setGenerating(true);

    try {
      if (options.showLoading !== false) {
        toast({
          title: "Generating daily content...",
          description: "Creating personalized guidance for you",
        });
      }

      const result = await ApiService.getDailyContent(
        userSession, 
        options.date, 
        options.focusArea
      );

      if (result.success) {
        if (options.showSuccess) {
          toast({
            title: "Daily content ready!",
            description: "Your personalized guidance is available",
          });
        }
        return result;
      } else {
        throw new Error(result.error || 'Failed to generate daily content');
      }
    } catch (error) {
      if (options.showError !== false) {
        toast({
          title: "Generation failed",
          description: error.message || "Unable to create daily content",
          variant: "destructive",
        });
      }
      throw error;
    } finally {
      setGenerating(false);
    }
  }, [toast]);

  return {
    generating,
    generateDailyContent
  };
};

export default useApi;