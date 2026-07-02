const express = require('express');
const cors = require('cors');
require('dotenv').config();
const chatRoutes = require('./routes/chat');

// Load environment variables from .env file
// This must be called before anything else that uses process.env
// dotenv.config();

// Create the Express application
// Think of this like bootstrapApplication() in Angular
const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────
// Middleware runs on every request before it reaches your routes
// Think of it like Angular interceptors

// CORS — allows Angular (port 4200) to talk to this server (port 3000)
// Without this, the browser blocks all cross-origin requests
app.use(
  cors({
    origin: [
      'http://localhost:4200',
      'https://devdoubt.vercel.app',
      'https://devdoubt-evtu1hg9i-aashish-jakhmola.vercel.app',
    ],
    methods: ['GET', 'POST'],
  }),
);

// JSON parser — automatically parses incoming JSON request bodies
// So req.body.message works instead of manually parsing raw text
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────
// Connect our chat router to the /api/chat path
// Any request to /api/chat/... gets handled by chatRoutes
app.use('/api/chat', chatRoutes);

// ─── Health check ─────────────────────────────────────────────────────────
// A simple GET endpoint to verify the server is running
// Open http://localhost:3000/api/health in browser to confirm
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'DevDoubt server is running',
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────
// Catches any request to a route that doesn't exist
app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.originalUrl} not found`,
  });
});

// ─── Global error handler ─────────────────────────────────────────────────
// Catches any unhandled errors from routes or middleware
// Like Angular's global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({
    error: 'Internal server error',
  });
});

// ─── Start the server ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`DevDoubt server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Chat endpoint: POST http://localhost:${PORT}/api/chat`);
});
