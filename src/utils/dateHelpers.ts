/**
 * Date and Election Timeline Helpers
 * Provides utilities for election date calculations and timeline management
 */

import { TimelinePhase, ElectionStep } from '../types/index';

/**
 * Election timeline phases with typical dates (adjustable per election)
 */
export const createElectionTimeline = (electionDate: Date): TimelinePhase[] => {
  const phases: TimelinePhase[] = [];

  // Work backwards from election date
  const nominationStart = new Date(electionDate);
  nominationStart.setMonth(nominationStart.getMonth() - 6);

  const campaignStart = new Date(nominationStart);
  campaignStart.setMonth(campaignStart.getMonth() + 1);

  const registrationDeadline = new Date(electionDate);
  registrationDeadline.setDate(registrationDeadline.getDate() - 30);

  const earlyVotingStart = new Date(electionDate);
  earlyVotingStart.setDate(earlyVotingStart.getDate() - 21);

  const now = new Date();

  // Candidate Nomination Phase
  phases.push({
    id: 'phase-1',
    name: 'Candidate Nomination',
    startDate: nominationStart,
    endDate: campaignStart,
    description:
      'Candidates declare their intention to run and gather support from their parties and voters.',
    icon: '📋',
    status: getPhaseStatus(nominationStart, campaignStart, now),
  });

  // Campaign Period
  phases.push({
    id: 'phase-2',
    name: 'Campaign Period',
    startDate: campaignStart,
    endDate: registrationDeadline,
    description:
      'Candidates campaign, debate, and promote their platforms to voters across the country.',
    icon: '📢',
    status: getPhaseStatus(campaignStart, registrationDeadline, now),
  });

  // Voter Registration Deadline
  phases.push({
    id: 'phase-3',
    name: 'Registration Deadline',
    startDate: registrationDeadline,
    endDate: registrationDeadline,
    description:
      'Last day to register to vote. After this date, new registrations will not be processed for this election.',
    icon: '✍️',
    status: getPhaseStatus(registrationDeadline, registrationDeadline, now),
  });

  // Early Voting
  phases.push({
    id: 'phase-4',
    name: 'Early Voting',
    startDate: earlyVotingStart,
    endDate: new Date(electionDate.getTime() - 86400000), // 1 day before
    description:
      'Early voting allows citizens to vote before Election Day at designated polling locations.',
    icon: '🗳️',
    status: getPhaseStatus(earlyVotingStart, new Date(electionDate.getTime() - 86400000), now),
  });

  // Election Day
  phases.push({
    id: 'phase-5',
    name: 'Election Day',
    startDate: electionDate,
    endDate: electionDate,
    description:
      'Citizens go to the polls to cast their votes. Polling places open early morning and close in the evening.',
    icon: '🗽',
    status: getPhaseStatus(electionDate, electionDate, now),
  });

  // Vote Counting
  const countingEnd = new Date(electionDate);
  countingEnd.setDate(countingEnd.getDate() + 3);

  phases.push({
    id: 'phase-6',
    name: 'Vote Counting & Results',
    startDate: electionDate,
    endDate: countingEnd,
    description:
      'Election officials count all votes, verify results, and candidates concede or request recounts. Results are certified.',
    icon: '📊',
    status: getPhaseStatus(electionDate, countingEnd, now),
  });

  return phases;
};

/**
 * Determine phase status based on dates
 * @param startDate - Phase start date
 * @param endDate - Phase end date
 * @param currentDate - Current date for comparison
 * @returns Phase status: 'upcoming', 'current', or 'completed'
 */
const getPhaseStatus = (
  startDate: Date,
  endDate: Date,
  currentDate: Date
): 'upcoming' | 'current' | 'completed' => {
  if (currentDate < startDate) {
    return 'upcoming';
  } else if (currentDate > endDate) {
    return 'completed';
  } else {
    return 'current';
  }
};

