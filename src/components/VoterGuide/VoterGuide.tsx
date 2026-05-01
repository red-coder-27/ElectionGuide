/**
 * Voter Guide Component
 * Comprehensive step-by-step guide for the voting process
 */

import React, { useId, useState } from 'react';
import { useVoterGuide } from '../../hooks/useElectionData';
import { synthesizeText, playAudio, stopAudio } from '../../services/googleTTS';
import { trackStepCompleted, trackTextToSpeechUsed } from '../../services/analytics';
import styles from './VoterGuide.module.css';

interface VoterGuideProps {
  language?: string;
}

/**
 * VoterGuide component - step-by-step voter registration and voting guide
 */
export const VoterGuide: React.FC<VoterGuideProps> = ({ language = 'en' }) => {
  const { steps, currentStep, isLoading, goToStep, nextStep, previousStep } =
    useVoterGuide();
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const headingId = useId();
  const progressId = useId();

  const handleStepComplete = () => {
    if (steps[currentStep]) {
      setCompletedSteps((prev) => {
        const next = new Set(prev);
        next.add(currentStep);
        return next;
      });
      trackStepCompleted(steps[currentStep].title, currentStep + 1);
    }
  };

  const handleTextToSpeech = async (text: string, stepName: string) => {
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
  };

  if (isLoading || steps.length === 0) {
    return (
      <section className={styles.voterGuide} role="region" aria-label="Voter guide">
        <div className={styles.loading}>Loading voter guide...</div>
      </section>
    );
  }

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <section
      className={styles.voterGuide}
      role="region"
      aria-labelledby={headingId}
      aria-label="Step-by-step voting guide"
    >
      <div className={styles.header}>
        <h2 id={headingId} className={styles.title}>
          📋 Voter Guide
        </h2>
        <p className={styles.subtitle}>
          Complete guide from registration to casting your vote
        </p>
      </div>

      {/* Progress Bar */}
      <div
        className={styles.progressContainer}
        aria-describedby={progressId}
      >
        <div className={styles.progressLabel} id={progressId}>
          Step {currentStep + 1} of {steps.length}: {currentStepData.title}
        </div>
        <progress
          className={styles.progressBar}
          value={currentStep + 1}
          max={steps.length}
          aria-label={`Step ${currentStep + 1} of ${steps.length}`}
        />
      </div>

      {/* Step Navigation - Step List */}
      <nav className={styles.stepNav} aria-label="Voting steps">
        <ol className={styles.stepList}>
          {steps.map((step, index) => (
            <li key={step.id}>
              <button
                className={`${styles.stepButton} ${
                  index === currentStep ? styles.active : ''
                } ${completedSteps.has(index) ? styles.completed : ''}`}
                onClick={() => goToStep(index)}
                aria-current={index === currentStep ? 'step' : undefined}
                aria-label={`Step ${index + 1}: ${step.title}${
                  completedSteps.has(index) ? ' - completed' : ''
                }`}
              >
                <span className={styles.stepNumber}>{index + 1}</span>
                <span className={styles.stepTitle}>{step.title}</span>
                {completedSteps.has(index) && (
                  <span className={styles.checkmark} aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {/* Current Step Content */}
      <article className={styles.stepContent} role="region" aria-live="polite">
        <div className={styles.stepHeader}>
          <h3 className={styles.stepTitle}>{currentStepData.title}</h3>
          <p className={styles.stepDescription}>{currentStepData.description}</p>

          {currentStepData.date && (
            <div className={styles.stepDate} role="complementary">
              <strong>Timing:</strong> {currentStepData.date}
            </div>
          )}
        </div>

        {/* Step Content */}
        <div className={styles.stepBody}>
          {currentStepData.content.split('\n').map((paragraph, i) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;

            if (trimmed.startsWith('-')) {
              return (
                <div key={i} className={styles.contentLi}>
                  {trimmed.substring(1).trim()}
                </div>
              );
            }

            if (trimmed.match(/^\d+\./)) {
              return (
                <div key={i} className={styles.contentLi}>
                  {trimmed}
                </div>
              );
            }

            if (trimmed === '') return null;

            return (
              <p key={i} className={styles.contentP}>
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* TTS Button */}
        <div className={styles.stepActions}>
          <button
            className={`${styles.ttsButton} ${isPlayingTTS ? styles.playing : ''}`}
            onClick={() =>
              handleTextToSpeech(currentStepData.content, currentStepData.title)
            }
            aria-label={isPlayingTTS ? 'Stop reading step' : 'Read step aloud'}
          >
            <span aria-hidden="true">{isPlayingTTS ? '⏸️' : '🔊'}</span>
            {isPlayingTTS ? 'Stop Reading' : 'Read Aloud'}
          </button>

          {/* Mark as Complete */}
          <button
            className={`${styles.completeButton} ${
              completedSteps.has(currentStep) ? styles.completed : ''
            }`}
            onClick={handleStepComplete}
            aria-label={
              completedSteps.has(currentStep)
                ? `Undo marking step as complete`
                : `Mark step "${currentStepData.title}" as complete`
            }
          >
            <span aria-hidden="true">
              {completedSteps.has(currentStep) ? '✓' : '☐'}
            </span>
            {completedSteps.has(currentStep) ? 'Completed' : 'Mark Complete'}
          </button>
        </div>
      </article>

      {/* Navigation Buttons */}
      <div className={styles.navigator}>
        <button
          onClick={previousStep}
          disabled={currentStep === 0}
          className={styles.navButton}
          aria-label="Go to previous step"
        >
          <span aria-hidden="true">←</span> Previous
        </button>

        <div className={styles.stepIndicator} role="status">
          Step <strong>{currentStep + 1}</strong> of <strong>{steps.length}</strong>
        </div>

        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className={styles.navButton}
          aria-label="Go to next step"
        >
          Next <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Completion Badge */}
      {completedSteps.size === steps.length && (
        <div className={styles.completionBadge} role="alert" aria-live="polite">
          <span aria-hidden="true">🎉</span>
          <strong>Great job!</strong> You've completed all steps of the voter guide.
          You're ready to vote!
        </div>
      )}

      {/* Help Text */}
      <div className={styles.helpText} role="doc-tip">
        <p>
          <strong>💡 Tip:</strong> Use the step list on the left to jump to any step.
          Mark steps as complete to track your progress.
        </p>
      </div>
    </section>
  );
};

export default VoterGuide;
