'use client';

import { useState, useEffect } from 'react';
import { User, UserPlus, UserCheck, UserX, MessageCircle } from 'lucide-react';

interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  sender?: {
    id: string;
    username: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
  };
  receiver?: {
    id: string;
    username: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
  };
}

interface Friend {
  friendshipId: string;
  friend: {
    id: string;
    username: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
  };
  createdAt: string;
}

interface FriendRequestsProps {
  onStartChat: (userId: string) => void;
}

export default function FriendRequests({ onStartChat }: FriendRequestsProps) {
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'friends'>('received');

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      // Fetch received requests
      const receivedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/requests/received`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Fetch sent requests
      const sentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/requests/sent`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Fetch friends list
      const friendsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (receivedResponse.ok) {
        const receivedData = await receivedResponse.json();
        setReceivedRequests(receivedData.friendRequests || []);
      }

      if (sentResponse.ok) {
        const sentData = await sentResponse.json();
        setSentRequests(sentData.friendRequests || []);
      }

      if (friendsResponse.ok) {
        const friendsData = await friendsResponse.json();
        console.log('Friends response data:', friendsData);
        console.log('Friends array:', friendsData.friends);
        if (friendsData.friends) {
          friendsData.friends.forEach((friend: any, index: number) => {
            console.log(`Friend ${index}:`, friend);
          });
        }
        setFriends(friendsData.friends || []);
      } else {
        console.error('Failed to fetch friends:', await friendsResponse.text());
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string, senderId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/request/${requestId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Friend request accepted:', data);
        // Remove from received requests
        setReceivedRequests(prev => prev.filter(req => req.id !== requestId));
        
        // Refresh friends list to include the newly accepted friend
        await fetchFriendRequests();
        
        // Show success message and offer to start chat
        const startChat = window.confirm('Friend request accepted! Would you like to start chatting now?');
        if (startChat) {
          console.log('Starting chat with senderId:', senderId);
          if (!senderId) {
            console.error('SenderId is undefined or null');
            alert('Unable to start chat: Sender ID is missing');
            return;
          }
          onStartChat(senderId);
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to accept friend request:', errorData);
        alert(`Failed to accept friend request: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      alert('Error accepting friend request. Please try again.');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/request/${requestId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Friend request rejected:', data);
        // Remove from received requests
        setReceivedRequests(prev => prev.filter(req => req.id !== requestId));
        alert('Friend request rejected.');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to reject friend request:', errorData);
        alert(`Failed to reject friend request: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      alert('Error rejecting friend request. Please try again.');
    }
  };

  const handleStartChat = (userId: string) => {
    console.log('FriendRequests: handleStartChat called with userId:', userId);
    if (!userId) {
      console.error('FriendRequests: No userId provided to handleStartChat');
      alert('Unable to start chat: User ID is missing');
      return;
    }
    onStartChat(userId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet-200 border-t-violet-600"></div>
        <p className="ml-3 text-gray-500">Loading friend requests...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 ${
            activeTab === 'received'
              ? 'text-violet-600 border-b-2 border-violet-600 bg-white'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <UserPlus className="h-4 w-4" />
            <span>Received ({receivedRequests.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 ${
            activeTab === 'sent'
              ? 'text-violet-600 border-b-2 border-violet-600 bg-white'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <UserX className="h-4 w-4" />
            <span>Sent ({sentRequests.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 ${
            activeTab === 'friends'
              ? 'text-violet-600 border-b-2 border-violet-600 bg-white'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <User className="h-4 w-4" />
            <span>Friends ({friends.length})</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'received' && (
          <div className="space-y-3">
            {receivedRequests.length === 0 ? (
              <div className="text-center py-8">
                <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No friend requests received</p>
                <p className="text-gray-400 text-sm">When someone sends you a friend request, it will appear here</p>
              </div>
            ) : (
              receivedRequests.map((request, index) => (
                <div
                  key={request.id || `received-${index}`}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {request.sender?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        {request.sender?.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{request.sender?.name || 'Unknown'}</h3>
                        <p className="text-sm text-gray-500">@{request.sender?.username || 'unknown'}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleAcceptRequest(request.id, request.senderId)}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-all duration-200"
                        title="Accept request"
                      >
                        <UserCheck className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-all duration-200"
                        title="Reject request"
                      >
                        <UserX className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'sent' && (
          <div className="space-y-3">
            {sentRequests.length === 0 ? (
              <div className="text-center py-8">
                <UserX className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No pending sent requests</p>
                <p className="text-gray-400 text-sm">Friend requests you send will appear here until they're accepted or rejected</p>
              </div>
            ) : (
              sentRequests.map((request, index) => (
                <div
                  key={request.id || `sent-${index}`}
                  className="bg-white border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {request.receiver?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        {request.receiver?.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{request.receiver?.name || 'Unknown'}</h3>
                        <p className="text-sm text-gray-500">@{request.receiver?.username || 'unknown'}</p>
                        <p className="text-xs text-gray-400">
                          Sent {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="space-y-3">
            {friends.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No friends yet</p>
                <p className="text-gray-400 text-sm">When you accept friend requests, your friends will appear here</p>
              </div>
            ) : (
              friends.map((friendData, index) => (
                <div
                  key={friendData.friend.id || `friend-${index}`}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {friendData.friend.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        {friendData.friend.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{friendData.friend.name || 'Unknown'}</h3>
                        <p className="text-sm text-gray-500">@{friendData.friend.username || 'unknown'}</p>
                        <p className="text-xs text-gray-400">
                          {friendData.friend.isOnline ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <button
                        onClick={() => handleStartChat(friendData.friend.id)}
                        className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-all duration-200 flex items-center space-x-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Chat</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
