/**
 * IndexedDB Operations for Personal Blueprint AI
 * 
 * Local-first data storage for profiles, tests, synthesis, and premium content
 */

const DB_NAME = 'PersonalBlueprintDB';
const DB_VERSION = 1;

// Store names
export const STORES = {
  USER_PROFILE: 'userProfile',
  TEST_RESULTS: 'testResults',
  SYNTHESIS: 'synthesis',
  MEDITATIONS: 'meditations',
  AFFIRMATIONS: 'affirmations',
  HOROSCOPES: 'horoscopes',
  QA_HISTORY: 'qaHistory',
};

/**
 * Initialize IndexedDB database
 */
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // User Profile store
      if (!db.objectStoreNames.contains(STORES.USER_PROFILE)) {
        db.createObjectStore(STORES.USER_PROFILE, { keyPath: 'id' });
      }

      // Test Results store
      if (!db.objectStoreNames.contains(STORES.TEST_RESULTS)) {
        const testStore = db.createObjectStore(STORES.TEST_RESULTS, { keyPath: 'id', autoIncrement: true });
        testStore.createIndex('testType', 'testType', { unique: false });
        testStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Synthesis store
      if (!db.objectStoreNames.contains(STORES.SYNTHESIS)) {
        const synthesisStore = db.createObjectStore(STORES.SYNTHESIS, { keyPath: 'id', autoIncrement: true });
        synthesisStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Meditations store
      if (!db.objectStoreNames.contains(STORES.MEDITATIONS)) {
        const meditationStore = db.createObjectStore(STORES.MEDITATIONS, { keyPath: 'id', autoIncrement: true });
        meditationStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Affirmations store
      if (!db.objectStoreNames.contains(STORES.AFFIRMATIONS)) {
        const affirmationStore = db.createObjectStore(STORES.AFFIRMATIONS, { keyPath: 'id', autoIncrement: true });
        affirmationStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Horoscopes store
      if (!db.objectStoreNames.contains(STORES.HOROSCOPES)) {
        db.createObjectStore(STORES.HOROSCOPES, { keyPath: 'date' });
      }

      // Q&A History store
      if (!db.objectStoreNames.contains(STORES.QA_HISTORY)) {
        const qaStore = db.createObjectStore(STORES.QA_HISTORY, { keyPath: 'id', autoIncrement: true });
        qaStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
};

/**
 * Generic database operation wrapper
 */
const dbOperation = async (storeName, mode, operation) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], mode);
    const store = transaction.objectStore(storeName);
    const request = operation(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * User Profile Operations
 */
export const saveUserProfile = async (profile) => {
  return dbOperation(STORES.USER_PROFILE, 'readwrite', (store) => 
    store.put({ id: 'main', ...profile, updatedAt: new Date().toISOString() })
  );
};

export const getUserProfile = async () => {
  return dbOperation(STORES.USER_PROFILE, 'readonly', (store) => 
    store.get('main')
  );
};

export const clearUserProfile = async () => {
  return dbOperation(STORES.USER_PROFILE, 'readwrite', (store) => 
    store.delete('main')
  );
};

/**
 * Test Results Operations
 */
export const saveTestResult = async (testResult) => {
  const result = {
    ...testResult,
    createdAt: new Date().toISOString(),
  };
  return dbOperation(STORES.TEST_RESULTS, 'readwrite', (store) => 
    store.add(result)
  );
};

export const getAllTestResults = async () => {
  return dbOperation(STORES.TEST_RESULTS, 'readonly', (store) => 
    store.getAll()
  );
};

export const getTestResultsByType = async (testType) => {
  return dbOperation(STORES.TEST_RESULTS, 'readonly', (store) => {
    const index = store.index('testType');
    return index.getAll(testType);
  });
};

export const clearAllTests = async () => {
  return dbOperation(STORES.TEST_RESULTS, 'readwrite', (store) => 
    store.clear()
  );
};

/**
 * Synthesis Operations
 */
export const saveSynthesis = async (synthesis) => {
  const data = {
    ...synthesis,
    createdAt: new Date().toISOString(),
  };
  return dbOperation(STORES.SYNTHESIS, 'readwrite', (store) => 
    store.add(data)
  );
};

export const getLatestSynthesis = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.SYNTHESIS], 'readonly');
    const store = transaction.objectStore(STORES.SYNTHESIS);
    const index = store.index('createdAt');
    const request = index.openCursor(null, 'prev');

    request.onsuccess = () => {
      const cursor = request.result;
      resolve(cursor ? cursor.value : null);
    };
    request.onerror = () => reject(request.error);
  });
};

export const getAllSyntheses = async () => {
  return dbOperation(STORES.SYNTHESIS, 'readonly', (store) => 
    store.getAll()
  );
};

/**
 * Meditation Operations
 */
