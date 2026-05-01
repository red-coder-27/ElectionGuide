/**
 * Language Selector Component
 * Allows users to select their preferred language
 */

import React, { useId, useState, useEffect } from 'react';
import { getSupportedLanguages } from '../../services/googleTranslate';
import { trackLanguageChange } from '../../services/analytics';
import styles from './LanguageSelector.module.css';

interface LanguageSelectorProps {
  onLanguageChange?: (languageCode: string) => void;
  defaultLanguage?: string;
}

/**
 * LanguageSelector component - allows users to select preferred language
 */
export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageChange,
  defaultLanguage = 'en',
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  const selectId = useId();
  const languages = getSupportedLanguages();

  useEffect(() => {
    // Load saved language preference
    const saved = localStorage.getItem('election-guide-language');
    if (saved) {
      setSelectedLanguage(saved);
    }
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    localStorage.setItem('election-guide-language', newLanguage);
    trackLanguageChange(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  return (
    <div className={styles.languageSelector} role="region" aria-label="Language selection">
      <label htmlFor={selectId} className={styles.label}>
        <span aria-hidden="true">🌐</span>
        Language:
      </label>
      <select
        id={selectId}
        value={selectedLanguage}
        onChange={handleLanguageChange}
        className={styles.select}
        aria-label="Select language"
      >
        {Object.entries(languages).map(([code, lang]) => (
          <option key={code} value={code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
