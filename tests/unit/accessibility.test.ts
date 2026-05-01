import { renderHook, act } from '@testing-library/react';
import { useAccessibility, useKeyboardNavigation } from '../src/hooks/useAccessibility';

describe('Accessibility Hooks', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('useAccessibility', () => {
    it('should initialize with default settings', () => {
      const { result } = renderHook(() => useAccessibility());
      expect(result.current.settings.highContrast).toBe(false);
      expect(result.current.settings.fontSize).toBe('medium');
      expect(result.current.settings.screenReaderMode).toBe(false);
    });

    it('should toggle high contrast', () => {
      const { result } = renderHook(() => useAccessibility());
      act(() => {
        result.current.toggleHighContrast();
      });
      expect(result.current.settings.highContrast).toBe(true);
    });

    it('should change font size', () => {
      const { result } = renderHook(() => useAccessibility());
      act(() => {
        result.current.setFontSize('large');
      });
      expect(result.current.settings.fontSize).toBe('large');
    });

    it('should toggle screen reader mode', () => {
      const { result } = renderHook(() => useAccessibility());
      act(() => {
        result.current.toggleScreenReaderMode();
      });
      expect(result.current.settings.screenReaderMode).toBe(true);
    });

    it('should toggle keyboard navigation', () => {
      const { result } = renderHook(() => useAccessibility());
      act(() => {
        result.current.toggleKeyboardNavigationOnly();
      });
      expect(result.current.settings.keyboardNavigationOnly).toBe(true);
    });

    it('should toggle reduce motion', () => {
      const { result } = renderHook(() => useAccessibility());
      act(() => {
        result.current.toggleReduceMotion();
      });
      expect(result.current.settings.reduceMotion).toBe(true);
    });

    it('should persist settings to localStorage', () => {
      const { result } = renderHook(() => useAccessibility());
      act(() => {
        result.current.toggleHighContrast();
      });

      const saved = localStorage.getItem('election-guide-accessibility');
      expect(saved).toBeDefined();
      const parsed = JSON.parse(saved!);
      expect(parsed.highContrast).toBe(true);
    });

    it('should load settings from localStorage', () => {
      const settings = {
        highContrast: true,
        fontSize: 'large' as const,
        screenReaderMode: true,
        keyboardNavigationOnly: false,
        reduceMotion: false,
      };
      localStorage.setItem('election-guide-accessibility', JSON.stringify(settings));

      const { result } = renderHook(() => useAccessibility());

      // Wait for useEffect to run
      expect(result.current.settings.highContrast).toBe(true);
      expect(result.current.settings.fontSize).toBe('large');
    });

    it('should apply CSS variables', () => {
      renderHook(() => useAccessibility());
      // CSS variable setting happens in useEffect
      expect(document.documentElement.style.getPropertyValue('--font-size-multiplier')).toBe('1');
    });
  });
});
