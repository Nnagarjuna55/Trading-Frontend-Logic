import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MarketList from '../components/MarketList';
import Chart from '../components/Chart';
import { tradingAPI } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        const response = await tradingAPI.getMarketData();
        setMarketData(response.data.markets);
        if (response.data.markets.length > 0) {
          setSelectedMarket(response.data.markets[0]);
        }
      } catch (err) {
        setError('Failed to fetch market data');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [navigate]);

  const handleMarketSelect = (market) => {
    setSelectedMarket(market);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          {error && (
            <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {selectedMarket ? `${selectedMarket.pair} Chart` : 'Select a Market'}
                </h2>
                <Chart market={selectedMarket} />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Markets</h2>
                <MarketList
                  markets={marketData}
                  selectedMarket={selectedMarket}
                  onMarketSelect={handleMarketSelect}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
