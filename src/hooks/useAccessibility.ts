/**
 * Custom hook for accessibility features
 * Manages high contrast mode, font sizes, screen reader mode, and keyboard navigation
 */

import { useState, useEffect, useCallback } from 'react';
import { AccessibilitySettings } from '../types/index';
import { trackAccessibilityFeatureUsed } from '../services/analytics';

const ACCESSIBILITY_STORAGE_KEY = 'election-guide-accessibility';
const FONT_SIZE_VAR = '--font-size-multiplier';

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  fontSize: 'medium',
  screenReaderMode: false,
  keyboardNavigationOnly: false,
  reduceMotion: false,
};

/**
 * Hook for managing accessibility settings
 */
export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>(
    defaultSettings
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved accessibility settings
  useEffect(() => {
    const saved = localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse accessibility settings:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Apply settings to document
  useEffect(() => {
    if (!isLoaded) return;

    // Set high contrast mode
    if (settings.highContrast) {
      document.documentElement.setAttribute('data-contrast', 'high');
    } else {
      document.documentElement.removeAttribute('data-contrast');
    }

    // Set font size
    const fontMultipliers = {
      small: '0.875',
      medium: '1',
      large: '1.25',
    };
    document.documentElement.style.setProperty(
      FONT_SIZE_VAR,
      fontMultipliers[settings.fontSize]
    );

    // Set screen reader mode
    if (settings.screenReaderMode) {
      document.documentElement.setAttribute('data-screen-reader', 'true');
    } else {
      document.documentElement.removeAttribute('data-screen-reader');
    }

    // Set reduce motion preference
    if (settings.reduceMotion) {
      document.documentElement.style.setProperty('--reduce-motion', '1');
    } else {
      document.documentElement.style.removeProperty('--reduce-motion');
    }

    // Save to localStorage
    localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(settings));
  }, [settings, isLoaded]);

  // Toggle high contrast
  const toggleHighContrast = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      highContrast: !prev.highContrast,
    }));
    trackAccessibilityFeatureUsed('high_contrast_toggle');
  }, []);

  // Change font size
  const setFontSize = useCallback(
    (size: 'small' | 'medium' | 'large') => {
      if (size !== settings.fontSize) {
        setSettings((prev) => ({
          ...prev,
          fontSize: size,
        }));
        trackAccessibilityFeatureUsed(`font_size_${size}`);
      }
    },
    [settings.fontSize]
  );

  // Toggle screen reader mode
  const toggleScreenReaderMode = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      screenReaderMode: !prev.screenReaderMode,
    }));
    trackAccessibilityFeatureUsed('screen_reader_mode');
  }, []);

  // Toggle keyboard navigation only
  const toggleKeyboardNavigationOnly = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      keyboardNavigationOnly: !prev.keyboardNavigationOnly,
    }));
    trackAccessibilityFeatureUsed('keyboard_navigation_only');
  }, []);

  // Toggle reduce motion
  const toggleReduceMotion = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      reduceMotion: !prev.reduceMotion,
    }));
    trackAccessibilityFeatureUsed('reduce_motion');
  }, []);

  return {
    settings,
    isLoaded,
    toggleHighContrast,
    setFontSize,
    toggleScreenReaderMode,
    toggleKeyboardNavigationOnly,
    toggleReduceMotion,
  };
};

/**
 * Hook for keyboard navigation support
 */
export const useKeyboardNavigation = (enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Tab key handling is native
      // Escape key can be used to close modals
      if (event.key === 'Escape') {
        const activeElement = document.activeElement as HTMLElement;
        const closeButton = activeElement?.closest('[role="dialog"]')?.querySelector(
          '[aria-label="Close"]'
        ) as HTMLElement;
        if (closeButton) {
          closeButton.click();
        }
      }

      // Allow Enter to activate buttons even if not focused
      if (event.key === 'Enter' && !['INPUT', 'TEXTAREA'].includes(
        (event.target as HTMLElement).tagName
      )) {
        const target = event.target as HTMLElement;
        if (target.role === 'button' || target.tagName === 'BUTTON') {
          target.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
};

/**
 * Hook to announce content to screen readers
 */
export const useAriaLive = (message: string, live: 'polite' | 'assertive' = 'polite') => {
  useEffect(() => {
    if (!message) return;

    // Create or find live region
    let liveRegion = document.querySelector('[aria-live]') as HTMLDivElement;
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', live);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      document.body.appendChild(liveRegion);
    }

    liveRegion.textContent = message;
  }, [message, live]);
};

/**
 * Hook to manage focus
 */
export const useFocus = () => {
  const [element, setElement] = useState<HTMLElement | null>(null);

  const focus = useCallback((el: HTMLElement | null) => {
    if (el) {
      setTimeout(() => {
        el.focus();
        setElement(el);
      }, 0);
    }
  }, []);

  const focusId = useCallback((id: string) => {
    const el = document.getElementById(id);
    focus(el);
  }, [focus]);

  return { focus, focusId, element };
};
