'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWebRTC } from '@/hooks/useWebRTC';
import { Send, Smile, Paperclip, MoreVertical, Phone, Video, Trash2, X } from 'lucide-react';
import IncomingCallModal from '@/components/call/IncomingCallModal';
import ActiveCallInterface from '@/components/call/ActiveCallInterface';

export default function ChatWindow() {
  const { user } = useAuth();
  const { 
    activeConversation, 
    messages, 
    sendMessage, 
    deleteMessage,
    startTyping, 
    stopTyping,
    typingUsers 
  } = useChat();

  // WebRTC integration
  const {
    isInCall,
    incomingCall,
    activeCall,
    localStream,
    remoteStream,
    isMuted,
    isVideoEnabled,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo,
  } = useWebRTC();

  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      startTyping();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping();
    }, 1000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !activeConversation) return;

    sendMessage(messageInput.trim());
    setMessageInput('');
    
    // Stop typing
    if (isTyping) {
      setIsTyping(false);
      stopTyping();
    }
  };

  // Call handlers
  const handleAudioCall = () => {
    if (!activeConversation || activeConversation.type === 'group' || isInCall) return;
    const targetUser = activeConversation.user;
    if (targetUser) {
      startCall(targetUser.id, targetUser.name || targetUser.username, 'audio');
    }
  };

  const handleVideoCall = () => {
    if (!activeConversation || activeConversation.type === 'group' || isInCall) return;
    const targetUser = activeConversation.user;
    if (targetUser) {
      startCall(targetUser.id, targetUser.name || targetUser.username, 'video');
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessage(messageId);
    setShowDeleteConfirm(null);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  // Enhanced color schemes for different users
  const getUserColors = (userId: string, isGroup: boolean = false) => {
    const colors = [
      {
        bg: 'from-emerald-500 to-teal-500',
        text: 'text-emerald-700',
        avatar: 'from-emerald-400 to-teal-400',
        message: 'from-emerald-100 to-teal-100',
        messageText: 'text-gray-800'
      },
      {
        bg: 'from-cyan-500 to-blue-500',
        text: 'text-cyan-700',
        avatar: 'from-cyan-400 to-blue-400',
        message: 'from-cyan-100 to-blue-100',
        messageText: 'text-gray-800'
      },
      {
        bg: 'from-rose-500 to-pink-500',
        text: 'text-rose-700',
        avatar: 'from-rose-400 to-pink-400',
        message: 'from-rose-100 to-pink-100',
        messageText: 'text-gray-800'
      },
      {
        bg: 'from-amber-500 to-orange-500',
        text: 'text-amber-700',
        avatar: 'from-amber-400 to-orange-400',
        message: 'from-amber-100 to-orange-100',
        messageText: 'text-gray-800'
      },
      {
        bg: 'from-emerald-500 via-teal-500 to-cyan-500',
        text: 'text-emerald-700',
        avatar: 'from-emerald-400 via-teal-400 to-cyan-400',
        message: 'from-emerald-100 via-teal-100 to-cyan-100',
        messageText: 'text-gray-800'
      },
      {
        bg: 'from-indigo-500 to-blue-500',
        text: 'text-indigo-700',
        avatar: 'from-indigo-400 to-blue-400',
        message: 'from-indigo-100 to-blue-100',
        messageText: 'text-gray-800'
      },
      {
        bg: 'from-teal-500 to-cyan-500',
        text: 'text-teal-700',
        avatar: 'from-teal-400 to-cyan-400',
        message: 'from-teal-100 to-cyan-100',
        messageText: 'text-gray-800'
      },
      {
        bg: 'from-lime-500 to-green-500',
        text: 'text-lime-700',
        avatar: 'from-lime-400 to-green-400',
        message: 'from-lime-100 to-green-100',
        messageText: 'text-gray-800'
      }
    ];

    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  const groupMessagesByDate = (messages: any[]) => {
    const grouped: { [key: string]: any[] } = {};
    
    messages.forEach(message => {
      const date = formatDate(message.createdAt);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });

    return grouped;
  };

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 h-full">
        <div className="text-center p-4 md:p-8 max-w-md mx-auto">
          <div className="mx-auto w-20 md:w-32 h-20 md:h-32 bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-xl">
            <Send className="h-10 md:h-16 w-10 md:w-16 text-emerald-600" />
          </div>
          <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
            Ready to start chatting?
          </h3>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed text-sm md:text-base px-4">
            Select a conversation from the sidebar to begin messaging, or start a new chat with your friends.
          </p>
        </div>
      </div>
    );
  }

  const conversationName = activeConversation.type === 'group' 
    ? activeConversation.group?.name 
    : activeConversation.user?.name || activeConversation.user?.username;

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex-1 flex flex-col bg-white h-full min-w-0">
      {/* Chat Header */}
      <div className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 backdrop-blur-md flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              {activeConversation.type === 'group' ? (
                <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                  <span className="text-white font-bold text-base md:text-lg drop-shadow-sm">
                    {conversationName?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              ) : (
                <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                  <span className="text-white font-bold text-base md:text-lg drop-shadow-sm">
                    {conversationName?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-3 md:w-4 h-3 md:h-4 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent truncate">
                {conversationName}
              </h2>
              <p className="text-xs md:text-sm font-medium bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center space-x-1">
                <span className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-pulse"></span>
                <span>{activeConversation.type === 'group' ? 'Group chat' : 'Online'}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
            {/* Only show call buttons for direct messages (not groups) */}
            {activeConversation.type !== 'group' && (
              <>
                <button 
                  onClick={handleAudioCall}
                  disabled={isInCall}
                  className={`p-2 md:p-3 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md ${
                    isInCall ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title="Audio Call"
                >
                  <Phone className="h-4 md:h-5 w-4 md:w-5" />
                </button>
                <button 
                  onClick={handleVideoCall}
                  disabled={isInCall}
                  className={`p-2 md:p-3 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md ${
                    isInCall ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title="Video Call"
                >
                  <Video className="h-4 md:h-5 w-4 md:w-5" />
                </button>
              </>
            )}
            <button className="p-2 md:p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
              <MoreVertical className="h-4 md:h-5 w-4 md:w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 min-h-0">
        {Object.entries(groupedMessages).map(([date, dayMessages]) => (
          <div key={date}>
            {/* Date separator */}
            <div className="flex items-center justify-center my-6">
              <div className="bg-white/90 backdrop-blur-sm px-4 md:px-6 py-2 rounded-full shadow-md border border-gray-200/50">
                <span className="text-xs text-gray-600 font-semibold tracking-wide">{date}</span>
              </div>
            </div>

            {/* Messages for this date */}
            {dayMessages.map((message, index) => {
              const isOwnMessage = message.sender.id === user?.id;
              const showAvatar = !isOwnMessage && (index === 0 || dayMessages[index - 1]?.sender.id !== message.sender.id);
              const userColors = getUserColors(message.sender.id, activeConversation.type === 'group');
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group px-2 md:px-0`}
                >
                  <div className={`max-w-[85%] md:max-w-xs lg:max-w-md flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 relative`}>
                    {/* Avatar */}
                    {!isOwnMessage && (
                      <div className="w-6 md:w-8 h-6 md:h-8 mb-1 flex-shrink-0">
                        {showAvatar ? (
                          <div className={`w-6 md:w-8 h-6 md:h-8 bg-gradient-to-br ${userColors.avatar} rounded-full flex items-center justify-center shadow-lg ring-1 ring-white`}>
                            <span className="text-white text-xs font-bold drop-shadow-sm">
                              {message.sender.name?.charAt(0) || message.sender.username?.charAt(0)}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    )}

                    <div className={`${isOwnMessage ? 'mr-1 md:mr-2' : 'ml-1 md:ml-2'} relative flex-1 min-w-0`}>
                      {!isOwnMessage && activeConversation.type === 'group' && showAvatar && (
                        <div className={`text-xs font-medium mb-1 px-3 ${userColors.text}`}>
                          {message.sender.name || message.sender.username}
                        </div>
                      )}
                      
                      <div
                        className={`px-3 md:px-5 py-2 md:py-3 rounded-2xl shadow-lg animate-slideInRight relative transition-all duration-200 hover:shadow-xl ${
                          isOwnMessage
                            ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-emerald-200'
                            : `bg-white text-gray-800 border border-gray-200 shadow-gray-200`
                        }`}
                      >
                        <p className={`text-sm leading-relaxed break-words ${
                          isOwnMessage ? 'text-white' : 'text-gray-800'
                        }`}>
                          {message.content}
                        </p>
                        
                        {/* Delete button for own messages */}
                        {isOwnMessage && (
                          <button
                            onClick={() => setShowDeleteConfirm(message.id)}
                            className="absolute -top-3 -right-3 p-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-red-300 transform hover:scale-110 z-10"
                            title="Delete message"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      
                      <div className={`text-xs text-gray-500 mt-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity font-medium ${
                        isOwnMessage ? 'text-right' : 'text-left'
                      }`}>
                        {formatTime(message.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Typing indicator */}
        {Object.keys(typingUsers).length > 0 && (
          <div className="flex justify-start px-2 md:px-6">
            <div className="bg-gradient-to-r from-white to-emerald-50 rounded-2xl px-4 md:px-6 py-3 shadow-lg border border-emerald-100">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full typing-dot"></div>
                </div>
                <span className="text-xs text-emerald-700 font-medium">Someone is typing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-3 md:px-6 py-3 md:py-4 border-t border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 backdrop-blur-md flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2 md:space-x-4">
          <button
            type="button"
            className="flex-shrink-0 p-2 md:p-3 text-gray-500 hover:text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Paperclip className="h-4 md:h-5 w-4 md:w-5" />
          </button>
          
          <div className="flex-1 relative min-w-0">
            <input
              type="text"
              value={messageInput}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="w-full px-3 md:px-5 py-2 md:py-3 border border-emerald-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-800 placeholder-gray-500 text-sm md:text-base"
            />
            <button
              type="button"
              className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 p-1.5 md:p-2 text-gray-500 hover:text-amber-600 rounded-lg transition-colors"
            >
              <Smile className="h-4 md:h-5 w-4 md:w-5" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="flex-shrink-0 p-2 md:p-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-xl hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>

      {/* Call Components */}
      <IncomingCallModal
        isOpen={!!incomingCall}
        callData={incomingCall}
        onAccept={acceptCall}
        onReject={rejectCall}
      />

      <ActiveCallInterface
        isOpen={isInCall && !!activeCall}
        callData={activeCall}
        localStream={localStream}
        remoteStream={remoteStream}
        onEndCall={endCall}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
        isMuted={isMuted}
        isVideoEnabled={isVideoEnabled}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Delete Message</h3>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMessage(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
