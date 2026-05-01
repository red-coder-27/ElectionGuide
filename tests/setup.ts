import '@testing-library/jest-dom';

// Mock window.gtag for Google Analytics
(window as any).gtag = jest.fn();
(window as any).dataLayer = [];

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
});

// Mock Firebase
jest.mock('./services/firebase', () => ({
  auth: {},
  db: {},
  isUserAuthenticated: jest.fn().mockResolvedValue(true),
}));

// Mock Google Services
jest.mock('./services/googleTTS', () => ({
  synthesizeText: jest.fn().mockResolvedValue({
    success: true,
    data: { audioContent: 'test' },
  }),
  playAudio: jest.fn().mockResolvedValue(new Audio()),
  stopAudio: jest.fn(),
  getAvailableVoices: jest.fn().mockReturnValue(['en-US-Neural2-A']),
}));

jest.mock('./services/googleTranslate', () => ({
  translateText: jest.fn().mockResolvedValue({
    success: true,
    data: { translatedText: 'translated text' },
  }),
  getSupportedLanguages: jest.fn().mockReturnValue({
    en: { name: 'English', code: 'en-US' },
    es: { name: 'Spanish', code: 'es-ES' },
  }),
}));

// Mock Analytics
jest.mock('./services/analytics', () => ({
  initializeAnalytics: jest.fn(),
  trackPageView: jest.fn(),
  trackQuestionAsked: jest.fn(),
  trackStepCompleted: jest.fn(),
  trackTextToSpeechUsed: jest.fn(),
  trackAccessibilityFeatureUsed: jest.fn(),
  trackLanguageChange: jest.fn(),
  setUserProperties: jest.fn(),
}));
