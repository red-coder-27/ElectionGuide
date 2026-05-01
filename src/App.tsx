/**
 * Main App Component
 * Election Guide AI - Helps users understand the election process
 */

import React, { useEffect, useState } from 'react';
import { initializeAnalytics, trackPageView, setUserProperties } from './services/analytics';
import { useAccessibility, useKeyboardNavigation } from './hooks/useAccessibility';
import { ChatAssistant } from './components/ChatAssistant/ChatAssistant';
import { ElectionTimeline } from './components/ElectionTimeline/ElectionTimeline';
import { VoterGuide } from './components/VoterGuide/VoterGuide';
import { AccessibilityControls } from './components/AccessibilityControls/AccessibilityControls';
import { LanguageSelector } from './components/LanguageSelector/LanguageSelector';
import './App.css';

/**
 * Main App component
 */
const App: React.FC = () => {
  const [userId] = useState(`user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState<'chat' | 'timeline' | 'guide'>('chat');
  const { settings, isLoaded } = useAccessibility();

  useKeyboardNavigation(settings.keyboardNavigationOnly);

  // Initialize analytics
  useEffect(() => {
    initializeAnalytics();
    trackPageView('/', 'Election Guide AI');
    setUserProperties(userId, {
      language: selectedLanguage,
      accessibility_settings: JSON.stringify(settings),
    });
  }, [userId, selectedLanguage, settings]);

  if (!isLoaded) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading Election Guide AI...</p>
      </div>
    );
  }

  return (
    <div className="app" role="application" aria-label="Election Guide AI">
      {/* Skip Navigation Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <header className="app-header" role="banner">
        <div className="header-content">
          <div className="header-title">
            <h1 className="app-title">
              <span aria-hidden="true">🗳️</span>
              Election Guide AI
            </h1>
            <p className="app-subtitle">
              Your intelligent guide to understanding the election process
            </p>
          </div>

          <div className="header-controls">
            <LanguageSelector
              defaultLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
            <AccessibilityControls />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="app-nav" role="tablist" aria-label="Main navigation">
        <button
          className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
          role="tab"
          aria-controls="chat-panel"
        >
          <span aria-hidden="true">💬</span>
          <span>Chat Assistant</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
          role="tab"
          aria-controls="timeline-panel"
        >
          <span aria-hidden="true">📅</span>
          <span>Timeline</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'guide' ? 'active' : ''}`}
          onClick={() => setActiveTab('guide')}
          role="tab"
          aria-controls="guide-panel"
        >
          <span aria-hidden="true">📋</span>
          <span>Voter Guide</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="app-main" id="main-content" role="main">
        {/* Chat Assistant Panel */}
        <div
          id="chat-panel"
          className={`tab-panel ${activeTab === 'chat' ? 'active' : ''}`}
          role="tabpanel"
          aria-labelledby="chat-tab"
        >
          <ChatAssistant
            userId={userId}
            language={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        </div>

        {/* Timeline Panel */}
        <div
          id="timeline-panel"
          className={`tab-panel ${activeTab === 'timeline' ? 'active' : ''}`}
          role="tabpanel"
          aria-labelledby="timeline-tab"
        >
          <ElectionTimeline electionDate={new Date(2024, 10, 5)} />
        </div>

        {/* Voter Guide Panel */}
        <div
          id="guide-panel"
          className={`tab-panel ${activeTab === 'guide' ? 'active' : ''}`}
          role="tabpanel"
          aria-labelledby="guide-tab"
        >
          <VoterGuide language={selectedLanguage} />
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer" role="contentinfo">
        <div className="footer-content">
          <p>
            <strong>Election Guide AI</strong> - Helping citizens participate in democracy
          </p>
          <p className="footer-links">
            <a href="#privacy" onClick={(e) => e.preventDefault()}>
              Privacy Policy
            </a>
            {' | '}
            <a href="#terms" onClick={(e) => e.preventDefault()}>
              Terms of Service
            </a>
            {' | '}
            <a href="#contact" onClick={(e) => e.preventDefault()}>
              Contact Us
            </a>
            {' | '}
            <a href="#accessibility" onClick={(e) => e.preventDefault()}>
              Accessibility
            </a>
          </p>
          <p className="footer-meta">
            Built with accessibility, privacy, and accuracy in mind.<br/>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
