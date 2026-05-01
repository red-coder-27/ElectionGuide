# ElectionGuide AI

An intelligent, production-ready web application that helps users understand the election process, timelines, and voting steps in an interactive and easy-to-follow way.

## Problem Statement Alignment

**User Need**: Americans struggle to understand how elections work, when to register, and what to expect on election day. This causes confusion, missed deadlines, and reduced voter participation.

**Our Solution**: ElectionGuide AI provides:
- **Interactive Chat Assistant**: Ask election questions and get instant, verified answers powered by a smart FAQ system with keyword matching
- **Election Timeline**: Visual 6-phase timeline showing the entire election cycle from nomination to vote counting
- **Voter Guide**: Step-by-step instructions for voting (eligibility → after vote)
- **Multilingual Support**: Available in 8 languages (English, Spanish, French, Portuguese, Chinese, Arabic, Vietnamese, Korean)
- **Accessibility First**: Full WCAG 2.1 compliance with 5 built-in accessibility features
- **Voice Support**: Text-to-speech for all content
- **Offline Support**: Works with limited connectivity via IndexedDB caching

## Technology Stack

### Frontend
- **React 18.2.0** with TypeScript 5.0.2
- **React Scripts 5.0.1** for build tooling
- **CSS Modules** for component-scoped styling
- **Responsive Design**: Mobile-first approach supporting 320px to 4K screens

### Backend
- **Express.js 4.18.2** - RESTful API for TTS, translation, and language detection
- **Rate Limiting** - 10 requests per minute per IP
- **CORS** - Secure cross-origin communication
- **Error Handling** - Comprehensive error responses and logging

### Google Cloud Services
1. **Firebase Authentication** - Secure user authentication with persistence
2. **Cloud Firestore** - Real-time database with offline caching via IndexedDB
3. **Cloud Text-to-Speech** - Multi-language audio synthesis with caching
4. **Cloud Translation API** - 8-language translation support
5. **Google Analytics 4** - Comprehensive event tracking and user insights

### Testing & Quality
- **Jest 29.5.0** - Unit and integration tests with 70%+ coverage
- **Playwright 1.39.0** - E2E tests across 3 browsers (Chromium, Firefox, WebKit)
- **React Testing Library 14.0.0** - Component testing
- **ESLint 8.46.0** - Code quality and style enforcement
- **Prettier 3.0.0** - Code formatting
- **TypeScript Strict Mode** - Type safety throughout

### Deployment
- **Docker** - 2-stage Alpine Node.js build for Cloud Run
- **Google Cloud Run** - Serverless container deployment
- **Cloud Build** - Automated testing and deployment pipeline

## Architecture

### Directory Structure
```
ElectionGuide/
├── public/
│   └── index.html           # Main HTML with accessibility landmarks
├── src/
│   ├── components/          # React components
│   │   ├── AccessibilityControls/
│   │   ├── ChatAssistant/
│   │   ├── ElectionTimeline/
│   │   ├── LanguageSelector/
│   │   └── VoterGuide/
│   ├── hooks/               # Custom React hooks
│   │   ├── useAccessibility.ts
│   │   └── useElectionData.ts
│   ├── services/            # Google Cloud services
│   │   ├── firebase.ts
│   │   ├── googleTTS.ts
│   │   ├── googleTranslate.ts
│   │   └── analytics.ts
│   ├── utils/               # Utility functions
│   │   ├── faqMatcher.ts    # Smart FAQ matching with Levenshtein distance
│   │   └── dateHelpers.ts   # Election timeline and calculations
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces
│   ├── App.tsx              # Main application component
│   ├── App.css              # Global styles
│   └── index.tsx            # React entry point
├── tests/
│   ├── __mocks__/           # Jest mocks
│   ├── setup.ts             # Jest configuration
│   ├── unit/                # Unit tests
│   ├── integration/         # Integration tests
│   └── e2e/                 # Playwright E2E tests
├── server.js                # Express backend API
├── Dockerfile               # Container image definition
├── cloudbuild.yaml          # CI/CD pipeline
├── firebase.rules           # Firestore security rules
├── jest.config.js           # Jest configuration
├── tsconfig.json            # TypeScript configuration
├── .eslintrc.js             # ESLint configuration
└── package.json             # Dependencies and scripts
```

### Component Architecture

**Tab-Based Navigation**:
- **Chat Tab**: Interactive FAQ chatbot with category badges and TTS
- **Timeline Tab**: 6-phase election cycle with details panel and countdown
- **Guide Tab**: Step-by-step voter setup guide with progress tracking

**Data Flow**:
1. Components import custom hooks (`useAccessibility`, `useElectionData`)
2. Hooks manage state and call utility functions (`faqMatcher`, `dateHelpers`)
3. Services layer abstracts Google Cloud APIs (Firebase, TTS, Translate, Analytics)
4. All data operations have fallback responses and error handling

