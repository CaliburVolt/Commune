'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Smile, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';

export default function ChatWindow() {
  const { user } = useAuth();
  const { 
    activeConversation, 
    messages, 
    sendMessage, 
    startTyping, 
    stopTyping,
    typingUsers 
  } = useChat();
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center p-8">
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-violet-100 to-blue-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Send className="h-16 w-16 text-violet-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Ready to start chatting?
          </h3>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
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
    <div className="flex-1 flex flex-col bg-white border-l border-gray-200">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {activeConversation.type === 'group' ? (
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {conversationName?.charAt(0)}
                  </span>
                </div>
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {conversationName?.charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {conversationName}
              </h2>
              <p className="text-sm text-green-600 font-medium">
                {activeConversation.type === 'group' ? 'Group chat' : 'Online'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-3 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all duration-200">
              <Phone className="h-5 w-5" />
            </button>
            <button className="p-3 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all duration-200">
              <Video className="h-5 w-5" />
            </button>
            <button className="p-3 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all duration-200">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-blue-50">
        {Object.entries(groupedMessages).map(([date, dayMessages]) => (
          <div key={date}>
            {/* Date separator */}
            <div className="flex items-center justify-center my-6">
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200">
                <span className="text-xs text-gray-600 font-medium">{date}</span>
              </div>
            </div>

            {/* Messages for this date */}
            {dayMessages.map((message, index) => {
              const isOwnMessage = message.sender.id === user?.id;
              const showAvatar = !isOwnMessage && (index === 0 || dayMessages[index - 1]?.sender.id !== message.sender.id);
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group`}
                >
                  <div className={`max-w-xs lg:max-w-md flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                    {/* Avatar */}
                    {!isOwnMessage && (
                      <div className="w-8 h-8 mb-1">
                        {showAvatar ? (
                          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white text-xs font-medium">
                              {message.sender.name?.charAt(0) || message.sender.username?.charAt(0)}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    )}

                    <div className={`${isOwnMessage ? 'mr-2' : 'ml-2'}`}>
                      {!isOwnMessage && activeConversation.type === 'group' && showAvatar && (
                        <div className="text-xs text-gray-500 mb-1 px-3">
                          {message.sender.name || message.sender.username}
                        </div>
                      )}
                      
                      <div
                        className={`px-4 py-3 rounded-2xl shadow-sm animate-slideInRight ${
                          isOwnMessage
                            ? 'bg-gradient-to-r from-violet-500 to-blue-500 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                      
                      <div className={`text-xs text-gray-500 mt-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity ${
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
          <div className="flex justify-start px-6">
            <div className="bg-white rounded-2xl px-6 py-3 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                </div>
                <span className="text-xs text-gray-500">Someone is typing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white/80 backdrop-blur-md">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
          <button
            type="button"
            className="flex-shrink-0 p-3 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all duration-200"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={messageInput}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-violet-600 rounded-lg transition-colors"
            >
              <Smile className="h-5 w-5" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="flex-shrink-0 p-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl hover:from-violet-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
