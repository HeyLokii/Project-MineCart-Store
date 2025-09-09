import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Serve static files from dist/public
app.use(express.static(path.join(__dirname, 'dist/public')));

// Fallback for SPA routes - always serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Static server running on port ${PORT}`);
  console.log(`📱 Access: http://localhost:${PORT}`);
});