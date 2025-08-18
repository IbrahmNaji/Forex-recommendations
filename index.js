require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const forexRoutes = require('./routes/forex.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/forex', forexRoutes);

// Serve frontend static files from 'front-end' folder
app.use(express.static(path.join(__dirname, 'front-end')));

// For any non-API routes, serve index.html (fix for Render/Node 22 issue)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'front-end', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
