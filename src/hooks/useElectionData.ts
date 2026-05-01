/**
 * Custom hook for election data management
 * Fetches and manages election content, timeline, and voter guide data
 */

import { useState, useEffect, useCallback } from 'react';
import {
  ChatMessage,
  TimelinePhase,
  ElectionStep,
  TimelineState,
  VoterGuideState,
} from '../types/index';
import {
  createElectionTimeline,
  createVoterGuideSteps,
} from '../utils/dateHelpers';
import { findBestMatch } from '../utils/faqMatcher';

/**
 * Hook for fetching and managing election timeline data
 */
export const useElectionTimeline = (electionDate: Date = new Date(2024, 10, 5)) => {
  const [state, setstate] = useState<TimelineState>({
    phases: [],
    selectedPhase: null,
    isLoading: true,
  });

  useEffect(() => {
    // Simulate async data fetch
    setTimeout(() => {
      const phases = createElectionTimeline(electionDate);
      setstate({
        phases,
        selectedPhase: phases.find((p) => p.status === 'current') || phases[0],
        isLoading: false,
      });
    }, 300);
  }, [electionDate]);

  const selectPhase = useCallback((phaseId: string) => {
    setstate((prev) => ({
      ...prev,
      selectedPhase:
        prev.phases.find((p) => p.id === phaseId) || prev.selectedPhase,
    }));
  }, []);

  return {
    phases: state.phases,
    selectedPhase: state.selectedPhase,
    isLoading: state.isLoading,
    selectPhase,
  };
};

/**
 * Hook for fetching and managing voter guide steps
 */
export const useVoterGuide = () => {
  const [state, setstate] = useState<VoterGuideState>({
    steps: [],
    currentStep: 0,
    isLoading: true,
  });

  useEffect(() => {
    // Simulate async data fetch
    setTimeout(() => {
      const steps = createVoterGuideSteps();
      setstate({
        steps,
        currentStep: 0,
        isLoading: false,
      });
    }, 300);
  }, []);

  const goToStep = useCallback((stepNumber: number) => {
    setstate((prev) => ({
      ...prev,
      currentStep: Math.max(0, Math.min(stepNumber, prev.steps.length - 1)),
    }));
  }, []);

  const nextStep = useCallback(() => {
    setstate((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, prev.steps.length - 1),
    }));
  }, []);

  const previousStep = useCallback(() => {
    setstate((prev) => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
    }));
  }, []);

  return {
    steps: state.steps,
    currentStep: state.currentStep,
    isLoading: state.isLoading,
    goToStep,
    nextStep,
    previousStep,
  };
};

/**
 * Hook for chat assistant functionality
 */
export const useChatAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const askQuestion = useCallback(
    async (
      question: string,
      userId: string,
      language: string = 'en'
    ): Promise<ChatMessage | null> => {
      setError(null);
      setIsLoading(true);

      try {
        // Find best FAQ match
        const faqMatch = findBestMatch(question, language);

        if (!faqMatch) {
          setError('Could not find an answer to your question. Please try rephrasing.');
          setIsLoading(false);
          return null;
        }

        // Create response message
        const responseMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          userId,
          question,
          answer: faqMatch.answer,
          category: faqMatch.category,
          timestamp: Date.now(),
          language,
        };

        addMessage(responseMessage);
        setIsLoading(false);

        return responseMessage;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to process question';
        setError(errorMessage);
        setIsLoading(false);
        return null;
      }
    },
    [addMessage]
  );

  return {
    messages,
    isLoading,
    error,
    addMessage,
    clearMessages,
    askQuestion,
  };
};

/**
 * Hook for managing saved reminders ( election milestones)
 */
export const useElectionReminders = () => {
  const [reminders, setReminders] = useState<
    Array<{ id: string; title: string; dueDate: Date; completed: boolean }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load reminders from localStorage
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        const saved = localStorage.getItem('election-reminders');
        if (saved) {
          const parsed = JSON.parse(saved).map((r: any) => ({
            ...r,
            dueDate: new Date(r.dueDate),
          }));
          setReminders(parsed);
        }
      } catch (err) {
        console.error('Failed to load reminders:', err);
      }
      setIsLoading(false);
    }, 300);
  }, []);

  const addReminder = useCallback(
    (title: string, dueDate: Date) => {
      const reminder = {
        id: `reminder-${Date.now()}`,
        title,
        dueDate,
        completed: false,
      };
      setReminders((prev) => {
        const updated = [...prev, reminder];
        localStorage.setItem('election-reminders', JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const removeReminder = useCallback((id: string) => {
    setReminders((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem('election-reminders', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleReminder = useCallback((id: string) => {
    setReminders((prev) => {
      const updated = prev.map((r) =>
        r.id === id ? { ...r, completed: !r.completed } : r
      );
      localStorage.setItem('election-reminders', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    reminders,
    isLoading,
    addReminder,
    removeReminder,
    toggleReminder,
  };
};