/**
 * Format date to readable string
 * @param date - Date to format
 * @param format - Format type: 'short', 'long', 'full'
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date,
  format: 'short' | 'long' | 'full' = 'long'
): string => {
  const options: Record<string, Intl.DateTimeFormatOptions> = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
    full: {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    },
  };

  return new Intl.DateTimeFormat('en-US', options[format]).format(date);
};

/**
 * Format date range
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted date range string
 */
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  if (startDate.getTime() === endDate.getTime()) {
    return formatDate(startDate, 'long');
  }

  const sameMonth = startDate.getMonth() === endDate.getMonth() && 
                    startDate.getFullYear() === endDate.getFullYear();

  if (sameMonth) {
    return `${startDate.getDate()} - ${formatDate(endDate, 'long')}`;
  }

  return `${formatDate(startDate, 'long')} - ${formatDate(endDate, 'long')}`;
};

/**
 * Calculate days until date
 * @param date - Target date
 * @returns Number of days until the date
 */
export const daysUntil = (date: Date): number => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * Check if date is today
 * @param date - Date to check
 * @returns true if date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if date is in the past
 * @param date - Date to check
 * @returns true if date is in the past
 */
export const isPast = (date: Date): boolean => {
  return date < new Date();
};

/**
 * Check if date is in the future
 * @param date - Date to check
 * @returns true if date is in the future
 */
export const isFuture = (date: Date): boolean => {
  return date > new Date();
};

/**
 * Get voter registration deadline (30 days before election)
 * @param electionDate - Election date
 * @returns Voter registration deadline
 */
export const getRegistrationDeadline = (electionDate: Date): Date => {
  const deadline = new Date(electionDate);
  deadline.setDate(deadline.getDate() - 30);
  return deadline;
};

/**
 * Get early voting start date (21 days before election)
 * @param electionDate - Election date
 * @returns Early voting start date
 */
export const getEarlyVotingStart = (electionDate: Date): Date => {
  const start = new Date(electionDate);
  start.setDate(start.getDate() - 21);
  return start;
};

/**
 * Create formatted election steps for voter guide
 */
