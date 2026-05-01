/**
 * Chat Assistant Component
 * Conversational AI interface for answering election-related questions
 */

import React, { useId, useState, useRef, useEffect, useCallback } from 'react';
import { useChatAssistant } from '../../hooks/useElectionData';
import { synthesizeText, stopAudio, playAudio } from '../../services/googleTTS';
import { trackQuestionAsked, trackTextToSpeechUsed } from '../../services/analytics';
import styles from './ChatAssistant.module.css';

interface ChatAssistantProps {
  userId: string;
  language?: string;
  onLanguageChange?: (language: string) => void;
}

/**
 * ChatAssistant component - interactive FAQ-based chat interface
 */
export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  userId,
  language = 'en',
  onLanguageChange,
}) => {
  const { messages, isLoading, error, askQuestion } = useChatAssistant();
  const [input, setInput] = useState('');
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const formId = useId();

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const trimmedInput = input.trim();
      if (!trimmedInput || isLoading) return;

      setInput('');
      trackQuestionAsked(trimmedInput, 'user_question');
      await askQuestion(trimmedInput, userId, language);
    },
    [input, isLoading, userId, language, askQuestion]
  );

  // Handle TextToSpeech
  const handleTextToSpeech = useCallback(
    async (text: string, stepName: string) => {
      if (currentAudio && isPlayingTTS) {
        stopAudio(currentAudio);
        setIsPlayingTTS(false);
        setCurrentAudio(null);
        return;
      }

      setIsPlayingTTS(true);
      trackTextToSpeechUsed(stepName);

      try {
        const result = await synthesizeText({
          text,
          languageCode: language,
        });

        if (result.success && result.data) {
          const audio = await playAudio(result.data.audioContent, language);
          setCurrentAudio(audio);
          audio.onended = () => {
            setIsPlayingTTS(false);
            setCurrentAudio(null);
          };
        } else {
          setIsPlayingTTS(false);
        }
      } catch (err) {
        console.error('TTS error:', err);
        setIsPlayingTTS(false);
      }
    },
    [currentAudio, isPlayingTTS, language]
  );

  return (
    <div
      className={styles.chatAssistant}
      role="main"
      id="main-content"
      aria-label="Election guide question assistant"
    >
      <div className={styles.header}>
        <h1 className={styles.title}>Election Guide Assistant</h1>
        <p className={styles.subtitle}>Ask me anything about the election process</p>
      </div>

      {/* Messages Container */}
      <div className={styles.messagesContainer} role="region" aria-label="Chat messages">
        {messages.length === 0 && !error && (
          <div className={styles.welcomeMessage} role="status" aria-live="polite">
            <div className={styles.messageBox} role="article">
              <h2>Welcome!</h2>
              <p>
                I'm your election guide assistant. Ask me anything about:
              </p>
              <ul>
                <li>Voter registration</li>
                <li>Your rights and eligibility</li>
                <li>Finding your polling location</li>
                <li>The voting process</li>
                <li>How votes are counted</li>
                <li>Election results</li>
              </ul>
              <p>Just type your question below!</p>
            </div>
          </div>
        )}

        {/* Display Messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={styles.messageGroup}
            role="article"
          >
            {/* User Question */}
            <div className={styles.message} role="status">
              <div className={`${styles.messageContent} ${styles.userMessage}`}>
                <strong>You:</strong>
                <p>{message.question}</p>
              </div>
            </div>

            {/* Assistant Answer */}
            <div className={styles.message} role="region" aria-label="Assistant response">
              <div className={`${styles.messageContent} ${styles.assistantMessage}`}>
                <strong>Assistant:</strong>
                <p>{message.answer}</p>

                {/* TTS Button */}
                <button
                  className={`${styles.ttsButton} ${isPlayingTTS ? styles.playing : ''}`}
                  onClick={() => handleTextToSpeech(message.answer, 'answer')}
                  aria-label={isPlayingTTS ? 'Stop reading answer' : 'Read answer aloud'}
                  title={isPlayingTTS ? 'Stop reading' : 'Read aloud'}
                >
                  <span aria-hidden="true">{isPlayingTTS ? '⏸️' : '🔊'}</span>
                  {isPlayingTTS ? 'Stop' : 'Read Aloud'}
                </button>

                {/* Category Badge */}
                <span
                  className={styles.categoryBadge}
                  role="status"
                  aria-label={`Category: ${message.category}`}
                >
                  {message.category}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Loading State */}
        {isLoading && (
          <div className={styles.message} role="status" aria-live="polite">
            <div className={`${styles.messageContent} ${styles.loadingMessage}`}>
              <div className={styles.loadingDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className={styles.srOnly}>Loading response...</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            className={styles.message}
            role="alert"
            aria-live="assertive"
          >
            <div className={`${styles.messageContent} ${styles.errorMessage}`}>
              <strong>⚠️ Error:</strong>
              <p>{error}</p>
              <p>
                Try rephrasing your question or visit{' '}
                <a href="#" onClick={(e) => e.preventDefault()}>
                  election resources
                </a>
                {' '}for more information.
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className={styles.form}
        id={formId}
        role="search"
        aria-label="Ask a question"
      >
        <div className={styles.inputWrapper}>
          <label htmlFor={inputId} className={styles.srOnly}>
            Type your election question
          </label>
          <input
            id={inputId}
            type="text"
            value={input}
            onChange={(e) => setInput(e.currentTarget.value.slice(0, 500))}
            placeholder="Ask me anything about voting, registration, or the election process..."
            disabled={isLoading}
            className={styles.input}
            maxLength={500}
            autoComplete="off"
            aria-label="Question input"
            aria-describedby="char-count"
          />
          <div id="char-count" className={styles.charCount}>
            {input.length} / 500
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={styles.submitButton}
          aria-label={isLoading ? 'Sending question...' : 'Send question'}
        >
          <span aria-hidden="true">{isLoading ? '⏳' : '➤'}</span>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>

      {/* Info Text */}
      <div className={styles.infoText} role="doc-tip">
        <p>
          💡 <strong>Tip:</strong> Ask natural questions like "How do I register to vote?" 
          or "What ID do I need?" for best results.
        </p>
      </div>
    </div>
  );
};

export default ChatAssistant;
