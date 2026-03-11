import React, { useState } from 'react';
import { registerUser, loginUser, User } from '../services/authService';

interface SignInProps {
  onSignInSuccess: (user: User) => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignInSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const result = await loginUser(username, password);
        if (result.success && result.user) {
          onSignInSuccess(result.user);
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        // Register
        const result = await registerUser(username, email, password);
        if (result.success) {
          if (result.needsConfirmation) {
            // Email confirmation required — show message
            setConfirmationSent(true);
          } else {
            // Email confirmation disabled — auto login
            const loginResult = await loginUser(username, password);
            if (loginResult.success && loginResult.user) {
              onSignInSuccess(loginResult.user);
            }
          }
        } else {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (confirmationSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-slate-700 text-center">
            <div className="w-16 h-16 bg-sky-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
            <p className="text-slate-400 mb-6">
              We sent a confirmation link to <span className="text-sky-400">{email}</span>. Click it to activate your account, then sign in.
            </p>
            <button
              onClick={() => { setConfirmationSent(false); setIsLogin(true); }}
              className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-md transition"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-slate-700 animate-slide-in-up">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-600 mb-2">
              TeamFinder
            </h1>
            <p className="text-slate-400">
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-md mb-6 animate-fade-in">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                {isLogin ? 'Username or Email' : 'Username'}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                placeholder={isLogin ? 'Enter username or email' : 'Choose a username'}
                required
                autoComplete={isLogin ? 'username' : 'off'}
              />
            </div>

            {/* Email (Register only) */}
            {!isLogin && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                placeholder={isLogin ? 'Enter password' : 'Choose a password (min 6 characters)'}
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                minLength={6}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                </>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              {' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setUsername('');
                  setEmail('');
                  setPassword('');
                }}
                className="text-sky-400 hover:text-sky-300 font-semibold transition"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Info Text */}
          <div className="mt-6 p-4 bg-sky-500/10 border border-sky-500/30 rounded-md">
            <p className="text-xs text-sky-300 text-center">
              Your data is stored locally on your device and synced across sessions. No data is sent to external servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
