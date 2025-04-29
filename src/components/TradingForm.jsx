import React, { useState, useEffect } from 'react';
import { tradingAPI } from '../services/api';

const TradingForm = ({ market, walletBalance }) => {
  const [orderType, setOrderType] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [total, setTotal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (amount && price) {
      setTotal((parseFloat(amount) * parseFloat(price)).toFixed(2));
    } else {
      setTotal('');
    }
  }, [amount, price]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPrice(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // This expects a synthetic event, not string
    if (!market) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const orderData = {
        marketId: market.id,
        type: orderType,
        amount: parseFloat(amount),
        price: parseFloat(price),
      };

      await tradingAPI.placeOrder(orderData);
      setSuccess('Order placed successfully!');
      setAmount('');
      setPrice('');
      setTotal('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!market) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 text-center text-gray-400">
        Select a market to trade
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setOrderType('buy')}
          className={`flex-1 py-2 rounded-lg font-medium ${orderType === 'buy'
            ? 'bg-green-500 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setOrderType('sell')}
          className={`flex-1 py-2 rounded-lg font-medium ${orderType === 'sell'
            ? 'bg-red-500 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Sell
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-400 text-sm mb-1">Amount ({market.baseCurrency})</label>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            step="0.0001"
            min="0"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">Price ({market.quoteCurrency})</label>
          <input
            type="number"
            value={price}
            onChange={handlePriceChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">Total ({market.quoteCurrency})</label>
          <input
            type="text"
            value={total}
            readOnly
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg opacity-50"
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}

        {success && (
          <div className="text-green-400 text-sm">{success}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg font-medium ${orderType === 'buy'
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-red-500 hover:bg-red-600'
          } text-white disabled:opacity-50`}
        >
          {loading ? 'Placing Order...' : `${orderType === 'buy' ? 'Buy' : 'Sell'} ${market.baseCurrency}`}
        </button>

        <div className="text-gray-400 text-sm">
          Available Balance: {walletBalance?.toFixed(2) || '0.00'} {market.quoteCurrency}
        </div>
      </form>
    </div>
  );
};



export default TradingForm;
