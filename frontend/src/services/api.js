import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000, // 30 seconds for AI operations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

class ApiService {
  // User session management
  static async createUserSession() {
    try {
      const response = await api.post('/user/session');
      return response.data;
    } catch (error) {
      console.error('Failed to create user session:', error);
      return { success: false, error: error.message };
    }
  }

  static async getUserSummary(userSession) {
    try {
      const response = await api.get(`/user/${userSession}/summary`);
      return response.data;
    } catch (error) {
      console.error('Failed to get user summary:', error);
      return { success: false, error: error.message };
    }
  }

  // Test management
  static async submitTest(testId, answers, userSession) {
    try {
      const response = await api.post(`/tests/${testId}/submit`, {
        test_id: testId,
        answers: answers,
        user_session: userSession
      });
      return response.data;
    } catch (error) {
      console.error('Failed to submit test:', error);
      return { success: false, error: error.message };
    }
  }

  static async getTestMetadata(testId) {
    try {
      const response = await api.get(`/tests/metadata/${testId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get test metadata:', error);
      return { success: false, error: error.message };
    }
  }

  // Profile management
  static async synthesizeProfile(userSession, userGoals = null, regenerate = false) {
    try {
      const response = await api.post('/profile/synthesize', {
        user_session: userSession,
        user_goals: userGoals,
        regenerate: regenerate
      });
      return response.data;
    } catch (error) {
      console.error('Failed to synthesize profile:', error);
      return { success: false, error: error.message };
    }
  }

  static async getUnifiedProfile(userSession) {
    try {
      const response = await api.get(`/profile/unified/${userSession}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get unified profile:', error);
      return { success: false, error: error.message };
    }
  }

  static async regenerateProfile(userSession, userGoals = null) {
    try {
      const response = await api.post(`/profile/regenerate/${userSession}`, null, {
        params: { user_goals: userGoals }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to regenerate profile:', error);
      return { success: false, error: error.message };
    }
  }

  static async getUserStats(userSession) {
    try {
      const response = await api.get(`/profile/stats/${userSession}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get user stats:', error);
      return { success: false, error: error.message };
    }
  }

  static async exportUserData(userSession) {
    try {
      const response = await api.get(`/profile/export/${userSession}`);
      return response.data;
    } catch (error) {
      console.error('Failed to export user data:', error);
      return { success: false, error: error.message };
    }
  }

  static async deleteUserData(userSession) {
    try {
      const response = await api.delete(`/profile/data/${userSession}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete user data:', error);
      return { success: false, error: error.message };
    }
  }

  // Daily content
  static async getDailyContent(userSession, targetDate = null, focusArea = null) {
    try {
      const params = {};
      if (targetDate) params.target_date = targetDate;
      if (focusArea) params.focus_area = focusArea;

      const response = await api.get(`/daily/content/${userSession}`, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to get daily content:', error);
      return { success: false, error: error.message };
    }
  }

  static async createDailyContent(userSession, date = null, focusArea = null) {
    try {
      const response = await api.post('/daily/content', {
        user_session: userSession,
        date: date,
        focus_area: focusArea
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create daily content:', error);
      return { success: false, error: error.message };
    }
  }

  static async getPersonalizedHoroscope(userSession, targetDate = null) {
    try {
      const params = targetDate ? { target_date: targetDate } : {};
      const response = await api.get(`/daily/horoscope/${userSession}`, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to get horoscope:', error);
      return { success: false, error: error.message };
    }
  }

  static async getDailyMantra(userSession, targetDate = null) {
    try {
      const params = targetDate ? { target_date: targetDate } : {};
      const response = await api.get(`/daily/mantra/${userSession}`, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to get mantra:', error);
      return { success: false, error: error.message };
    }
  }

  static async getMicroRoutine(userSession, targetDate = null) {
    try {
      const params = targetDate ? { target_date: targetDate } : {};
      const response = await api.get(`/daily/routine/${userSession}`, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to get routine:', error);
      return { success: false, error: error.message };
    }
  }

  static async getDailyMeditation(userSession, targetDate = null) {
    try {
      const params = targetDate ? { target_date: targetDate } : {};
      const response = await api.get(`/daily/meditation/${userSession}`, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to get meditation:', error);
      return { success: false, error: error.message };
    }
  }

  static async generateCustomMeditation(userSession, focusArea, duration = 7) {
    try {
      const response = await api.post('/daily/meditation/generate', null, {
        params: {
          user_session: userSession,
          focus_area: focusArea,
          duration: duration
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to generate custom meditation:', error);
      return { success: false, error: error.message };
    }
  }

  // Health check
  static async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      return { success: false, error: error.message };
    }
  }
}

export default ApiService;