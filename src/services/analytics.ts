/**
 * Google Analytics 4 integration
 * Tracks user interactions and engagement metrics
 */

import { AnalyticsEvent } from '../types/index';

declare global {
  interface Window {
    gtag: any;
    dataLayer: any[];
  }
}

/**
 * Initialize Google Analytics 4
 */
export const initializeAnalytics = () => {
  const measurementId = process.env.REACT_APP_GA4_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('GA4 Measurement ID not configured');
    return;
  }

  // Load GTM script dynamically
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];

  function gtag(
    ...args: [action: string, value?: any, ...rest: any[]]
  ): void {
    window.dataLayer.push(arguments);
  }

  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', measurementId);
};

/**
 * Track a page view event
 * @param pagePath - Path of the page
 * @param pageTitle - Title of the page
 */
export const trackPageView = (pagePath: string, pageTitle: string) => {
  if (!window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  });
};

/**
 * Track when user asks a question
 * @param question - The question asked
 * @param category - Question category
 */
export const trackQuestionAsked = (question: string, category: string) => {
  if (!window.gtag) return;

  window.gtag('event', 'question_asked', {
    question,
    category,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track when user completes an election step
 * @param stepName - Name of the step
 * @param stepNumber - Order number of the step
 */
export const trackStepCompleted = (stepName: string, stepNumber: number) => {
  if (!window.gtag) return;

  window.gtag('event', 'step_completed', {
    step_name: stepName,
    step_number: stepNumber,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track user interaction with accessibility features
 * @param feature - Accessibility feature used
 */
export const trackAccessibilityFeatureUsed = (feature: string) => {
  if (!window.gtag) return;

  window.gtag('event', 'accessibility_feature_used', {
    feature,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track language change
 * @param language - Language code
 */
export const trackLanguageChange = (language: string) => {
  if (!window.gtag) return;

  window.gtag('event', 'language_changed', {
    language,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track TTS usage
 * @param stepName - Name of step being read
 */
export const trackTextToSpeechUsed = (stepName: string) => {
  if (!window.gtag) return;

  window.gtag('event', 'text_to_speech_used', {
    step_name: stepName,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track user registration/login
 * @param method - Registration/login method
 */
export const trackUserSignup = (method: string) => {
  if (!window.gtag) return;

  window.gtag('event', 'sign_up', {
    method,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track user login
 * @param method - Login method
 */
export const trackUserLogin = (method: string) => {
  if (!window.gtag) return;

  window.gtag('event', 'login', {
    method,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track custom event
 * @param eventName - Name of the event
 * @param eventParams - Event parameters
 */
export const trackCustomEvent = (eventName: string, eventParams?: { [key: string]: any }) => {
  if (!window.gtag) return;

  window.gtag('event', eventName, {
    ...eventParams,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Set user properties
 * @param userId - User ID
 * @param properties - Additional user properties
 */
export const setUserProperties = (userId: string, properties?: { [key: string]: any }) => {
  if (!window.gtag) return;

  window.gtag('config', process.env.REACT_APP_GA4_MEASUREMENT_ID, {
    user_id: userId,
    ...properties,
  });
};

/**
 * Track exception/error
 * @param description - Error description
 * @param fatal - Whether the error is fatal
 */
export const trackException = (description: string, fatal: boolean = false) => {
  if (!window.gtag) return;

  window.gtag('event', 'exception', {
    description,
    fatal,
    timestamp: new Date().toISOString(),
  });
};
