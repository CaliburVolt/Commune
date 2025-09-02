'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  MessageCircle, 
  Users, 
  UserPlus, 
  Settings, 
  LogOut,
  Search,
  Plus,
  MoreHorizontal
} from 'lucide-react';

export default function ChatSidebar() {
  const { user, logout } = useAuth();
  const { conversations, activeConversation, setActiveConversation } = useChat();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'chats' | 'friends' | 'groups'>('chats');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv => {
    const name = conv.type === 'group' 
      ? conv.group?.name 
      : conv.user?.name || conv.user?.username;
    return name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatLastMessageTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-violet-50 to-blue-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                ChatFlow
              </h1>
              <p className="text-xs text-gray-500">Connected</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
              )}
            </button>
            <button className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-100 rounded-lg transition-all duration-200">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 py-4 px-3 text-sm font-medium transition-all duration-200 ${
            activeTab === 'chats'
              ? 'text-violet-600 border-b-2 border-violet-600 bg-white'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>Chats</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-4 px-3 text-sm font-medium transition-all duration-200 ${
            activeTab === 'friends'
              ? 'text-violet-600 border-b-2 border-violet-600 bg-white'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Friends</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex-1 py-4 px-3 text-sm font-medium transition-all duration-200 ${
            activeTab === 'groups'
              ? 'text-violet-600 border-b-2 border-violet-600 bg-white'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <UserPlus className="h-4 w-4" />
            <span>Groups</span>
          </div>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chats' && (
          <div className="p-2">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No conversations yet</p>
                <p className="text-gray-400 text-xs">Start a new chat to get started</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const isActive = activeConversation?.id === conversation.id;
                const conversationName = conversation.type === 'group' 
                  ? conversation.group?.name 
                  : conversation.user?.name || conversation.user?.username;

                return (
                  <button
                    key={conversation.id}
                    onClick={() => setActiveConversation(conversation)}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-200 mb-2 hover:shadow-md ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg'
                        : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative flex-shrink-0">
                        {conversation.type === 'group' ? (
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
                            isActive 
                              ? 'bg-white/20 text-white' 
                              : 'bg-gradient-to-br from-violet-500 to-blue-500 text-white'
                          }`}>
                            <span className="font-bold">
                              {conversationName?.charAt(0)}
                            </span>
                          </div>
                        ) : (
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
                            isActive 
                              ? 'bg-white/20 text-white' 
                              : 'bg-gradient-to-br from-green-500 to-teal-500 text-white'
                          }`}>
                            <span className="font-bold">
                              {conversationName?.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-semibold truncate ${
                            isActive ? 'text-white' : 'text-gray-900'
                          }`}>
                            {conversationName}
                          </h3>
                          {conversation.lastMessage && (
                            <span className={`text-xs ${
                              isActive ? 'text-white/70' : 'text-gray-500'
                            }`}>
                              {formatLastMessageTime(conversation.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        
                        {conversation.lastMessage && (
                          <p className={`text-sm truncate mt-1 ${
                            isActive ? 'text-white/80' : 'text-gray-600'
                          }`}>
                            {conversation.lastMessage.content}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-xs ${
                            isActive ? 'text-white/60' : 'text-gray-500'
                          }`}>
                            {conversation.type === 'group' ? 'Group' : 'Direct'}
                          </span>
                          {(conversation.unreadCount || 0) > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {conversation.unreadCount || 0}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="p-4 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Friends feature coming soon</p>
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="p-4 text-center">
            <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Groups feature coming soon</p>
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-violet-50 to-blue-50">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">
                {user?.name?.charAt(0) || user?.username?.charAt(0)}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {user?.name || user?.username}
            </h3>
            <p className="text-sm text-green-600 font-medium">Online</p>
          </div>
          
          <div className="flex items-center space-x-1">
            <button className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-100 rounded-lg transition-all duration-200">
              <MoreHorizontal className="h-4 w-4" />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="absolute bottom-24 right-6">
        <button className="w-14 h-14 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center">
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
