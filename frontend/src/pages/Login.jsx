import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ import

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // ✅ add navigate

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === 'badru773dhdc@gmail.com' && password === 'husain') {
      localStorage.setItem('auth', 'true');
      onLogin();        // ✅ updates auth state
      navigate('/');    // ✅ redirect to Home
    } else {
      alert('❌ Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-100 via-emerald-100 to-yellow-50">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-emerald-200 ring-1 ring-blue-300/20">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-emerald-800">
          Login to Leaderboard
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2 font-semibold">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2 font-semibold">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 rounded hover:bg-emerald-600 transition-colors text-lg font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