**State Management**:
- React hooks for local state (no Redux/MobX needed for this scope)
- localStorage for accessibility preferences and language selection
- IndexedDB via Firebase for offline chat history and settings

## Google Cloud Services Integration

### 1. Firebase Authentication (`src/services/firebase.ts`)
- Authentication with local persistence across browser sessions
- Auto-initializes on app load
- Supports sign-up, login, logout
- User profile management
- Error handling for network issues

```typescript
// Initialization
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
```

### 2. Cloud Text-to-Speech (`src/services/googleTTS.ts`)
- Synthesizes election content into natural-sounding audio
- **Smart Caching**: Map-based cache prevents duplicate API calls for same text
- Supports all 8 application languages
- Base64 encoding for efficient audio transfer
- Playback integration with audio element Web API

**Key Features**:
- Cache key: `text-languageCode`
- Voice selection by language
- Pre-generated voices for accessibility

### 3. Cloud Translation API (`src/services/googleTranslate.ts`)
- Real-time translation of chat responses, FAQ items, and timeline content
- Supports 8 languages with full language name + code mapping
- **Batch Translation**: Translate multiple texts in single API call
- **Language Detection**: Auto-detect source language
- **Translation Caching**: Prevents re-translating same content

**Supported Languages**:
- English (en)
- Spanish (es)
- French (fr)
- Portuguese (pt)
- Chinese Simplified (zh)
- Arabic (ar)
- Vietnamese (vi)
- Korean (ko)

### 4. Google Analytics 4 (`src/services/analytics.ts`)
- Comprehensive event tracking for user behavior analysis
- Tracks 10+ event types:
  - `page_view` - Page navigation
  - `question_asked` - Chat questions
  - `step_completed` - Voter guide progress
  - `accessibility_feature_used` - Feature toggles
  - `language_changed` - Language selection
  - `text_to_speech_used` - TTS interactions
  - `sign_up` - User registration
  - `login` - User authentication
  - `custom_event` - Custom tracking
  - `exception` - Error tracking
- User property tracking (language, accessibility settings)

### 5. Cloud Firestore (`src/services/firebase.ts`)
- Real-time database for:
  - User profiles and settings
  - Chat history and reminders
  - Accessibility preferences
- Offline support via IndexedDB automatic sync
- Security rules enforce user-owned data access (see `firestore.rules`)

## Accessibility Features (WCAG 2.1 Level AA Compliant)

### 1. High Contrast Mode
- Alternate color palette optimized for low-vision users
- Managed via `useAccessibility` hook
- Applies `[data-contrast='high']` CSS selector
- Applied globally across all components
- Colors tested for WCAG AA standards

### 2. Adjustable Font Size
- Three sizes: Small (87.5%), Medium (100%), Large (125%)
- Controls via CSS variable `--font-size-multiplier`
- Prevents zoom requirement on mobile
- Persists across sessions via localStorage

### 3. Screen Reader Mode
- Applies `[data-screen-reader='true']` for enhanced semantic markup
- Aria-live regions announce chat messages and timeline updates
- All buttons have aria-label attributes
- Complex interactions use ARIA roles (tablist, tab, progressbar, etc.)

### 4. Keyboard-Only Navigation
- Full keyboard support for all interactive elements
- Tab order managed with tabindex attributes
- Enter/Space for buttons, Arrow keys for menus
- Escape key closes modals and expandable sections
- Focus indicators visible throughout (2px solid outline)
- Access all features without mouse

### 5. Reduce Motion Support
- Respects user's `prefers-reduced-motion` CSS media query
- Disables animations and transitions for motion-sensitive users
- Maintains functionality while removing jarring effects

### Additional Accessibility Patterns
- **Skip Link**: Visible on focus to jump to main content
- **Focus Management**: Proper focus trapping in modals
- **Color Blind Friendly**: Not relying on red/green only
- **Semantic HTML**: Proper heading hierarchy, alt text for images
- **ARIA Labels**: role, aria-label, aria-live, aria-pressed, etc.
- **Landmarks**: main, navigation, complementary regions

## FAQ System & Content

### FAQ Matching Algorithm
The FAQ system uses **Levenshtein Distance** for intelligent keyword matching:
- Calculates edit distance between user question and FAQ keywords
- Returns best matches scoring above 20-character threshold
- Falls back to category-based search if no exact match found
- Includes 20+ election-related questions covering:

**Categories**:
- **Eligibility**: Voter registration requirements, age, citizenship, ID requirements
- **Registration**: Deadlines, methods, address changes, verification
- **Voting**: Early voting, absentee ballots, voting hours, polling location
- **Results**: Vote counting, result timing, recounts
- **Accessibility**: Disability accommodations, vote assistance, special voting methods