export const createVoterGuideSteps = (): ElectionStep[] => {
  return [
    {
      id: 'step-1',
      title: 'Check Your Eligibility',
      description:
        'Verify you meet all requirements to vote in your state and district.',
      order: 1,
      ariaLabel: 'Step 1: Check eligibility to vote',
      content: `
        Requirements to vote:
        • Must be at least 18 years old on Election Day
        • Must be a U.S. citizen
        • Must meet your state's residency requirements (typically 30 days)
        • Must be registered with your local election office
        • Must not have been declared mentally incompetent by a court
        • Must not be in prison or on parole/probation for a felony conviction
        
        Check your eligibility with your local election office website.
      `,
    },
    {
      id: 'step-2',
      title: 'Gather Required Documents',
      description:
        "Collect the documents you'll need to register and vote.",
      order: 2,
      ariaLabel: 'Step 2: Gather required documents',
      content: `
        Documents you may need:
        • Valid government-issued photo ID (driver's license, passport, state ID)
        • Proof of U.S. citizenship (birth certificate, passport, naturalization papers)
        • Proof of your state residency (utility bill, lease, mail, bill)
        • Proof of your date of birth
        
        Keep these documents safe and accessible for registration and voting day.
      `,
    },
    {
      id: 'step-3',
      title: 'Register to Vote',
      description: 'Complete voter registration before the deadline.',
      date: 'Deadline: 30 days before election',
      order: 3,
      ariaLabel: 'Step 3: Register to vote',
      content: `
        How to register:
        
        Online: Visit your state's election or secretary of state website
        • Many states allow online voter registration
        • Fill out the form with your personal information
        • You'll usually get a confirmation
        
        By Mail:
        • Request a voter registration form from your local election office
        • Complete and mail it back by the deadline
        
        In Person:
        • Visit your local election office or polling location
        • Download and complete the registration form ahead of time
        
        Important: Register by the deadline! Most states require registration 30 days before the election.
      `,
    },
    {
      id: 'step-4',
      title: 'Confirm Your Registration',
      description: 'Verify that your registration was successfully processed.',
      order: 4,
      ariaLabel: 'Step 4: Confirm voter registration',
      content: `
        Verify your registration:
        1. Visit your state's election website
        2. Use the "Check Voter Registration" tool
        3. Enter your name or ID number
        4. Confirm your registration details are correct
        5. Make note of your polling location and hours
        
        If there are issues with your registration, contact your local election office immediately.
      `,
    },
    {
      id: 'step-5',
      title: 'Decide: Vote Early or On Election Day',
      description: 'Choose how and when you want to vote.',
      order: 5,
      ariaLabel: 'Step 5: Choose voting method',
      content: `
        Voting options:
        
        Early Voting (21 days before election):
        • Vote in person at designated early voting locations
        • No excuse needed in most states
        • Shorter lines than Election Day
        • Specific locations and hours
        
        Mail-in or Absentee Ballot:
        • Request a ballot from your election office
        • Vote at home at your own pace
        • Mail it back by the deadline or return in person
        • Application deadlines vary by state
        
        Election Day Voting:
        • Go to your assigned polling location
        • Bring required ID
        • Voting hours typically 7am - 8pm
        • May have longer wait times
      `,
    },
    {
      id: 'step-6',
      title: 'Prepare for Voting',
      description: 'Get ready for your voting experience.',
      order: 6,
      ariaLabel: 'Step 6: Prepare for voting day',
      content: `
        Before you vote:
        • Research the candidates and measures on the ballot
        • Know your polling location (check voter registration info)
        • Plan when and how you'll vote
        • Bring your ID and other required documents
        • Dress comfortably - you might stand in line
        
        What to bring:
        • Valid government-issued photo ID
        • Any reminder notice sent by your election office
        • Your "cheat sheet" with voting choices (optional!)
        
        Polling place details:
        • Visit your state's election website to find your polling place
        • Check hours (usually 7am - 8pm)
        • Note the exact address and parking information
        • Plan for travel time and possible lines
      `,
    },
    {
      id: 'step-7',
      title: 'Vote',
      description: 'Cast your ballot at the polling place.',
      order: 7,
      ariaLabel: 'Step 7: Vote at polling place',
      content: `
        At the polling place:
        1. Check in with poll workers at the registration table
        2. Prove your identity and residence if asked
        3. Receive your ballot
        4. Go to the voting booth
        5. Mark your choices following instructions
        6. Review your ballot to make sure it's correct
        7. If you made a mistake, ask for a new ballot
        8. Cast your ballot
        9. You may receive an "I Voted" sticker!
        
        First-time voter? Poll workers are there to help! Don't hesitate to ask questions.
      `,
    },
    {
      id: 'step-8',
      title: 'After You Vote',
      description: 'Follow up completed voting.',
      order: 8,
      ariaLabel: 'Step 8: After voting',
      content: `
        What happens next:
        • Your vote is recorded and counted
        • Results are typically available election night
        • Official results are certified days later
        • You can track your ballot if you voted by mail
        
        If you voted by mail:
        • Track your ballot at your state's election website
        • Confirm it was received and counted
        • Check for any issues
        
        Stay informed:
        • Follow your state's election website for results
        • Official results are certified within weeks
        • Recounts may happen in close races
      `,
    },
  ];
};

/**
 * Calculate time until next election
 * @returns Object with days, hours, minutes remaining
 */
export const getTimeUntilElection = (electionDate: Date) => {
  const now = new Date();
  const diff = electionDate.getTime() - now.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, total: diff };
};

/**
 * Get human-readable time remaining
 * @returns Formatted string like "5 days, 3 hours remaining"
 */
export const getTimeRemainingText = (electionDate: Date): string => {
  const { days, hours } = getTimeUntilElection(electionDate);

  if (days > 0) {
    return `${days} ${days === 1 ? 'day' : 'days'} remaining`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} remaining`;
  } else {
    return 'Voting happening now!';
  }
};
