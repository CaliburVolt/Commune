import express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { sendFriendRequestSchema } from '../utils/validation';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Send friend request
router.post('/request', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const validatedData = sendFriendRequestSchema.parse(req.body);
    const { receiverId } = validatedData;

    // Check if trying to send request to self
    if (receiverId === req.user!.id) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    });

    if (!receiver) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already friends
    const existingFriendship = await prisma.friend.findFirst({
      where: {
        OR: [
          { user1Id: req.user!.id, user2Id: receiverId },
          { user1Id: receiverId, user2Id: req.user!.id },
        ]
      }
    });

    if (existingFriendship) {
      return res.status(400).json({ error: 'Already friends' });
    }

    // Check if friend request already exists
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: req.user!.id, receiverId },
          { senderId: receiverId, receiverId: req.user!.id },
        ]
      }
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'Friend request already exists' });
    }

    // Create friend request
    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId: req.user!.id,
        receiverId,
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
        receiver: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          }
        }
      }
    });

    res.status(201).json({
      message: 'Friend request sent successfully',
      friendRequest,
    });
  } catch (error: any) {
    console.error('Send friend request error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
    res.status(500).json({ error: 'Failed to send friend request' });
  }
});

// Get pending friend requests (received)
router.get('/requests/received', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const receivedRequests = await prisma.friendRequest.findMany({
      where: {
        receiverId: req.user!.id,
        status: 'PENDING',
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            isOnline: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ friendRequests: receivedRequests });
  } catch (error) {
    console.error('Get received requests error:', error);
    res.status(500).json({ error: 'Failed to get friend requests' });
  }
});

// Get sent friend requests
router.get('/requests/sent', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const sentRequests = await prisma.friendRequest.findMany({
      where: {
        senderId: req.user!.id,
        status: 'PENDING',
      },
      include: {
        receiver: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            isOnline: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ friendRequests: sentRequests });
  } catch (error) {
    console.error('Get sent requests error:', error);
    res.status(500).json({ error: 'Failed to get sent friend requests' });
  }
});

// Accept friend request
router.post('/request/:requestId/accept', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { requestId } = req.params;

    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId }
    });

    if (!friendRequest) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    if (friendRequest.receiverId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized to accept this request' });
    }

    if (friendRequest.status !== 'PENDING') {
      return res.status(400).json({ error: 'Friend request already processed' });
    }

    // Use transaction to ensure consistency
    await prisma.$transaction(async (tx) => {
      // Update friend request status
      await tx.friendRequest.update({
        where: { id: requestId },
        data: { status: 'ACCEPTED' },
      });

      // Create friendship
      await tx.friend.create({
        data: {
          user1Id: friendRequest.senderId,
          user2Id: friendRequest.receiverId,
        },
      });
    });

    const updatedRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            isOnline: true,
          }
        }
      }
    });

    res.json({
      message: 'Friend request accepted',
      friendRequest: updatedRequest,
    });
  } catch (error) {
    console.error('Accept friend request error:', error);
    res.status(500).json({ error: 'Failed to accept friend request' });
  }
});

// Reject friend request
router.post('/request/:requestId/reject', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { requestId } = req.params;

    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId }
    });

    if (!friendRequest) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    if (friendRequest.receiverId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized to reject this request' });
    }

    if (friendRequest.status !== 'PENDING') {
      return res.status(400).json({ error: 'Friend request already processed' });
    }

    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });

    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    console.error('Reject friend request error:', error);
    res.status(500).json({ error: 'Failed to reject friend request' });
  }
});

// Get friends list
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const friends = await prisma.friend.findMany({
      where: {
        OR: [
          { user1Id: req.user!.id },
          { user2Id: req.user!.id },
        ]
      },
      include: {
        user1: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            isOnline: true,
            lastSeen: true,
          }
        },
        user2: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            isOnline: true,
            lastSeen: true,
          }
        }
      }
    });

    const friendsList = friends.map(friendship => {
      const friend = friendship.user1Id === req.user!.id ? friendship.user2 : friendship.user1;
      return {
        friendshipId: friendship.id,
        friend,
        createdAt: friendship.createdAt,
      };
    });

    res.json({ friends: friendsList });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ error: 'Failed to get friends' });
  }
});

// Remove friend
router.delete('/:friendId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { friendId } = req.params;

    const friendship = await prisma.friend.findFirst({
      where: {
        OR: [
          { user1Id: req.user!.id, user2Id: friendId },
          { user1Id: friendId, user2Id: req.user!.id },
        ]
      }
    });

    if (!friendship) {
      return res.status(404).json({ error: 'Friendship not found' });
    }

    await prisma.friend.delete({
      where: { id: friendship.id }
    });

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ error: 'Failed to remove friend' });
  }
});

export default router;
