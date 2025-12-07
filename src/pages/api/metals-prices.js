// API endpoint to fetch gold and silver prices from multiple sources
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    let goldPrice = null;
    let silverPrice = null;

    // Method 1: Try metalpriceapi.com (has free tier with 100 requests/month)
    try {
      const response = await fetch('https://api.metalpriceapi.com/v1/latest?api_key=demo&base=USD&currencies=XAU,XAG');
      if (response.ok) {
        const data = await response.json();
        // Response format: rates are inverted (USD per ounce)
        if (data.rates) {
          goldPrice = data.rates.XAU ? (1 / data.rates.XAU).toFixed(2) : null;
          silverPrice = data.rates.XAG ? (1 / data.rates.XAG).toFixed(2) : null;
        }
      }
    } catch (e) {
      console.log('metalpriceapi failed:', e.message);
    }

    // Method 2: Try goldapi.io (has free demo key)
    if (!goldPrice || !silverPrice) {
      try {
        // Fetch gold
        const goldResponse = await fetch('https://www.goldapi.io/api/XAU/USD', {
          headers: {
            'x-access-token': 'goldapi-demo-key',
            'Content-Type': 'application/json'
          }
        });
        
        if (goldResponse.ok) {
          const goldData = await goldResponse.json();
          goldPrice = goldData.price ? goldData.price.toFixed(2) : null;
        }

        // Fetch silver
        const silverResponse = await fetch('https://www.goldapi.io/api/XAG/USD', {
          headers: {
            'x-access-token': 'goldapi-demo-key',
            'Content-Type': 'application/json'
          }
        });
        
        if (silverResponse.ok) {
          const silverData = await silverResponse.json();
          silverPrice = silverData.price ? silverData.price.toFixed(2) : null;
        }
      } catch (e) {
        console.log('goldapi failed:', e.message);
      }
    }

    // Method 3: Try metals-api.com
    if (!goldPrice || !silverPrice) {
      try {
        const response = await fetch('https://metals-api.com/api/latest?access_key=demo&base=USD&symbols=XAU,XAG');
        if (response.ok) {
          const data = await response.json();
          if (data.rates) {
            goldPrice = data.rates.XAU ? (1 / data.rates.XAU).toFixed(2) : null;
            silverPrice = data.rates.XAG ? (1 / data.rates.XAG).toFixed(2) : null;
          }
        }
      } catch (e) {
        console.log('metals-api failed:', e.message);
      }
    }

    // Method 4: Try CoinGecko for gold/silver tokens as rough proxy
    if (!goldPrice || !silverPrice) {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold,silver-tokenized-stock-defichain&vs_currencies=usd');
        if (response.ok) {
          const data = await response.json();
          // PAX Gold is backed 1:1 by physical gold
          goldPrice = data['pax-gold']?.usd ? data['pax-gold'].usd.toFixed(2) : null;
          silverPrice = data['silver-tokenized-stock-defichain']?.usd ? (data['silver-tokenized-stock-defichain'].usd * 31.1035).toFixed(2) : null;
        }
      } catch (e) {
        console.log('coingecko metals proxy failed:', e.message);
      }
    }

    // If all methods fail, return error
    if (!goldPrice && !silverPrice) {
      return res.status(503).json({
        success: false,
        message: 'Unable to fetch metals prices from any source'
      });
    }

    res.status(200).json({
      success: true,
      gold: goldPrice,
      silver: silverPrice,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Metals price API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch metals prices',
      error: error.message
    });
  }
}
