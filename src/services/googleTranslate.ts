/**
 * Google Cloud Translation API integration
 * Provides multi-language support for election content
 */

import { TranslationResponse, ApiResponse } from '../types/index';

// Supported languages
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', code: 'en-US' },
  es: { name: 'Spanish', code: 'es-ES' },
  fr: { name: 'French', code: 'fr-FR' },
  pt: { name: 'Portuguese', code: 'pt-BR' },
  zh: { name: 'Chinese (Simplified)', code: 'zh-CN' },
  ar: { name: 'Arabic', code: 'ar-SA' },
  vi: { name: 'Vietnamese', code: 'vi-VN' },
  ko: { name: 'Korean', code: 'ko-KR' },
};

/**
 * Translation cache to minimize API calls
 */
const translationCache = new Map<string, string>();

/**
 * Translate text to target language
 * @param text - Text to translate
 * @param targetLanguage - Target language code (e.g., 'es', 'fr')
 * @param sourceLanguage - Source language code (default 'en')
 * @returns Promise with translated text
 */
export const translateText = async (
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'en'
): Promise<ApiResponse<TranslationResponse>> => {
  try {
    // Return as-is if source and target are the same
    if (sourceLanguage === targetLanguage) {
      return {
        success: true,
        data: {
          translatedText: text,
          sourceLanguage,
          targetLanguage,
        },
        timestamp: Date.now(),
      };
    }

    // Check cache
    const cacheKey = `${text.substring(0, 50)}-${sourceLanguage}-${targetLanguage}`;
    if (translationCache.has(cacheKey)) {
      return {
        success: true,
        data: {
          translatedText: translationCache.get(cacheKey)!,
          sourceLanguage,
          targetLanguage,
        },
        timestamp: Date.now(),
      };
    }

    // Call translation API
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/translate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLanguage,
          sourceLanguage,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Cache the result
    translationCache.set(cacheKey, data.translatedText);

    return {
      success: true,
      data: {
        translatedText: data.translatedText,
        sourceLanguage,
        targetLanguage,
      },
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Translation failed:', error);
    return {
      success: false,
      error: `Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: Date.now(),
    };
  }
};

/**
 * Detect language of text
 * @param text - Text to detect language for
 * @returns Promise with detected language code
 */
export const detectLanguage = async (
  text: string
): Promise<ApiResponse<{ language: string }>> => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/detect-language`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok) {
      throw new Error(`Language detection error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: { language: data.language },
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Language detection failed:', error);
    return {
      success: false,
      error: `Language detection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: Date.now(),
    };
  }
};

/**
 * Batch translate multiple texts
 * @param texts - Array of texts to translate
 * @param targetLanguage - Target language code
 * @returns Promise with array of translated texts
 */
export const batchTranslate = async (
  texts: string[],
  targetLanguage: string
): Promise<ApiResponse<string[]>> => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/batch-translate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texts,
          targetLanguage,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Batch translation error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: data.translations,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Batch translation failed:', error);
    return {
      success: false,
      error: `Batch translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: Date.now(),
    };
  }
};

/**
 * Get all supported languages
 * @returns Object with language information
 */
export const getSupportedLanguages = () => {
  return SUPPORTED_LANGUAGES;
};

/**
 * Clear translation cache
 */
export const clearTranslationCache = (): void => {
  translationCache.clear();
};
