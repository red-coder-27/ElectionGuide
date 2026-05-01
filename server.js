const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

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

// Generate valid WAV audio file
function generateWavAudio(durationMs = 1000) {
  const sampleRate = 16000;
  const channels = 1;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const numSamples = Math.floor((durationMs / 1000) * sampleRate);
  
  // WAV file header
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + numSamples * channels * bytesPerSample, 4); // file size - 8
  header.write('WAVE', 8);
  
  // Format chunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size
  header.writeUInt16LE(1, 20);  // AudioFormat (1 = PCM)
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * channels * bytesPerSample, 28); // ByteRate
  header.writeUInt16LE(channels * bytesPerSample, 32); // BlockAlign
  header.writeUInt16LE(bitsPerSample, 34);
  
  // Data chunk
  header.write('data', 36);
  header.writeUInt32LE(numSamples * channels * bytesPerSample, 40);
  
  // Generate simple tone (440 Hz beep)
  const audioData = Buffer.alloc(numSamples * channels * bytesPerSample);
  const freq = 440; // A4 note
  for (let i = 0; i < numSamples; i++) {
    const sample = Math.sin((2 * Math.PI * freq * i) / sampleRate) * 32767 * 0.3;
    audioData.writeInt16LE(Math.round(sample), i * bytesPerSample);
  }
  
  return Buffer.concat([header, audioData]);
}

// Mock TTS endpoint
app.post('/api/tts/synthesize', (req, res) => {
  const { text, languageCode } = req.body;
  if (!text || !languageCode) {
    return res.status(400).json({ error: 'Text and languageCode are required' });
  }
  
  // Generate actual WAV audio (duration based on text length - ~150 chars per second)
  const durationMs = Math.max(500, (text.length / 150) * 1000);
  const wavBuffer = generateWavAudio(durationMs);
  const audioBase64 = wavBuffer.toString('base64');
  
  res.json({ audioContent: audioBase64 });
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
