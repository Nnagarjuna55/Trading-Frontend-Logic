import React from 'react';

const Register = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form className="bg-gray-700 p-8 rounded">
        <h2 className="text-white text-2xl mb-4">Register</h2>
        <input type="text" placeholder="Username" className="w-full p-2 mb-4 bg-gray-600 text-white" />
        <input type="email" placeholder="Email" className="w-full p-2 mb-4 bg-gray-600 text-white" />
        <input type="password" placeholder="Password" className="w-full p-2 mb-4 bg-gray-600 text-white" />
        <button className="w-full bg-yellow-400 py-2">Register</button>
      </form>
    </div>
  );
};

export default Register;
