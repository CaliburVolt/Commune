import express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { sendMessageSchema } from '../utils/validation';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Create or get existing conversation
router.post('/create', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { type, participantId, groupName } = req.body;

    if (type === 'direct') {
      if (!participantId) {
        return res.status(400).json({ error: 'participantId is required for direct conversations' });
      }

      // Check if user exists
      const participant = await prisma.user.findUnique({
        where: { id: participantId },
        select: { id: true, username: true, name: true, avatar: true, isOnline: true }
      });

      if (!participant) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if conversation already exists
      const existingMessage = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: req.user!.id, receiverId: participantId, groupId: null },
            { senderId: participantId, receiverId: req.user!.id, groupId: null },
          ]
        },
        include: {
          sender: {
            select: { id: true, username: true, name: true, avatar: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      // Return existing conversation or create new one
      const conversation = {
        id: `direct_${req.user!.id}_${participantId}`, // Generate a consistent ID
        type: 'direct',
        userId: participantId,
        user: participant,
        lastMessage: existingMessage,
      };

      res.json(conversation);
    } else if (type === 'group') {
      // Create new group logic would go here
      res.status(501).json({ error: 'Group creation not implemented yet' });
    } else {
      res.status(400).json({ error: 'Invalid conversation type' });
    }
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Send a message (private or group)
router.post('/send', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const validatedData = sendMessageSchema.parse(req.body);
    const { content, type, receiverId, groupId } = validatedData;

    // Validate that either receiverId or groupId is provided, but not both
    if ((!receiverId && !groupId) || (receiverId && groupId)) {
      return res.status(400).json({ 
        error: 'Either receiverId or groupId must be provided, but not both' 
      });
    }

    // If it's a group message, check if user is a member
    if (groupId) {
      const membership = await prisma.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId: req.user!.id,
            groupId: groupId,
          }
        }
      });

      if (!membership) {
        return res.status(403).json({ error: 'You are not a member of this group' });
      }
    }

    // If it's a private message, check if receiver exists
    if (receiverId) {
      const receiver = await prisma.user.findUnique({
        where: { id: receiverId }
      });

      if (!receiver) {
        return res.status(404).json({ error: 'Receiver not found' });
      }
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content,
        type,
        senderId: req.user!.id,
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
        },
        group: groupId ? {
          select: {
            id: true,
            name: true,
          }
        } : false,
      }
    });

    res.status(201).json({
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error: any) {
    console.error('Send message error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get messages for a conversation (private or group)
router.get('/messages', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { receiverId, groupId, page = '1', limit = '50' } = req.query;

    if ((!receiverId && !groupId) || (receiverId && groupId)) {
      return res.status(400).json({ 
        error: 'Either receiverId or groupId must be provided, but not both' 
      });
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    let whereCondition: any = {};

    if (groupId) {
      // Check if user is a member of the group
      const membership = await prisma.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId: req.user!.id,
            groupId: groupId as string,
          }
        }
      });

      if (!membership) {
        return res.status(403).json({ error: 'You are not a member of this group' });
      }

      whereCondition = { groupId: groupId as string };
    } else {
      // Private conversation
      whereCondition = {
        OR: [
          { senderId: req.user!.id, receiverId: receiverId as string },
          { senderId: receiverId as string, receiverId: req.user!.id },
        ]
      };
    }

    const messages = await prisma.message.findMany({
      where: whereCondition,
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    });

    const totalMessages = await prisma.message.count({
      where: whereCondition,
    });

    res.json({
      messages: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalMessages,
        totalPages: Math.ceil(totalMessages / limitNum),
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Get user's conversations
router.get('/conversations', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    // Get private conversations
    const privateMessages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, groupId: null },
          { receiverId: userId, groupId: null },
        ]
      },
      include: {
        sender: {
          select: { id: true, username: true, name: true, avatar: true, isOnline: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    // Process private conversations and fetch other users
    const conversationMap = new Map();
    
    for (const msg of privateMessages) {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      
      if (otherUserId && !conversationMap.has(otherUserId)) {
        // Fetch the other user's data
        const otherUser = await prisma.user.findUnique({
          where: { id: otherUserId },
          select: { id: true, username: true, name: true, avatar: true, isOnline: true }
        });
        
        if (otherUser) {
          conversationMap.set(otherUserId, {
            id: `direct_${userId}_${otherUserId}`,
            type: 'direct',
            userId: otherUserId,
            user: otherUser,
            lastMessage: msg,
          });
        }
      }
    }
    
    const privateConversations = Array.from(conversationMap.values());

    // Get group conversations
    const groupConversations = await prisma.groupMember.findMany({
      where: { userId },
      include: {
        group: {
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              include: {
                sender: {
                  select: { id: true, username: true, name: true, avatar: true }
                }
              }
            }
          }
        }
      }
    });

    const conversations = [
      ...privateConversations.map(conv => ({
        ...conv,
        lastMessage: conv.lastMessage,
      })),
      ...groupConversations.map(gc => ({
        id: `group_${gc.group.id}`,
        type: 'group',
        groupId: gc.group.id,
        group: gc.group,
        lastMessage: gc.group.messages[0] || null,
      }))
    ];

    // Sort by last message time
    conversations.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt || new Date(0);
      const bTime = b.lastMessage?.createdAt || new Date(0);
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

// Delete conversation (all messages between two users or leave group)
router.delete('/conversation/:conversationId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user!.id;

    // Parse conversation ID to determine type
    if (conversationId.startsWith('direct_')) {
      // Extract user IDs from conversation ID
      const parts = conversationId.split('_');
      if (parts.length !== 3) {
        return res.status(400).json({ error: 'Invalid conversation ID format' });
      }

      const [, userId1, userId2] = parts;
      const otherUserId = userId === userId1 ? userId2 : userId1;

      // Delete all messages between the two users
      const deletedMessages = await prisma.message.deleteMany({
        where: {
          OR: [
            { senderId: userId, receiverId: otherUserId, groupId: null },
            { senderId: otherUserId, receiverId: userId, groupId: null },
          ]
        }
      });

      res.json({ 
        message: 'Conversation deleted successfully',
        deletedMessagesCount: deletedMessages.count
      });

    } else if (conversationId.startsWith('group_')) {
      // Extract group ID
      const groupId = conversationId.replace('group_', '');

      // Check if user is a member of the group
      const membership = await prisma.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId,
            groupId,
          }
        }
      });

      if (!membership) {
        return res.status(403).json({ error: 'You are not a member of this group' });
      }

      // Remove user from group (leave group)
      await prisma.groupMember.delete({
        where: {
          userId_groupId: {
            userId,
            groupId,
          }
        }
      });

      res.json({ message: 'Left group successfully' });

    } else {
      return res.status(400).json({ error: 'Invalid conversation ID format' });
    }

  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

// Delete a specific message
router.delete('/message/:messageId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user!.id;

    // Find the message
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        sender: {
          select: { id: true }
        }
      }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check if the user is the sender of the message
    if (message.senderId !== userId) {
      return res.status(403).json({ error: 'You can only delete your own messages' });
    }

    // Delete the message
    await prisma.message.delete({
      where: { id: messageId }
    });

    res.json({ message: 'Message deleted successfully' });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
