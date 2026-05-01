/**
 * Core type definitions for ElectionGuide AI application
 */

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  language: string;
  accessibilitySettings: AccessibilitySettings;
  createdAt: number;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  screenReaderMode: boolean;
  keyboardNavigationOnly: boolean;
  reduceMotion: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  question: string;
  answer: string;
  category: string;
  timestamp: number;
  language: string;
  helpful?: boolean;
}

export interface ElectionStep {
  id: string;
  title: string;
  description: string;
  date?: string;
  duration?: string;
  order: number;
  content: string;
  ariaLabel: string;
}

export interface TimelinePhase {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  description: string;
  icon: string;
  status: 'upcoming' | 'current' | 'completed';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'registration' | 'voting' | 'results' | 'eligibility' | 'accessibility';
  keywords: string[];
  translations: {
    [key: string]: { question: string; answer: string };
  };
}

export interface UserReminder {
  id: string;
  userId: string;
  message: string;
  dueDate: number;
  completed: boolean;
  createdAt: number;
}

export interface TextToSpeechConfig {
  text: string;
  languageCode: string;
  voiceName?: string;
  ssmlGender?: 'MALE' | 'FEMALE' | 'NEUTRAL';
  audioEncoding?: 'MP3' | 'LINEAR16' | 'OGG_OPUS';
}

export interface AnalyticsEvent {
  eventName: string;
  eventParams: {
    [key: string]: string | number | boolean;
  };
  userId?: string;
  timestamp: number;
}

export interface ChatAssistantState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  selectedLanguage: string;
}

export interface TimelineState {
  phases: TimelinePhase[];
  selectedPhase: TimelinePhase | null;
  isLoading: boolean;
}

export interface VoterGuideState {
  steps: ElectionStep[];
  currentStep: number;
  isLoading: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TextToSpeechResponse {
  audioContent: string; // Base64 encoded
  duration?: number;
}
