require('dotenv').config();
const express = require('express');
const cors = require('cors');

const forexRoutes = require('./routes/forex.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ربط  مع المسار الرئيسي
app.use('/api/forex', forexRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
