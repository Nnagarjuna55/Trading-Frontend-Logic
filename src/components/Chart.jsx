import React, { useEffect, useRef, useState } from 'react';
import { tradingAPI } from '../services/api';

const Chart = ({ market }) => {
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!market) return;

    const fetchChartData = async () => {
      try {
        setLoading(true);
        const response = await tradingAPI.getMarketChartData(market.id);
        setChartData(response.data.data);
      } catch (err) {
        setError('Failed to fetch chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
    const interval = setInterval(fetchChartData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [market]);

  useEffect(() => {
    if (!chartRef.current || !chartData.length) return;

    // Initialize chart here (using your preferred charting library)
    // This is a placeholder for chart initialization
    const ctx = chartRef.current.getContext('2d');
    // Add your chart initialization code here
  }, [chartData]);

  if (!market) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-700 rounded-lg">
        <p className="text-gray-400">Select a market to view chart</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-700 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-700 rounded-lg">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative h-96">
      <canvas ref={chartRef} className="w-full h-full" />
      <div className="absolute top-4 left-4">
        <div className="bg-gray-800 bg-opacity-75 p-2 rounded">
          <p className="text-white text-sm">Last Price: ${market.lastPrice}</p>
          <p className={`text-sm ${market.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            24h Change: {market.change24h}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chart;
