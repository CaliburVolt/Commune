import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const initializeSocket = (io: Server, prisma: PrismaClient) => {
  // Authentication middleware for Socket.IO
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, username: true, isOnline: true }
      });

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = user.id;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', async (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.userId} connected`);

    // Update user online status
    if (socket.userId) {
      await prisma.user.update({
        where: { id: socket.userId },
        data: { isOnline: true, lastSeen: new Date() }
      });

      // Join user to their personal room
      socket.join(`user_${socket.userId}`);

      // Join user to all their group rooms
      const userGroups = await prisma.groupMember.findMany({
        where: { userId: socket.userId },
        select: { groupId: true }
      });

      userGroups.forEach(group => {
        socket.join(`group_${group.groupId}`);
      });

      // Notify friends that user is online
      const friends = await prisma.friend.findMany({
        where: {
          OR: [
            { user1Id: socket.userId },
            { user2Id: socket.userId },
          ]
        }
      });

      friends.forEach(friendship => {
        const friendId = friendship.user1Id === socket.userId ? friendship.user2Id : friendship.user1Id;
        socket.to(`user_${friendId}`).emit('friend_online', {
          userId: socket.userId,
          isOnline: true
        });
      });
    }

    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        const { content, type = 'TEXT', receiverId, groupId } = data;

        if (!socket.userId) return;

        // Validate message data
        if (!content || (!receiverId && !groupId) || (receiverId && groupId)) {
          socket.emit('error', { message: 'Invalid message data' });
          return;
        }

        // Create message in database
        const message = await prisma.message.create({
          data: {
            content,
            type,
            senderId: socket.userId,
            receiverId,
            groupId,
          },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
              }
            }
          }
        });

        if (groupId) {
          // Send to group members
          socket.to(`group_${groupId}`).emit('new_message', message);
        } else if (receiverId) {
          // Send to specific user
          socket.to(`user_${receiverId}`).emit('new_message', message);
        }

        // Send confirmation to sender
        socket.emit('message_sent', message);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle joining groups
    socket.on('join_group', async (data) => {
      try {
        const { groupId } = data;
        
        if (!socket.userId) return;

        // Verify user is a member of the group
        const membership = await prisma.groupMember.findUnique({
          where: {
            userId_groupId: {
              userId: socket.userId,
              groupId,
            }
          }
        });

        if (membership) {
          socket.join(`group_${groupId}`);
          socket.emit('joined_group', { groupId });
        } else {
          socket.emit('error', { message: 'Not a member of this group' });
        }
      } catch (error) {
        console.error('Join group error:', error);
        socket.emit('error', { message: 'Failed to join group' });
      }
    });

    // Handle leaving groups
    socket.on('leave_group', (data) => {
      const { groupId } = data;
      socket.leave(`group_${groupId}`);
      socket.emit('left_group', { groupId });
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      const { receiverId, groupId } = data;
      
      if (groupId) {
        socket.to(`group_${groupId}`).emit('user_typing', {
          userId: socket.userId,
          groupId,
        });
      } else if (receiverId) {
        socket.to(`user_${receiverId}`).emit('user_typing', {
          userId: socket.userId,
          receiverId,
        });
      }
    });

    socket.on('typing_stop', (data) => {
      const { receiverId, groupId } = data;
      
      if (groupId) {
        socket.to(`group_${groupId}`).emit('user_stopped_typing', {
          userId: socket.userId,
          groupId,
        });
      } else if (receiverId) {
        socket.to(`user_${receiverId}`).emit('user_stopped_typing', {
          userId: socket.userId,
          receiverId,
        });
      }
    });

    // Handle friend requests
    socket.on('send_friend_request', async (data) => {
      try {
        const { receiverId } = data;
        
        if (!socket.userId) return;

        // Notify receiver about friend request
        socket.to(`user_${receiverId}`).emit('friend_request_received', {
          senderId: socket.userId,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Friend request notification error:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`User ${socket.userId} disconnected`);

      if (socket.userId) {
        // Update user offline status
        await prisma.user.update({
          where: { id: socket.userId },
          data: { isOnline: false, lastSeen: new Date() }
        });

        // Notify friends that user is offline
        const friends = await prisma.friend.findMany({
          where: {
            OR: [
              { user1Id: socket.userId },
              { user2Id: socket.userId },
            ]
          }
        });

        friends.forEach(friendship => {
          const friendId = friendship.user1Id === socket.userId ? friendship.user2Id : friendship.user1Id;
          socket.to(`user_${friendId}`).emit('friend_online', {
            userId: socket.userId,
            isOnline: false
          });
        });
      }
    });
  });
};
