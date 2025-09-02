'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Message, Conversation, User } from '@/types';
import { socketService } from '@/lib/socket';
import api from '@/lib/api';
import { useAuth } from './AuthContext';

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  onlineUsers: { [userId: string]: boolean };
  typingUsers: { [key: string]: boolean };
  loading: boolean;
  setActiveConversation: (conversation: Conversation | null) => void;
  sendMessage: (content: string, type?: 'TEXT' | 'IMAGE' | 'FILE') => void;
  loadMessages: (conversation: Conversation) => Promise<void>;
  startTyping: () => void;
  stopTyping: () => void;
  refreshConversations: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<{ [userId: string]: boolean }>({});
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);

  // Load conversations when user logs in
  useEffect(() => {
    if (user) {
      refreshConversations();
    }
  }, [user]);

  // Socket event listeners
  useEffect(() => {
    if (!user) return;

    const socket = socketService.getSocket();
    if (!socket) return;

    // Listen for new messages
    socketService.onNewMessage((message: Message) => {
      setMessages((prev) => [...prev, message]);
      
      // Update conversations list
      refreshConversations();
    });

    // Listen for message sent confirmation
    socketService.onMessageSent((message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for typing indicators
    socketService.onUserTyping((data) => {
      const key = data.groupId ? `group_${data.groupId}` : `user_${data.userId}`;
      setTypingUsers((prev) => ({ ...prev, [key]: true }));
      
      // Clear typing after 3 seconds
      setTimeout(() => {
        setTypingUsers((prev) => {
          const newState = { ...prev };
          delete newState[key];
          return newState;
        });
      }, 3000);
    });

    socketService.onUserStoppedTyping((data) => {
      const key = data.groupId ? `group_${data.groupId}` : `user_${data.userId}`;
      setTypingUsers((prev) => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
    });

    // Listen for friend online status
    socketService.onFriendOnlineStatus((data) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [data.userId]: data.isOnline,
      }));
    });

    return () => {
      socketService.removeAllListeners();
    };
  }, [user]);

  const refreshConversations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/chat/conversations');
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversation: Conversation) => {
    try {
      setLoading(true);
      const params = conversation.type === 'group' 
        ? { groupId: conversation.groupId }
        : { receiverId: conversation.userId };

      const response = await api.get('/chat/messages', { params });
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = (content: string, type: 'TEXT' | 'IMAGE' | 'FILE' = 'TEXT') => {
    if (!activeConversation) return;

    const messageData = {
      content,
      type,
      ...(activeConversation.type === 'group' 
        ? { groupId: activeConversation.groupId }
        : { receiverId: activeConversation.userId }
      ),
    };

    socketService.sendMessage(messageData);
  };

  const startTyping = () => {
    if (!activeConversation) return;

    const data = activeConversation.type === 'group'
      ? { groupId: activeConversation.groupId }
      : { receiverId: activeConversation.userId };

    socketService.startTyping(data);
  };

  const stopTyping = () => {
    if (!activeConversation) return;

    const data = activeConversation.type === 'group'
      ? { groupId: activeConversation.groupId }
      : { receiverId: activeConversation.userId };

    socketService.stopTyping(data);
  };

  const value: ChatContextType = {
    conversations,
    activeConversation,
    messages,
    onlineUsers,
    typingUsers,
    loading,
    setActiveConversation: (conversation) => {
      setActiveConversation(conversation);
      if (conversation) {
        loadMessages(conversation);
        if (conversation.type === 'group') {
          socketService.joinGroup(conversation.groupId!);
        }
      }
    },
    sendMessage,
    loadMessages,
    startTyping,
    stopTyping,
    refreshConversations,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
