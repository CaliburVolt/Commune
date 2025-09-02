export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
}

export interface Message {
  id: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'FILE';
  fileUrl?: string;
  senderId: string;
  receiverId?: string;
  groupId?: string;
  createdAt: Date;
  updatedAt: Date;
  sender: {
    id: string;
    username: string;
    name: string;
    avatar?: string;
  };
  group?: {
    id: string;
    name: string;
  };
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  isPrivate: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  members: GroupMember[];
  lastMessage?: Message;
  userRole?: 'ADMIN' | 'MODERATOR' | 'MEMBER';
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: 'ADMIN' | 'MODERATOR' | 'MEMBER';
  joinedAt: Date;
  user: {
    id: string;
    username: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
  };
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
  sender: {
    id: string;
    username: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
  };
  receiver: {
    id: string;
    username: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
  };
}

export interface Friend {
  friendshipId: string;
  friend: {
    id: string;
    username: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen: Date;
  };
  createdAt: Date;
}

export interface Conversation {
  id: string;
  type: 'private' | 'group';
  userId?: string;
  groupId?: string;
  user?: User;
  group?: Group;
  lastMessage?: Message;
  unreadCount?: number;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
  details?: any[];
}
