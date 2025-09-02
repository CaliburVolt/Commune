'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Check, X, Loader2 } from 'lucide-react';

interface UsernameSetupProps {
  tempOAuthData: {
    provider: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  onComplete: () => void;
}

export default function UsernameSetup({ tempOAuthData, onComplete }: UsernameSetupProps) {
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const checkUsername = async (value: string) => {
    if (value.length < 3) {
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch('/api/auth/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: value }),
      });

      const data = await response.json();
      setIsAvailable(data.available);
    } catch (error) {
      console.error('Error checking username:', error);
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(value);
    setError('');
    
    // Debounce username check
    const timeoutId = setTimeout(() => checkUsername(value), 500);
    return () => clearTimeout(timeoutId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !isAvailable) {
      setError('Please choose a valid username');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/oauth/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          tempOAuthData,
        }),
      });

      if (response.ok) {
        onComplete();
        router.push('/chat');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to complete setup');
      }
    } catch (error) {
      console.error('Error completing setup:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          {tempOAuthData.image ? (
            <img 
              src={tempOAuthData.image} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-10 h-10 text-white" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome, {tempOAuthData.name}!
        </h2>
        <p className="text-gray-600">
          Please choose a username to complete your account setup
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <div className="relative">
            <input
              id="username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter username"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
              minLength={3}
              maxLength={20}
              required
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isChecking ? (
                <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
              ) : username.length >= 3 ? (
                isAvailable ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )
              ) : null}
            </div>
          </div>
          {username.length >= 3 && !isChecking && (
            <p className={`mt-2 text-sm ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
              {isAvailable ? 'Username is available!' : 'Username is already taken'}
            </p>
          )}
          {username.length > 0 && username.length < 3 && (
            <p className="mt-2 text-sm text-gray-500">
              Username must be at least 3 characters
            </p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!username || !isAvailable || isSubmitting}
          className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-violet-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
              Setting up account...
            </>
          ) : (
            'Complete Setup'
          )}
        </button>
      </form>
    </div>
  );
}
