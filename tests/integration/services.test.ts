import { synthesizeText, getAvailableVoices } from '../src/services/googleTTS';
import { translateText, getSupportedLanguages, detectLanguage } from '../src/services/googleTranslate';
import { trackPageView, trackQuestionAsked, trackStepCompleted } from '../src/services/analytics';

describe('Google Services Integration', () => {
  describe('Text-to-Speech Service', () => {
    it('should successfully synthesize text', async () => {
      const result = await synthesizeText({
        text: 'How do I vote?',
        languageCode: 'en-US',
      });

      expect(result.success).toBe(true);
      expect(result.data?.audioContent).toBeDefined();
    });

    it('should cache audio responses', async () => {
      const result1 = await synthesizeText({
        text: 'Test text',
        languageCode: 'en-US',
      });

      const result2 = await synthesizeText({
        text: 'Test text',
        languageCode: 'en-US',
      });

      expect(result1.data?.audioContent).toBe(result2.data?.audioContent);
    });

    it('should get available voices for language', () => {
      const voices = getAvailableVoices('en-US');
      expect(Array.isArray(voices)).toBe(true);
      expect(voices.length).toBeGreaterThan(0);
    });

    it('should handle TTS configuration', async () => {
      const result = await synthesizeText({
        text: 'Election guide text',
        languageCode: 'es-ES',
        voiceName: 'es-ES-Neural2-A',
        ssmlGender: 'FEMALE',
        audioEncoding: 'MP3',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('Translation Service', () => {
    it('should successfully translate text', async () => {
      const result = await translateText(
        'How do I register to vote?',
        'es',
        'en'
      );

      expect(result.success).toBe(true);
      expect(result.data?.translatedText).toBeDefined();
    });

    it('should return same text if source equals target', async () => {
      const text = 'Sample text';
      const result = await translateText(text, 'en', 'en');

      expect(result.success).toBe(true);
      expect(result.data?.translatedText).toBe(text);
    });

    it('should get supported languages', () => {
      const languages = getSupportedLanguages();
      expect(languages.en).toBeDefined();
      expect(languages.es).toBeDefined();
      expect(languages.fr).toBeDefined();
    });

    it('should detect language', async () => {
      const result = await detectLanguage('¿Cómo voto?');
      expect(result.success).toBe(true);
      expect(result.data?.language).toBeDefined();
    });
  });

  describe('Analytics Service', () => {
    it('should track page view', () => {
      trackPageView('/election-guide', 'Election Guide');
      expect(window.gtag).toHaveBeenCalled();
    });

    it('should track question asked', () => {
      trackQuestionAsked('How do I register?', 'registration');
      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'question_asked',
        expect.objectContaining({
          question: 'How do I register?',
          category: 'registration',
        })
      );
    });

    it('should track step completed', () => {
      trackStepCompleted('Check Eligibility', 1);
      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'step_completed',
        expect.objectContaining({
          step_name: 'Check Eligibility',
          step_number: 1,
        })
      );
    });
  });
});
