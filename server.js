const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 100 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after a minute',
});

// Apply the rate limiting middleware to API calls only
app.use('/api/', limiter);


// --- API Endpoints ---

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Mock TTS endpoint
app.post('/api/tts/synthesize', (req, res) => {
  const { text, languageCode } = req.body;
  if (!text || !languageCode) {
    return res.status(400).json({ error: 'Text and languageCode are required' });
  }
  // In a real app, you'd call the Google TTS API here.
  // For this mock, we'll return a fake base64 audio string.
  const mockAudio = Buffer.from(`Mock audio for: ${text}`).toString('base64');
  res.json({ audioContent: mockAudio });
});

// Mock Translate endpoint
app.post('/api/translate', (req, res) => {
  const { text, targetLanguage } = req.body;
  if (!text || !targetLanguage) {
    return res.status(400).json({ error: 'Text and targetLanguage are required' });
  }
  res.json({ translatedText: `[${targetLanguage}] ${text}` });
});

// Mock Batch Translate endpoint
app.post('/api/batch-translate', (req, res) => {
  const { texts, targetLanguage } = req.body;
  if (!texts || !Array.isArray(texts) || !targetLanguage) {
    return res.status(400).json({ error: 'Texts array and targetLanguage are required' });
  }
  const translations = texts.map(text => `[${targetLanguage}] ${text}`);
  res.json({ translations });
});

// Mock Detect Language endpoint
app.post('/api/detect-language', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  // Mock detection
  res.json({ language: 'en' });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('✓ Health check endpoint: /health');
  console.log('✓ TTS endpoint: /api/tts/synthesize');
  console.log('✓ Translation endpoint: /api/translate');
  console.log('✓ Batch translate: /api/batch-translate');
  console.log('✓ Language detection: /api/detect-language');
});
