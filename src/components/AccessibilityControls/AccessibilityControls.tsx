/**
 * Accessibility Controls Component
 * Allows users to enable/disable accessibility features
 */

import React, { useId } from 'react';
import { useAccessibility } from '../../hooks/useAccessibility';
import styles from './AccessibilityControls.module.css';

/**
 * AccessibilityControls component - provides easy access to all accessibility settings
 */
export const AccessibilityControls: React.FC = () => {
  const {
    settings,
    toggleHighContrast,
    setFontSize,
    toggleScreenReaderMode,
    toggleKeyboardNavigationOnly,
    toggleReduceMotion,
  } = useAccessibility();

  const buttonId = useId();

  return (
    <div
      className={styles.accessibilityControls}
      role="region"
      aria-label="Accessibility controls"
    >
      <details className={styles.details}>
        <summary className={styles.summary} id={`${buttonId}-summary`}>
          <span aria-hidden="true">♿</span>
          <span>Accessibility Options</span>
        </summary>

        <div className={styles.content}>
          {/* High Contrast Toggle */}
          <div className={styles.setting}>
            <button
              className={`${styles.button} ${
                settings.highContrast ? styles.active : ''
              }`}
              onClick={toggleHighContrast}
              aria-pressed={settings.highContrast}
              aria-label="Toggle high contrast mode"
              title="Toggle high contrast mode for better visibility"
            >
              <span aria-hidden="true">◐</span> High Contrast
            </button>
          </div>

          {/* Font Size Controls */}
          <div className={styles.setting}>
            <label htmlFor={`${buttonId}-font-size`} className={styles.label}>
              Font Size:
            </label>
            <div className={styles.buttonGroup} role="group" aria-label="Font size options">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  className={`${styles.button} ${
                    settings.fontSize === size ? styles.active : ''
                  }`}
                  onClick={() => setFontSize(size)}
                  aria-pressed={settings.fontSize === size}
                  aria-label={`Set font size to ${size}`}
                >
                  {size === 'small' && 'A'}
                  {size === 'medium' && 'A'}
                  {size === 'large' && 'A'}
                </button>
              ))}
            </div>
          </div>

          {/* Screen Reader Mode */}
          <div className={styles.setting}>
            <button
              className={`${styles.button} ${
                settings.screenReaderMode ? styles.active : ''
              }`}
              onClick={toggleScreenReaderMode}
              aria-pressed={settings.screenReaderMode}
              aria-label="Toggle screen reader mode"
              title="Optimize interface for screen reader users"
            >
              <span aria-hidden="true">🔊</span> Screen Reader Mode
            </button>
          </div>

          {/* Keyboard Navigation */}
          <div className={styles.setting}>
            <button
              className={`${styles.button} ${
                settings.keyboardNavigationOnly ? styles.active : ''
              }`}
              onClick={toggleKeyboardNavigationOnly}
              aria-pressed={settings.keyboardNavigationOnly}
              aria-label="Toggle keyboard-only navigation"
              title="Navigate using only keyboard (Tab, Enter, Arrow keys)"
            >
              <span aria-hidden="true">⌨️</span> Keyboard Navigation
            </button>
          </div>

          {/* Reduce Motion */}
          <div className={styles.setting}>
            <button
              className={`${styles.button} ${
                settings.reduceMotion ? styles.active : ''
              }`}
              onClick={toggleReduceMotion}
              aria-pressed={settings.reduceMotion}
              aria-label="Toggle reduced motion mode"
              title="Reduce animations and motion effects"
            >
              <span aria-hidden="true">⏸️</span> Reduce Motion
            </button>
          </div>

          {/* Help Text */}
          <div className={styles.helpText} role="doc-tip">
            <p>
              <strong>Keyboard Shortcuts:</strong> Press Tab to navigate, Enter or Space to
              activate buttons. Press M to toggle this panel.
            </p>
          </div>
        </div>
      </details>
    </div>
  );
};

export default AccessibilityControls;
