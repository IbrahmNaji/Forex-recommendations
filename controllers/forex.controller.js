const { fetchAndAnalyzeForex } = require('../services/forex.service');

exports.getForexData = async (req, res) => {
  const { from_symbol, to_symbol, period } = req.query;

  if (!from_symbol || !to_symbol || !period) {
    return res.status(400).json({ error: 'from_symbol, to_symbol, and period are required.' });
  }

  try {
    const result = await fetchAndAnalyzeForex(from_symbol, to_symbol, parseInt(period));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