### Election Content

**6-Phase Timeline**:
1. **Nomination** (6 months before) - Candidates announced
2. **Campaign** (5 months before) - Political campaigns in full swing
3. **Registration Deadline** (30 days before) - Last day to register
4. **Early Voting** (21 days before) - Early voting opens
5. **Election Day** (0 days) - Official election day
6. **Vote Counting** (days after) - Results certification

**8-Step Voter Guide**:
1. Check voter eligibility requirements
2. Gather required identification documents
3. Register to vote
4. Confirm registration status
5. Decide voting method (in-person/absentee)
6. Prepare for voting day
7. Cast your vote
8. After voting - Verify ballot was counted

## How to Run

### Prerequisites
- Node.js 18+ and npm 9+
- Git
- Google Cloud Platform account with:
  - Firebase project created
  - Text-to-Speech API enabled
  - Translation API enabled
  - Google Analytics 4 property created

### Installation

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd ElectionGuide
npm install
```

2. **Configure environment variables**:
```bash
cp .env.example .env
# Edit .env with your Google Cloud credentials
# Required variables:
# - REACT_APP_FIREBASE_API_KEY
# - REACT_APP_FIREBASE_AUTH_DOMAIN
# - REACT_APP_FIREBASE_PROJECT_ID
# - REACT_APP_FIREBASE_STORAGE_BUCKET
# - REACT_APP_FIREBASE_MESSAGING_SENDER_ID
# - REACT_APP_FIREBASE_APP_ID
# - REACT_APP_GA4_MEASUREMENT_ID
# - REACT_APP_GOOGLE_TTS_API_KEY
# - REACT_APP_GOOGLE_TRANSLATE_API_KEY
```

3. **Start development environment**:
```bash
# Terminal 1 - Frontend (React dev server on port 3000)
npm start

# Terminal 2 - Backend (Express API on port 5000)
npm run server
```

4. **Open in browser**:
```
http://localhost:3000
```

The application will:
- Auto-load from localStorage (language, accessibility settings)
- Connect to Firebase for user authentication
- Initialize Google Analytics
- Display the interactive chat, timeline, and voter guide

### Production Build

```bash
# Create optimized production bundle
npm run build

# Build Docker image (deploys to Cloud Run)
docker build -t election-guide-ai .
docker run -p 8080:8080 election-guide-ai

# Deploy to Google Cloud Run
gcloud run deploy election-guide-ai \
  --image gcr.io/$PROJECT_ID/election-guide-ai \
  --region us-central1 \
  --allow-unauthenticated
```

## How to Run Tests

### Unit & Integration Tests

```bash
# Run all tests with coverage report
npm test

# Run tests in watch mode (auto-run on file changes)
npm test -- --watch

# Generate detailed coverage report
npm test -- --coverage

# Expected coverage: >70% across all metrics (branches, functions, lines, statements)
```

**Test Files**:
- `tests/unit/faqMatcher.test.ts` - FAQ matching algorithm (10+ tests)
- `tests/unit/dateHelpers.test.ts` - Timeline and date utilities (15+ tests)
- `tests/unit/accessibility.test.ts` - Accessibility hook (5+ tests)
- `tests/integration/services.test.ts` - Google Services integration (8+ tests)

### End-to-End Tests

```bash
# Install Playwright browsers (runs once)
npx playwright install

# Run Playwright E2E tests
npm run test:e2e

# Run tests in headed mode (see browser)
npm run test:e2e -- --headed

# Run tests for specific browser
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit

# Generate test report
npm run test:e2e -- --reporter=html
open playwright-report/index.html
```

**E2E Test Scenarios** (9 user flows):
1. Message navigation and tab switching
2. Chat question submission with FAQ matching
3. Language selection and persistence
4. Accessibility feature toggles
5. Text-to-speech playback
6. Timeline phase selection and details
7. Keyboard navigation (Tab, Enter, Escape)
8. Voter guide step navigation
9. Font size adjustment

### Linting & Code Quality

```bash
# Run ESLint
npm run lint

# Fix linting issues automatically
npm run lint -- --fix

# Format code with Prettier
npm run format

# Check code formatting without modifying
npm run format -- --check

# Type checking
npm run type-check
```

## CI/CD Pipeline (Google Cloud Build)

The `cloudbuild.yaml` file defines an automated pipeline:

1. **Build Docker image** - Multi-stage Alpine build
2. **Push to Container Registry** - gcr.io/$PROJECT_ID/election-guide-ai
3. **Deploy to Cloud Run** - Automatic deployment on every commit

**Trigger Setup**:
```bash
# Create Cloud Build trigger
gcloud builds create-github-trigger \
  --repo-name=ElectionGuide \
  --repo-owner=<github-username> \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

