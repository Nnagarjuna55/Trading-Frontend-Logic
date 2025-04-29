import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { tradingAPI } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [walletBalance, setWalletBalance] = useState(null);
  const [openOrders, setOpenOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [balanceResponse, ordersResponse] = await Promise.all([
          tradingAPI.getWalletBalance(),
          tradingAPI.getOpenOrders()
        ]);
        setWalletBalance(balanceResponse.data.balance);
        setOpenOrders(ordersResponse.data.orders);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

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
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Wallet Balance Card */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Wallet Balance</h3>
            <p className="text-3xl font-bold text-white">
              ${walletBalance?.toLocaleString() || '0.00'}
            </p>
            <div className="mt-4 flex space-x-4">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-medium">
                Deposit
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium">
                Withdraw
              </button>
            </div>
          </div>

          {/* Open Orders Card */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-gray-400 text-sm font-medium mb-4">Open Orders</h3>
            {openOrders.length === 0 ? (
              <p className="text-gray-400">No open orders</p>
            ) : (
              <div className="space-y-4">
                {openOrders.map((order) => (
                  <div key={order.id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{order.pair}</span>
                      <span className={`text-sm ${order.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                        {order.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                      <p>Price: ${order.price}</p>
                      <p>Amount: {order.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Card */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-gray-400 text-sm font-medium mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/markets')}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-2 rounded-lg font-medium"
              >
                Trade Markets
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium">
                View History
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium">
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
