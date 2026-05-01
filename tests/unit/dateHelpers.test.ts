import {
  createElectionTimeline,
  formatDate,
  formatDateRange,
  daysUntil,
  isToday,
  isPast,
  isFuture,
  getRegistrationDeadline,
  getEarlyVotingStart,
  getTimeUntilElection,
  getTimeRemainingText,
  createVoterGuideSteps,
} from '../src/utils/dateHelpers';

describe('Date Helpers', () => {
  const testDate = new Date(2024, 10, 5); // November 5, 2024

  describe('createElectionTimeline', () => {
    it('should create 6 timeline phases', () => {
      const phases = createElectionTimeline(testDate);
      expect(phases.length).toBe(6);
    });

    it('should create phases in correct order', () => {
      const phases = createElectionTimeline(testDate);
      expect(phases[0].name).toBe('Candidate Nomination');
      expect(phases[1].name).toBe('Campaign Period');
      expect(phases[2].name).toBe('Registration Deadline');
      expect(phases[3].name).toBe('Early Voting');
      expect(phases[4].name).toBe('Election Day');
      expect(phases[5].name).toBe('Vote Counting & Results');
    });

    it('should set correct phase statuses', () => {
      const phases = createElectionTimeline(testDate);
      phases.forEach((phase) => {
        expect(['upcoming', 'current', 'completed']).toContain(phase.status);
      });
    });

    it('should have icons for each phase', () => {
      const phases = createElectionTimeline(testDate);
      phases.forEach((phase) => {
        expect(phase.icon).toBeDefined();
        expect(phase.icon.length).toBeGreaterThan(0);
      });
    });
  });

  describe('formatDate', () => {
    const date = new Date(2024, 10, 5); // November 5, 2024

    it('should format date in short format', () => {
      const result = formatDate(date, 'short');
      expect(result).toContain('Nov');
      expect(result).toContain('5');
      expect(result).toContain('2024');
    });

    it('should format date in long format', () => {
      const result = formatDate(date, 'long');
      expect(result).toContain('November');
      expect(result).toContain('5');
      expect(result).toContain('2024');
    });

    it('should format date in full format', () => {
      const result = formatDate(date, 'full');
      expect(result).toContain('Tuesday');
      expect(result).toContain('November');
    });

    it('should default to long format', () => {
      const result = formatDate(date);
      expect(result).toContain('November');
    });
  });

  describe('formatDateRange', () => {
    it('should format same day as single date', () => {
      const date = new Date(2024, 10, 5);
      const result = formatDateRange(date, date);
      expect(result).not.toContain('-');
      expect(result).toContain('November');
    });

    it('should format different days in different months', () => {
      const start = new Date(2024, 9, 5);
      const end = new Date(2024, 10, 15);
      const result = formatDateRange(start, end);
      expect(result).toContain(' - ');
    });

    it('should format different days in same month', () => {
      const start = new Date(2024, 10, 5);
      const end = new Date(2024, 10, 15);
      const result = formatDateRange(start, end);
      expect(result).toContain(' - ');
      expect(result).not.toContain('October');
    });
  });

  describe('daysUntil', () => {
    it('should calculate days until future date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      const result = daysUntil(futureDate);
      expect(result).toBeGreaterThanOrEqual(9);
      expect(result).toBeLessThanOrEqual(11);
    });

    it('should handle past dates', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);
      const result = daysUntil(pastDate);
      expect(result).toBeLessThanOrEqual(-4);
    });

    it('should return 0 for today', () => {
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      const result = daysUntil(today);
      expect(result).toBe(0);
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow)).toBe(false);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });
  });

  describe('isPast', () => {
    it('should return true for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isPast(yesterday)).toBe(true);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isPast(tomorrow)).toBe(false);
    });
  });

  describe('isFuture', () => {
    it('should return true for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isFuture(tomorrow)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isFuture(yesterday)).toBe(false);
    });
  });

  describe('getRegistrationDeadline', () => {
    it('should be 30 days before election', () => {
      const deadline = getRegistrationDeadline(testDate);
      const difference =
        (testDate.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24);
      expect(difference).toBe(30);
    });
  });

  describe('getEarlyVotingStart', () => {
    it('should be 21 days before election', () => {
      const earlyStart = getEarlyVotingStart(testDate);
      const difference =
        (testDate.getTime() - earlyStart.getTime()) / (1000 * 60 * 60 * 24);
      expect(difference).toBe(21);
    });
  });

  describe('getTimeUntilElection', () => {
    it('should return days, hours, minutes, seconds', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      futureDate.setHours(12, 0, 0, 0);

      const result = getTimeUntilElection(futureDate);
      expect(result.days).toBeGreaterThan(0);
      expect(result.hours).toBeDefined();
      expect(result.minutes).toBeDefined();
      expect(result.seconds).toBeDefined();
      expect(result.total).toBeGreaterThan(0);
    });
  });

  describe('getTimeRemainingText', () => {
    it('should format days remaining correctly', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const result = getTimeRemainingText(futureDate);
      expect(result).toContain('days remaining');
    });

    it('should format hours remaining correctly', () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 3);
      const result = getTimeRemainingText(futureDate);
      expect(result).toContain('remaining');
    });
  });

  describe('createVoterGuideSteps', () => {
    it('should create 8 voter guide steps', () => {
      const steps = createVoterGuideSteps();
      expect(steps.length).toBe(8);
    });

    it('should have step 1 as eligibility check', () => {
      const steps = createVoterGuideSteps();
      expect(steps[0].title).toBe('Check Your Eligibility');
      expect(steps[0].order).toBe(1);
    });

    it('should have step 8 as after voting', () => {
      const steps = createVoterGuideSteps();
      expect(steps[7].title).toBe('After You Vote');
      expect(steps[7].order).toBe(8);
    });

    it('should have valid content for each step', () => {
      const steps = createVoterGuideSteps();
      steps.forEach((step) => {
        expect(step.id).toBeDefined();
        expect(step.title).toBeDefined();
        expect(step.description).toBeDefined();
        expect(step.content).toBeDefined();
        expect(step.ariaLabel).toBeDefined();
        expect(step.order).toBeGreaterThan(0);
      });
    });
  });
});