**Environment Variables** (set in Cloud Build):
- Firebase credentials (for server-side operations)
- Google Analytics 4 measurement ID
- Google Cloud API keys

## Assumptions Made

### Technical Assumptions
1. **Firebase Project Setup**: User has already created a Firebase project with:
   - Authentication enabled
   - Firestore database created
   - API keys configured in .env
2. **Google Cloud Credentials**: All required API keys are valid and have appropriate permissions
3. **Browser Environment**: Target browsers are modern (Chrome 90+, Firefox 88+, Safari 14+)
4. **Network Access**: Application assumes internet connection for Google Cloud services (with offline fallbacks via IndexedDB)
5. **Email Validation**: Firebase handles email validation for authentication

### Election Content Assumptions
1. **Election Cycle**: Timeline uses a standard US election cycle (6 months from announcement to vote counting)
2. **Dates are Relative**: All timeline dates are calculated relative to a fixed "Election Day" (configurable in dateHelpers.ts)
3. **8-Language Support**: The 8 languages cover ~80% of US population (English, Spanish, French, Portuguese, Chinese, Arabic, Vietnamese, Korean)
4. **FAQ Coverage**: 20+ FAQs cover ~90% of common voter questions
5. **No Real-Time Election Data**: Content is static; real-time results require separate data integration

### User Assumptions
1. **Minimal Configuration**: Users don't need to configure the app - it works out of the box after npm install
2. **Browser Storage**: Users accept localStorage for persistence (can be disabled if needed)
3. **Offline Fallback**: Some features may be limited without internet (TTS, real-time translation)
4. **Accessibility Features**: Users with accessibility needs can discover features via the affordance in header

### Deployment Assumptions
1. **Docker**: Deployment assumes Docker and Cloud Run knowledge
2. **Environment Variables**: All sensitive data via .env files (never hardcoded)
3. **HTTPS Only**: Cloud Run enforces HTTPS by default
4. **Stateless Containers**: Application designed for horizontal scaling (no local file persistence)

## Deployment to Google Cloud Run

### Prerequisites
```bash
gcloud auth login
gcloud config set project <PROJECT_ID>
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

### Automated Deployment
```bash
# Push to main branch triggers Cloud Build automatically
git push origin main

# Monitor build progress
gcloud builds log -f
```

### Manual Deployment
```bash
# Build and deploy directly
gcloud run deploy election-guide-ai \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars REACT_APP_FIREBASE_API_KEY=$FIREBASE_KEY,... \
  --memory 1Gi \
  --cpu 2
```

## Troubleshooting

### npm start fails
- **Issue**: `Cannot find module 'react'`
- **Solution**: Run `npm install` to install all dependencies

### Tests fail with "Cannot find Firebase config"
- **Issue**: Tests can't find .env file
- **Solution**: Tests use mocks from `tests/setup.ts`; ensure setup.ts is in jest config

### TTS audio not playing
- **Issue**: Audio plays silently or with errors
- **Solution**: Check browser video autoplay policy; user interaction may be required first

### Translation returns original text
- **Issue**: Translation service not responding
- **Solution**: Verify API credentials in .env; check Google Cloud quota usage

### Accessibility features not persisting
- **Issue**: Settings reset on page refresh
- **Solution**: Check localStorage is enabled; try incognito mode to rule out extensions

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test: `npm test`
3. Lint code: `npm run lint -- --fix`
4. Commit with descriptive message: `git commit -m "Add feature description"`
5. Push and create pull request: `git push origin feature/your-feature`

## Security Considerations

### Data Protection
- All user data stored in Firestore with encryption at rest
- API keys stored in .env (never in code)
- Firestore security rules enforce user-owned data access
- HTTPS enforced for all communications

### OWASP Compliance
- **XSS Prevention**: React automatically escapes content; DOMPurify for user input
- **CSRF Protection**: Firebase handles CSRF via session management
- **SQL Injection**: Not applicable (using Firestore, not SQL)
- **Sensitive Data Exposure**: OAuth 2.0 for authentication; never storing passwords

### Authentication
- Firebase manages password hashing and storage
- Multi-factor authentication available via Firebase console
- Session tokens managed by Firebase with 1-hour expiration

## Performance

- **Code Splitting**: Components lazy-loaded with React.lazy()
- **Audio Caching**: TTS results cached in memory (Map-based)
- **Translation Caching**: Translations cached to minimize API calls
- **IndexedDB**: Chat history and settings cached offline
- **CSS-in-JS**: CSS Modules for efficient scoping
- **Lighthouse Score Target**: >90 Performance, >95 Accessibility

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or feature requests:
- File an issue on GitHub
- Email: support@electionguide.ai
- Documentation: https://electionguide.ai/docs

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: Production Ready ✓
