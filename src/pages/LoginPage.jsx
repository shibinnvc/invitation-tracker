import { useState } from 'react';
import { Heart, Lock } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function LoginPage({ onLogin }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { getPin } = useData();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const storedPin = await getPin();
      if (pin === storedPin) {
        onLogin();
      } else {
        setError('Incorrect PIN. Please try again.');
        setPin('');
      }
    } catch {
      setError('Connection error. Please check your internet.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="bg-rose-100 rounded-full p-4">
            <Heart className="w-10 h-10 text-rose-600 fill-rose-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-1">Wedding Invitation</h1>
        <p className="text-gray-500 text-sm mb-8">Enter PIN to access the tracker</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              inputMode="numeric"
              maxLength={8}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-center text-xl tracking-widest focus:outline-none focus:border-rose-400 transition"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 rounded-lg py-2 px-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={!pin || loading}
            className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Enter'
            )}
          </button>
        </form>

        <p className="text-gray-400 text-xs mt-6">Default PIN: 1234</p>
      </div>
    </div>
  );
}
