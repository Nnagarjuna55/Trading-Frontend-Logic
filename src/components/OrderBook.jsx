import React, { useState, useEffect } from 'react';
import { tradingAPI } from '../services/api';

const OrderBook = ({ market }) => {
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!market) return;

    const fetchOrderBook = async () => {
      try {
        setLoading(true);
        const response = await tradingAPI.getOrderBook(market.id);
        setBids(response.data.bids);
        setAsks(response.data.asks);
      } catch (err) {
        setError('Failed to fetch order book');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [market]);

  if (!market) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 text-center text-gray-400">
        Select a market to view order book
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between text-gray-400 text-sm mb-4">
        <span>Price ({market.quoteCurrency})</span>
        <span>Amount ({market.baseCurrency})</span>
        <span>Total</span>
      </div>

      <div className="space-y-1">
        {/* Asks (Sell Orders) */}
        {asks.slice(0, 10).map((ask, index) => (
          <div key={index} className="flex justify-between text-red-400 text-sm">
            <span>{parseFloat(ask.price).toFixed(2)}</span>
            <span>{parseFloat(ask.amount).toFixed(4)}</span>
            <span>{(parseFloat(ask.price) * parseFloat(ask.amount)).toFixed(2)}</span>
          </div>
        ))}

        {/* Spread */}
        <div className="my-2 text-center text-gray-400 text-sm">
          Spread: {((asks[0]?.price - bids[0]?.price) / bids[0]?.price * 100).toFixed(2)}%
        </div>

        {/* Bids (Buy Orders) */}
        {bids.slice(0, 10).map((bid, index) => (
          <div key={index} className="flex justify-between text-green-400 text-sm">
            <span>{parseFloat(bid.price).toFixed(2)}</span>
            <span>{parseFloat(bid.amount).toFixed(4)}</span>
            <span>{(parseFloat(bid.price) * parseFloat(bid.amount)).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBook;
