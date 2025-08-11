/**
 * Utility functions for local storage management and data migration
 */

class StorageManager {
  // Keys for different data types
  static KEYS = {
    USER_SESSION: 'userSession',
    COMPLETED_TESTS: 'completedTests',
    USER_PREFERENCES: 'userPreferences',
    DAILY_COMPLETION: 'lastCompletedRoutine'
  };

  /**
   * Get user session ID
   */
  static getUserSession() {
    return localStorage.getItem(this.KEYS.USER_SESSION);
  }

  /**
   * Set user session ID
   */
  static setUserSession(sessionId) {
    localStorage.setItem(this.KEYS.USER_SESSION, sessionId);
  }

  /**
   * Get completed tests from localStorage (for migration)
   */
  static getCompletedTests() {
    try {
      const completed = localStorage.getItem(this.KEYS.COMPLETED_TESTS);
      return completed ? JSON.parse(completed) : [];
    } catch (error) {
      console.error('Error parsing completed tests:', error);
      return [];
    }
  }

  /**
   * Set completed tests
   */
  static setCompletedTests(testIds) {
    localStorage.setItem(this.KEYS.COMPLETED_TESTS, JSON.stringify(testIds));
  }

  /**
   * Add completed test
   */
  static addCompletedTest(testId) {
    const completed = this.getCompletedTests();
    if (!completed.includes(testId)) {
      completed.push(testId);
      this.setCompletedTests(completed);
    }
  }

  /**
   * Get test result from localStorage (for migration)
   */
  static getTestResult(testId) {
    try {
      const result = localStorage.getItem(`test_results_${testId}`);
      return result ? JSON.parse(result) : null;
    } catch (error) {
      console.error(`Error parsing test result for ${testId}:`, error);
      return null;
    }
  }

  /**
   * Get all test results from localStorage (for migration)
   */
  static getAllTestResults() {
    const results = {};
    const completed = this.getCompletedTests();
    
    completed.forEach(testId => {
      const result = this.getTestResult(testId);
      if (result) {
        results[testId] = result;
      }
    });
    
    return results;
  }

  /**
   * Get test progress from localStorage
   */
  static getTestProgress(testId) {
    try {
      const progress = localStorage.getItem(`test_progress_${testId}`);
      return progress ? JSON.parse(progress) : null;
    } catch (error) {
      console.error(`Error parsing test progress for ${testId}:`, error);
      return null;
    }
  }

  /**
   * Save test progress
   */
  static saveTestProgress(testId, currentQuestion, answers) {
    const progress = {
      currentQ: currentQuestion,
      savedAnswers: answers,
      timestamp: Date.now()
    };
    localStorage.setItem(`test_progress_${testId}`, JSON.stringify(progress));
  }

  /**
   * Clear test progress
   */
  static clearTestProgress(testId) {
    localStorage.removeItem(`test_progress_${testId}`);
  }

  /**
   * Get user preferences
   */
  static getUserPreferences() {
    try {
      const prefs = localStorage.getItem(this.KEYS.USER_PREFERENCES);
      return prefs ? JSON.parse(prefs) : {
        language: 'en',
        notifications: true,
        darkMode: false,
        soundEnabled: true,
        analyticsEnabled: false,
        fontSize: 'medium'
      };
    } catch (error) {
      console.error('Error parsing user preferences:', error);
      return {};
    }
  }

  /**
   * Save user preferences
   */
  static saveUserPreferences(preferences) {
    localStorage.setItem(this.KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  }

  /**
   * Check if daily routine was completed today
   */
  static isDailyRoutineCompleted() {
    const lastCompleted = localStorage.getItem(this.KEYS.DAILY_COMPLETION);
    const today = new Date().toDateString();
    return lastCompleted === today;
  }

  /**
   * Mark daily routine as completed
   */
  static markDailyRoutineCompleted() {
    const today = new Date().toDateString();
    localStorage.setItem(this.KEYS.DAILY_COMPLETION, today);
  }

  /**
   * Migrate data from localStorage to backend (when user first connects)
   */
  static async migrateToBackend(apiService, userSession) {
    try {
      const completedTests = this.getCompletedTests();
      const testResults = this.getAllTestResults();
      
      // If we have local data, we might want to migrate it
      if (completedTests.length > 0) {
        console.log('Found local test data for migration:', completedTests);
        
        // In a full implementation, you would:
        // 1. Submit each test result to the backend
        // 2. Verify the migration was successful
        // 3. Clear local data after successful migration
        
        // For now, we'll keep both local and backend data in sync
        return {
          migratedTests: completedTests.length,
          testResults: Object.keys(testResults).length
        };
      }
      
      return { migratedTests: 0, testResults: 0 };
    } catch (error) {
      console.error('Migration failed:', error);
      return { error: error.message };
    }
  }

  /**
   * Clear all app data
   */
  static clearAllData() {
    // Clear user session
    localStorage.removeItem(this.KEYS.USER_SESSION);
    
    // Clear completed tests
    localStorage.removeItem(this.KEYS.COMPLETED_TESTS);
    
    // Clear test results and progress
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('test_results_') || key.startsWith('test_progress_')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear daily completion
    localStorage.removeItem(this.KEYS.DAILY_COMPLETION);
    
    // Keep user preferences unless explicitly requested to clear
  }

  /**
   * Get storage usage statistics
   */
  static getStorageStats() {
    const completedTests = this.getCompletedTests();
    const testResults = this.getAllTestResults();
    
    return {
      completedTests: completedTests.length,
      testResults: Object.keys(testResults).length,
      hasProgress: Object.keys(localStorage).some(key => key.startsWith('test_progress_')),
      storageKeys: Object.keys(localStorage).length
    };
  }

  /**
   * Export all data for backup
   */
  static exportData() {
    const data = {
      userSession: this.getUserSession(),
      completedTests: this.getCompletedTests(),
      testResults: this.getAllTestResults(),
      preferences: this.getUserPreferences(),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    return data;
  }

  /**
   * Import data from backup
   */
  static importData(data) {
    try {
      if (data.userSession) {
        this.setUserSession(data.userSession);
      }
      
      if (data.completedTests) {
        this.setCompletedTests(data.completedTests);
      }
      
      if (data.testResults) {
        Object.entries(data.testResults).forEach(([testId, result]) => {
          localStorage.setItem(`test_results_${testId}`, JSON.stringify(result));
        });
      }
      
      if (data.preferences) {
        this.saveUserPreferences(data.preferences);
      }
      
      return { success: true, message: 'Data imported successfully' };
    } catch (error) {
      console.error('Import failed:', error);
      return { success: false, error: error.message };
    }
  }
}

export default StorageManager;