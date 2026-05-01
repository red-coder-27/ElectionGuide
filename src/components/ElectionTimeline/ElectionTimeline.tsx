/**
 * Election Timeline Component
 * Visualizes election phases and key dates in a horizontal timeline
 */

import React, { useId, useState, useEffect } from 'react';
import { useElectionTimeline } from '../../hooks/useElectionData';
import { formatDateRange, daysUntil } from '../../utils/dateHelpers';
import styles from './ElectionTimeline.module.css';

interface ElectionTimelineProps {
  electionDate?: Date;
  onPhaseSelect?: (phaseId: string) => void;
}

/**
 * ElectionTimeline component - interactive horizontal timeline
 */
export const ElectionTimeline: React.FC<ElectionTimelineProps> = ({
  electionDate = new Date(2024, 10, 5),
  onPhaseSelect,
}) => {
  const { phases, selectedPhase, isLoading, selectPhase } =
    useElectionTimeline(electionDate);
  const headingId = useId();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePhaseSelect = (phaseId: string) => {
    selectPhase(phaseId);
    onPhaseSelect?.(phaseId);
  };

  if (!mounted) return null;

  return (
    <section
      className={styles.timeline}
      aria-labelledby={headingId}
      role="region"
    >
      <div className={styles.header}>
        <h2 id={headingId} className={styles.title}>
          Election Timeline
        </h2>
        <p className={styles.subtitle}>
          Key dates and phases of the election process
        </p>
      </div>

      {isLoading ? (
        <div className={styles.loading} role="status" aria-live="polite">
          Loading timeline...
        </div>
      ) : (
        <div className={styles.container}>
          {/* Main Timeline */}
          <div className={styles.trackContainer}>
            <div className={styles.track} aria-hidden="true">
              {phases.map((phase, index) => (
                <div
                  key={phase.id}
                  className={`${styles.trackSegment} ${styles[phase.status]}`}
                  aria-hidden="true"
                />
              ))}
            </div>

            {/* Phase Buttons */}
            <div
              className={styles.phasesContainer}
              role="tablist"
              aria-label="Election phases"
            >
              {phases.map((phase, index) => (
                <button
                  key={phase.id}
                  className={`${styles.phaseButton} ${
                    selectedPhase?.id === phase.id ? styles.selected : ''
                  } ${styles[phase.status]}`}
                  onClick={() => handlePhaseSelect(phase.id)}
                  role="tab"
                  aria-label={`${phase.name}, ${phase.status}`}
                  title={`Click to view details about ${phase.name}`}
                >
                  <span className={styles.icon} aria-hidden="true">
                    {phase.icon}
                  </span>
                  <span className={styles.phaseName}>{phase.name}</span>
                  <span className={styles.phaseDate} aria-hidden="true">
                    {formatDateRange(phase.startDate, phase.endDate)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Phase Details */}
          {selectedPhase && (
            <div
              className={styles.details}
              role="tabpanel"
              aria-labelledby={selectedPhase.id}
            >
              <div className={styles.detailsContent}>
                <div className={styles.detailsHeader}>
                  <h3 className={styles.detailsTitle}>
                    <span className={styles.detailsIcon} aria-hidden="true">
                      {selectedPhase.icon}
                    </span>
                    {selectedPhase.name}
                  </h3>
                  <span
                    className={`${styles.statusBadge} ${styles[selectedPhase.status]}`}
                    role="status"
                  >
                    {selectedPhase.status.charAt(0).toUpperCase() +
                      selectedPhase.status.slice(1)}
                  </span>
                </div>

                <div className={styles.dateInfo}>
                  <strong>Date:</strong>
                  <time dateTime={selectedPhase.startDate.toISOString()}>
                    {formatDateRange(selectedPhase.startDate, selectedPhase.endDate)}
                  </time>
                </div>

                {selectedPhase.status === 'upcoming' && (
                  <div className={styles.countdown} role="status">
                    <strong>Days until:</strong>
                    <span>{daysUntil(selectedPhase.startDate)} days</span>
                  </div>
                )}

                <p className={styles.description}>{selectedPhase.description}</p>

                {/* Action Links */}
                <div className={styles.actions}>
                  {selectedPhase.id === 'phase-3' && (
                    <a
                      href="#register"
                      className={styles.actionLink}
                      role="button"
                      tabIndex={0}
                    >
                      📋 Check Registration Requirements
                    </a>
                  )}
                  {selectedPhase.id === 'phase-5' && (
                    <a
                      href="#find-polling"
                      className={styles.actionLink}
                      role="button"
                      tabIndex={0}
                    >
                      🗽 Find Your Polling Location
                    </a>
                  )}
                  {selectedPhase.id === 'phase-6' && (
                    <a
                      href="#results"
                      className={styles.actionLink}
                      role="button"
                      tabIndex={0}
                    >
                      📊 View Results
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Timeline Legend */}
          <div className={styles.legend} role="doc-tip">
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.completed}`} aria-hidden="true" />
              <span>Completed</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.current}`} aria-hidden="true" />
              <span>Current</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.upcoming}`} aria-hidden="true" />
              <span>Upcoming</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ElectionTimeline;
