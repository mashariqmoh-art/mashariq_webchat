require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:5174', credentials: true }));
app.use(express.json());

// Routes (added in later steps)
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});




app.listen(PORT, () => {
  console.log(`Mashariq WebChat server running on http://localhost:${PORT}`);
});

module.exports = app;
