'use client';

import { useState, useEffect } from 'react';
import { Search, User, UserPlus, MessageCircle, X } from 'lucide-react';

interface SearchUser {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  isOnline: boolean;
}

interface UserSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (userId: string) => void;
}

export default function UserSearch({ isOpen, onClose, onStartChat }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const timeoutId = setTimeout(() => {
        searchUsers(searchQuery);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchUsers = async (query: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('No authentication token found');
        setSearchResults([]);
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.users || []);
      } else if (response.status === 401) {
        console.error('Authentication failed - token may be invalid');
        // Clear invalid token
        localStorage.removeItem('authToken');
        setSearchResults([]);
        // Optionally redirect to login or show login modal
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to search users:', errorData);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = (userId: string) => {
    onStartChat(userId);
    onClose();
    setSearchQuery('');
    setSearchResults([]);
  };

  const sendFriendRequest = async (userId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      console.log('Sending friend request to user:', userId);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ receiverId: userId }),
      });

      console.log('Friend request response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Friend request sent successfully:', data);
        // Show success message
        alert('Friend request sent successfully!');
      } else if (response.status === 401) {
        console.error('Authentication failed - token may be invalid');
        localStorage.removeItem('authToken');
        alert('Authentication failed. Please login again.');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to send friend request:', errorData);
        alert(`Failed to send friend request: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Error sending friend request. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-violet-50 to-blue-50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Find People</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Search Input */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900"
              autoFocus
            />
          </div>
        </div>

        {/* Search Results */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet-200 border-t-violet-600 mx-auto"></div>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Searching...</p>
            </div>
          )}

          {!loading && searchQuery.length >= 2 && searchResults.length === 0 && (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No users found</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">Try searching with different keywords</p>
            </div>
          )}

          {!loading && searchQuery.length < 2 && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Type at least 2 characters to search</p>
            </div>
          )}

          {!loading && searchResults.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  {user.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {user.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleStartChat(user.id)}
                  className="p-2 text-violet-600 hover:text-violet-700 hover:bg-violet-100 dark:hover:bg-violet-900/30 rounded-lg transition-all duration-200"
                  title="Start chat"
                >
                  <MessageCircle className="h-5 w-5" />
                </button>
                <button
                  onClick={() => sendFriendRequest(user.id)}
                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
                  title="Send friend request"
                >
                  <UserPlus className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
