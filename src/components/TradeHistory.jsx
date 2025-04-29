import React from 'react';

const TradeHistory = () => {
  return (
    <div className="p-4 bg-gray-700 text-white">
      <h2 className="text-lg mb-4">Recent Trades</h2>
      <ul className="space-y-2">
        <li>Buy 0.0012 BTC @ $31000</li>
        <li>Sell 0.0008 BTC @ $31100</li>
        <li>Buy 0.0020 BTC @ $30900</li>
      </ul>
    </div>
  );
};

export default TradeHistory;
