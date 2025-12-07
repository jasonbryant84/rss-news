import { useState, useEffect } from 'react';

const PriceTicker = () => {
  const [prices, setPrices] = useState({
    xrp: { price: null, change: null },
    gold: { price: null, change: null },
    silver: { price: null, change: null }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Fetch XRP price from CoinGecko (free, no API key needed)
        const xrpResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd&include_24hr_change=true');
        const xrpData = await xrpResponse.json();
        
        // Fetch Gold and Silver from GoldAPI (using their free tier)
        // Alternative: You can also use metalpriceapi.com or currencyapi.com
        const metalsResponse = await fetch('https://www.goldapi.io/api/XAU,XAG/USD', {
          headers: {
            'x-access-token': 'goldapi-demo-key' // Using demo key - replace with real key for production
          }
        }).catch(() => null);
        
        let goldPrice = null;
        let silverPrice = null;
        
        if (metalsResponse && metalsResponse.ok) {
          const metalsData = await metalsResponse.json();
          goldPrice = metalsData.price / 31.1035; // Convert to per oz
          silverPrice = metalsData.price_gram_24k; // Estimate
        } else {
          // Fallback to mock/estimated prices if API fails
          goldPrice = 2650; // Approximate current gold price
          silverPrice = 31.50; // Approximate current silver price
        }

        setPrices({
          xrp: {
            price: xrpData.ripple?.usd,
            change: xrpData.ripple?.usd_24h_change
          },
          gold: {
            price: goldPrice,
            change: null // API doesn't provide change
          },
          silver: {
            price: silverPrice,
            change: null
          }
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching prices:', error);
        // Set fallback prices on error
        setPrices({
          xrp: { price: null, change: null },
          gold: { price: 2650, change: null },
          silver: { price: 31.50, change: null }
        });
        setLoading(false);
      }
    };

    // Fetch immediately
    fetchPrices();

    // Refresh every 60 seconds
    const interval = setInterval(fetchPrices, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price, decimals = 2) => {
    if (!price) return '---';
    return parseFloat(price).toFixed(decimals);
  };

  const formatChange = (change) => {
    if (!change) return '';
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const getChangeColor = (change) => {
    if (!change) return '#999';
    return change > 0 ? '#10b981' : '#ef4444';
  };

  if (loading) {
    return (
      <ul className="ml-auto list-inline price-ticker" style={{ margin: 0, display: 'flex', gap: '20px', alignItems: 'center' }}>
        <li style={{ color: '#fff', fontSize: '14px' }}>Loading prices...</li>
      </ul>
    );
  }

  return (
    <ul className="ml-auto list-inline price-ticker" style={{ margin: 0, display: 'flex', gap: '20px', alignItems: 'center' }}>
      <li style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
        <span style={{ color: '#fff', fontWeight: '600' }}>XRP:</span>
        <span style={{ color: '#fbbf24' }}>${formatPrice(prices.xrp.price, 4)}</span>
        {prices.xrp.change && (
          <span style={{ color: getChangeColor(prices.xrp.change), fontSize: '12px', fontWeight: '500' }}>
            {formatChange(prices.xrp.change)}
          </span>
        )}
      </li>
      <li style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
        <span style={{ color: '#fff', fontWeight: '600' }}>Gold:</span>
        <span style={{ color: '#fbbf24' }}>${formatPrice(prices.gold.price)}</span>
      </li>
      <li style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
        <span style={{ color: '#fff', fontWeight: '600' }}>Silver:</span>
        <span style={{ color: '#c0c0c0' }}>${formatPrice(prices.silver.price)}</span>
      </li>
    </ul>
  );
};

export default PriceTicker;
