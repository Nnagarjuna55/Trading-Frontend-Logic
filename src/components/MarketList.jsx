import React, { useState, useEffect } from 'react';
import { tradingAPI } from '../services/api';

const MarketList = ({ markets, selectedMarket, onMarketSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filteredMarkets = markets.filter(market =>
    market.pair.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMarketClick = (market) => {
    onMarketSelect(market);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search markets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <svg
          className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {filteredMarkets.map((market) => (
          <div
            key={market.id}
            onClick={() => handleMarketClick(market)}
            className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedMarket?.id === market.id
                ? 'bg-yellow-400 bg-opacity-20 border border-yellow-400'
                : 'bg-gray-700 hover:bg-gray-600'
              }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white font-medium">{market.pair}</h3>
                <p className="text-gray-400 text-sm">24h Vol: ${market.volume24h.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-white">${market.lastPrice}</p>
                <p
                  className={`text-sm ${market.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                >
                  {market.change24h >= 0 ? '+' : ''}
                  {market.change24h}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMarkets.length === 0 && (
        <div className="text-center py-4 text-gray-400">
          No markets found
        </div>
      )}
    </div>
  );
};

export default MarketList;
