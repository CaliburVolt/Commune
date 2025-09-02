import express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { updateProfileSchema } from '../utils/validation';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get current user profile
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update user profile
router.put('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);
    
    // Check if username is already taken (if updating username)
    if (validatedData.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: validatedData.username,
          NOT: { id: req.user!.id }
        }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user!.id },
      data: validatedData,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true,
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Search users
router.get('/search', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: req.user!.id } }, // Exclude current user
          {
            OR: [
              { username: { contains: q, mode: 'insensitive' } },
              { name: { contains: q, mode: 'insensitive' } },
              { email: { contains: q, mode: 'insensitive' } },
            ]
          }
        ]
      },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        isOnline: true,
        lastSeen: true,
      },
      take: 20, // Limit results
    });

    res.json({ users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

// Get online users
router.get('/online', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const onlineUsers = await prisma.user.findMany({
      where: {
        isOnline: true,
        NOT: { id: req.user!.id }
      },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        isOnline: true,
        lastSeen: true,
      },
      take: 50,
    });

    res.json({ users: onlineUsers });
  } catch (error) {
    console.error('Get online users error:', error);
    res.status(500).json({ error: 'Failed to get online users' });
  }
});

export default router;
