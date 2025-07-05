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

const path = require('path');

app.use(express.static(path.join(__dirname, 'front-end')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'front-end', 'index.html'));
});


// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
