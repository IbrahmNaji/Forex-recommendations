const axios = require('axios');

//  حساب SMA و EMA 
function calculateSMA(data, period) {
  const sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) sma.push(null);
    else {
      const window = data.slice(i - period + 1, i + 1);
      const sum = window.reduce((a, b) => a + b, 0);
      sma.push(parseFloat((sum / period).toFixed(5)));
    }
  }
  return sma;
}

function calculateEMA(data, period) {
  const ema = [];
  const multiplier = 2 / (period + 1);
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) ema.push(null);
    else if (i === period - 1) {
      const window = data.slice(0, period);
      const sma = window.reduce((a, b) => a + b, 0) / period;
      ema.push(parseFloat(sma.toFixed(5)));
    } else {
      ema.push(parseFloat(((data[i] - ema[i - 1]) * multiplier + ema[i - 1]).toFixed(5)));
    }
  }
  return ema;
}

exports.fetchAndAnalyzeForex = async (from, to, period) => {
  try {
    const response = await axios.get('https://api.twelvedata.com/time_series', {
      params: {
        symbol: `${from}/${to}`,
        interval: '1day',
        outputsize: 100,
        apikey: process.env.TWELVE_DATA_API_KEY
      }
    });

    const values = response.data.values;

    if (!values || values.length === 0) {
      throw new Error('No data returned from API');
    }

    values.reverse(); // ترتيب تصاعدي 

    const prices = values.map(v => parseFloat(v.close));

    const sma = calculateSMA(prices, period);
    const ema = calculateEMA(prices, period);

   
    const signals = [];
    for (let i = 1; i < prices.length; i++) {
      if (sma[i - 1] && sma[i]) {
        if (prices[i - 1] < sma[i - 1] && prices[i] > sma[i]) signals.push({ index: i, type: 'buy' });
        else if (prices[i - 1] > sma[i - 1] && prices[i] < sma[i]) signals.push({ index: i, type: 'sell' });
      }
    }

    const latestSignal = signals.length > 0 ? signals[signals.length - 1].type : null;
    const recommendation = latestSignal === 'buy' ? '📈 Buy Opportunity' : latestSignal === 'sell' ? '📉 Sell Opportunity' : '⏸ No signal at the moment';

    return {
      values,
      sma,
      ema,
      signals,
      recommendation
    };

  } catch (error) {
    console.error('Error fetching or processing data:', error.message);
    throw error;
  }
};