export const saveMeditation = async (meditation) => {
  const data = {
    ...meditation,
    createdAt: new Date().toISOString(),
  };
  return dbOperation(STORES.MEDITATIONS, 'readwrite', (store) => 
    store.add(data)
  );
};

export const getAllMeditations = async () => {
  return dbOperation(STORES.MEDITATIONS, 'readonly', (store) => 
    store.getAll()
  );
};

/**
 * Affirmation Operations
 */
export const saveAffirmations = async (affirmations) => {
  const data = {
    ...affirmations,
    createdAt: new Date().toISOString(),
  };
  return dbOperation(STORES.AFFIRMATIONS, 'readwrite', (store) => 
    store.add(data)
  );
};

export const getAllAffirmations = async () => {
  return dbOperation(STORES.AFFIRMATIONS, 'readonly', (store) => 
    store.getAll()
  );
};

/**
 * Horoscope Operations
 */
export const saveHoroscope = async (horoscope) => {
  const today = new Date().toISOString().split('T')[0];
  const data = {
    date: today,
    ...horoscope,
    createdAt: new Date().toISOString(),
  };
  return dbOperation(STORES.HOROSCOPES, 'readwrite', (store) => 
    store.put(data)
  );
};

export const getTodayHoroscope = async () => {
  const today = new Date().toISOString().split('T')[0];
  return dbOperation(STORES.HOROSCOPES, 'readonly', (store) => 
    store.get(today)
  );
};

/**
 * Q&A History Operations
 */
export const saveQAInteraction = async (question, answer) => {
  const data = {
    question,
    answer,
    createdAt: new Date().toISOString(),
  };
  return dbOperation(STORES.QA_HISTORY, 'readwrite', (store) => 
    store.add(data)
  );
};

export const getQAHistory = async (limit = 50) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.QA_HISTORY], 'readonly');
    const store = transaction.objectStore(STORES.QA_HISTORY);
    const index = store.index('createdAt');
    const request = index.openCursor(null, 'prev');
    const results = [];

    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor && results.length < limit) {
        results.push(cursor.value);
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    request.onerror = () => reject(request.error);
  });
};

/**
 * Premium Status Management (localStorage)
 */
export const setPremiumStatus = (isPremium) => {
  localStorage.setItem('pro', isPremium ? '1' : '0');
};

export const getPremiumStatus = () => {
  return localStorage.getItem('pro') === '1';
};

export const checkPremiumFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('pro') === '1') {
    setPremiumStatus(true);
    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
    return true;
  }
  return getPremiumStatus();
};

/**
 * Language Preference (localStorage)
 */
export const setLanguage = (lang) => {
  localStorage.setItem('language', lang);
};

export const getLanguage = () => {
  return localStorage.getItem('language') || 'en';
};

/**
 * Clear all data
 */
export const clearAllData = async () => {
  await clearUserProfile();
  await clearAllTests();
  await dbOperation(STORES.SYNTHESIS, 'readwrite', (store) => store.clear());
  await dbOperation(STORES.MEDITATIONS, 'readwrite', (store) => store.clear());
  await dbOperation(STORES.AFFIRMATIONS, 'readwrite', (store) => store.clear());
  await dbOperation(STORES.HOROSCOPES, 'readwrite', (store) => store.clear());
  await dbOperation(STORES.QA_HISTORY, 'readwrite', (store) => store.clear());
};

/**
 * Export data for backup
 */
export const exportAllData = async () => {
  const profile = await getUserProfile();
  const tests = await getAllTestResults();
  const syntheses = await getAllSyntheses();
  const meditations = await getAllMeditations();
  const affirmations = await getAllAffirmations();
  const qaHistory = await getQAHistory(1000);

  return {
    exportDate: new Date().toISOString(),
    profile,
    tests,
    syntheses,
    meditations,
    affirmations,
    qaHistory,
    premium: getPremiumStatus(),
    language: getLanguage(),
  };
};

/**
 * Import data from backup
 */
export const importData = async (data) => {
  if (data.profile) {
    await saveUserProfile(data.profile);
  }
  if (data.tests && Array.isArray(data.tests)) {
    for (const test of data.tests) {
      await saveTestResult(test);
    }
  }
  if (data.syntheses && Array.isArray(data.syntheses)) {
    for (const synthesis of data.syntheses) {
      await saveSynthesis(synthesis);
    }
  }
  if (data.meditations && Array.isArray(data.meditations)) {
    for (const meditation of data.meditations) {
      await saveMeditation(meditation);
    }
  }
  if (data.affirmations && Array.isArray(data.affirmations)) {
    for (const affirmation of data.affirmations) {
      await saveAffirmations(affirmation);
    }
  }
  if (data.premium !== undefined) {
    setPremiumStatus(data.premium);
  }
  if (data.language) {
    setLanguage(data.language);
  }
};
