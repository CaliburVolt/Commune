import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    
    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  // Message methods
  sendMessage(data: {
    content: string;
    type?: 'TEXT' | 'IMAGE' | 'FILE';
    receiverId?: string;
    groupId?: string;
  }) {
    this.socket?.emit('send_message', data);
  }

  onNewMessage(callback: (message: any) => void) {
    this.socket?.on('new_message', callback);
  }

  onMessageSent(callback: (message: any) => void) {
    this.socket?.on('message_sent', callback);
  }

  // Group methods
  joinGroup(groupId: string) {
    this.socket?.emit('join_group', { groupId });
  }

  leaveGroup(groupId: string) {
    this.socket?.emit('leave_group', { groupId });
  }

  onJoinedGroup(callback: (data: { groupId: string }) => void) {
    this.socket?.on('joined_group', callback);
  }

  onLeftGroup(callback: (data: { groupId: string }) => void) {
    this.socket?.on('left_group', callback);
  }

  // Typing indicators
  startTyping(data: { receiverId?: string; groupId?: string }) {
    this.socket?.emit('typing_start', data);
  }

  stopTyping(data: { receiverId?: string; groupId?: string }) {
    this.socket?.emit('typing_stop', data);
  }

  onUserTyping(callback: (data: { userId: string; receiverId?: string; groupId?: string }) => void) {
    this.socket?.on('user_typing', callback);
  }

  onUserStoppedTyping(callback: (data: { userId: string; receiverId?: string; groupId?: string }) => void) {
    this.socket?.on('user_stopped_typing', callback);
  }

  // Friend methods
  sendFriendRequest(receiverId: string) {
    this.socket?.emit('send_friend_request', { receiverId });
  }

  onFriendRequestReceived(callback: (data: { senderId: string; timestamp: Date }) => void) {
    this.socket?.on('friend_request_received', callback);
  }

  onFriendOnlineStatus(callback: (data: { userId: string; isOnline: boolean }) => void) {
    this.socket?.on('friend_online', callback);
  }

  // Remove listeners
  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

export const socketService = new SocketService();
