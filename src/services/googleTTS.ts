/**
 * Web Speech API integration for Text-to-Speech
 * Provides natural audio synthesis using browser's built-in speech engine
 */

import { TextToSpeechConfig, TextToSpeechResponse, ApiResponse } from '../types/index';


/**
 * Current utterance being played
 */
let currentUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Get Speech Synthesis API safely
 */
const getSpeechSynthesis = (): SpeechSynthesis | null => {
  if (typeof window === 'undefined') return null;
  return window.speechSynthesis || (window as any).webkitSpeechSynthesis || null;
};

/**
 * Get Speech Synthesis Utterance constructor safely
 */
const getSpeechSynthesisUtterance = (): typeof SpeechSynthesisUtterance | null => {
  if (typeof window === 'undefined') return null;
  return (window.SpeechSynthesisUtterance || (window as any).webkitSpeechSynthesisUtterance) as any;
};

/**
 * Normalize language codes to locale tags supported by speech synthesis
 */
const normalizeLanguageCode = (languageCode?: string): string => {
  const code = (languageCode || 'en-US').trim();
  if (code === 'en') return 'en-US';
  if (code === 'es') return 'es-ES';
  if (code === 'fr') return 'fr-FR';
  if (code === 'pt') return 'pt-BR';
  if (code === 'en-GB' || code === 'es-ES' || code === 'fr-FR' || code === 'pt-BR') return code;
  return code.includes('-') ? code : 'en-US';
};

/**
 * Wait until browser voices are available
 */
const waitForVoices = (speechSynthesis: SpeechSynthesis): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    const timeout = window.setTimeout(() => resolve(speechSynthesis.getVoices()), 1200);
    speechSynthesis.onvoiceschanged = () => {
      window.clearTimeout(timeout);
      resolve(speechSynthesis.getVoices());
    };
  });
};

/**
 * Pick the best voice for the requested language
 */
const pickVoice = (voices: SpeechSynthesisVoice[], languageCode: string): SpeechSynthesisVoice | null => {
  const normalized = normalizeLanguageCode(languageCode);
  return (
    voices.find((voice) => voice.lang === normalized) ||
    voices.find((voice) => voice.lang.startsWith(normalized.split('-')[0])) ||
    voices.find((voice) => voice.default) ||
    voices[0] ||
    null
  );
};
/**
 * Language code mapping to voice URI
 */
const languageVoiceMap: { [key: string]: string } = {
  'en-US': 'en-US',
  'en-GB': 'en-GB',
  'es-ES': 'es-ES',
  'fr-FR': 'fr-FR',
  'pt-BR': 'pt-BR',
};

/**
 * Synthesize text to speech using Web Speech API
 * Returns a mock response (actual speech happens via synthesizeAndSpeak)
 */
export const synthesizeText = async (
  config: TextToSpeechConfig
): Promise<ApiResponse<TextToSpeechResponse>> => {
  try {
    return {
      success: true,
      data: {
        audioContent: config.text, // Store text for playback
      },
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Text-to-speech synthesis failed:', error);
    return {
      success: false,
      error: `Failed to synthesize speech: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: Date.now(),
    };
  }
};

/**
 * Play audio (text) using Web Speech API
 * @param audioContent - Text content to speak
 * @param languageCode - Language locale for speech synthesis
 * @returns Promise<HTMLAudioElement>
 */
export const playAudio = (audioContent: string, languageCode?: string): Promise<HTMLAudioElement> => {
  return new Promise((resolve, reject) => {
    try {
      const speechSynthesis = getSpeechSynthesis();
      const SpeechSynthesisUtterance = getSpeechSynthesisUtterance();

      if (!speechSynthesis || !SpeechSynthesisUtterance) {
        reject(new Error('Web Speech API not supported'));
        return;
      }

      // Create a fake audio element for compatibility
      const fakeAudio = new Audio();

      // Cancel any existing utterance and resume the speech engine
      speechSynthesis.cancel();
      speechSynthesis.resume();

      const utterance = new SpeechSynthesisUtterance(audioContent);
      const normalizedLanguage = normalizeLanguageCode(languageCode);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = normalizedLanguage;

      waitForVoices(speechSynthesis)
        .then((voices) => {
          const voice = pickVoice(voices, normalizedLanguage);
          if (voice) {
            utterance.voice = voice;
            utterance.lang = voice.lang || normalizedLanguage;
          }

          currentUtterance = utterance;
          speechSynthesis.speak(utterance);
        })
        .catch((voiceError) => {
          console.warn('Could not load browser voices:', voiceError);
          currentUtterance = utterance;
          speechSynthesis.speak(utterance);
        });

      utterance.onend = () => {
        currentUtterance = null;
        resolve(fakeAudio);
      };

      utterance.onerror = (event: any) => {
        console.error('Speech synthesis error:', event);
        currentUtterance = null;
        reject(new Error(`Speech synthesis failed: ${event.error}`));
      };

      // The speak call happens after voices are resolved above
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Stop currently playing audio
 * @param audio - Audio element to stop
 */
export const stopAudio = (audio: HTMLAudioElement | null) => {
  const speechSynthesis = getSpeechSynthesis();
  if (speechSynthesis) {
    speechSynthesis.cancel();
  }
  currentUtterance = null;
};

/**
 * Get available voices for a language
 * @param languageCode - Language code (e.g., 'en-US')
 * @returns Available voice names
 */
export const getAvailableVoices = (languageCode: string): string[] => {
  const voices: { [key: string]: string[] } = {
    'en-US': [
      'en-US-Neural2-A',
      'en-US-Neural2-C',
      'en-US-Neural2-E',
      'en-US-Neural2-F',
    ],
    'en-GB': ['en-GB-Neural2-A', 'en-GB-Neural2-B', 'en-GB-Neural2-D'],
    'es-ES': ['es-ES-Neural2-A', 'es-ES-Neural2-B', 'es-ES-Neural2-C'],
    'fr-FR': ['fr-FR-Neural2-A', 'fr-FR-Neural2-B', 'fr-FR-Neural2-C'],
    'pt-BR': [
      'pt-BR-Neural2-A',
      'pt-BR-Neural2-B',
      'pt-BR-Neural2-C',
      'pt-BR-Neural2-D',
    ],
  };

  return voices[languageCode] || voices['en-US'];
};

/**
 * Clear audio cache
 */
export const clearAudioCache = (): void => {
  // No cache in Web Speech API mode
};

