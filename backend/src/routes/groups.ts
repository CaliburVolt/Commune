import express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { createGroupSchema } from '../utils/validation';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Create a new group
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const validatedData = createGroupSchema.parse(req.body);
    const { name, description, isPrivate } = validatedData;

    // Create group
    const group = await prisma.group.create({
      data: {
        name,
        description,
        isPrivate,
        createdBy: req.user!.id,
      }
    });

    // Add creator as admin
    await prisma.groupMember.create({
      data: {
        userId: req.user!.id,
        groupId: group.id,
        role: 'ADMIN',
      }
    });

    const groupWithMembers = await prisma.group.findUnique({
      where: { id: group.id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
                isOnline: true,
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Group created successfully',
      group: groupWithMembers,
    });
  } catch (error: any) {
    console.error('Create group error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// Get user's groups
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userGroups = await prisma.groupMember.findMany({
      where: { userId: req.user!.id },
      include: {
        group: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    name: true,
                    avatar: true,
                    isOnline: true,
                  }
                }
              }
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
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
            }
          }
        }
      }
    });

    const groups = userGroups.map(ug => ({
      ...ug.group,
      userRole: ug.role,
      lastMessage: ug.group.messages[0] || null,
    }));

    res.json({ groups });
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ error: 'Failed to get groups' });
  }
});

// Get group details
router.get('/:groupId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { groupId } = req.params;

    // Check if user is a member
    const membership = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: req.user!.id,
          groupId,
        }
      }
    });

    if (!membership) {
      return res.status(403).json({ error: 'You are not a member of this group' });
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
                isOnline: true,
              }
            }
          }
        }
      }
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json({
      group: {
        ...group,
        userRole: membership.role,
      }
    });
  } catch (error) {
    console.error('Get group details error:', error);
    res.status(500).json({ error: 'Failed to get group details' });
  }
});

// Add member to group
router.post('/:groupId/members', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    // Check if current user is admin or moderator
    const currentUserMembership = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: req.user!.id,
          groupId,
        }
      }
    });

    if (!currentUserMembership || (currentUserMembership.role !== 'ADMIN' && currentUserMembership.role !== 'MODERATOR')) {
      return res.status(403).json({ error: 'Only admins and moderators can add members' });
    }

    // Check if user exists
    const userToAdd = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userToAdd) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is already a member
    const existingMembership = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        }
      }
    });

    if (existingMembership) {
      return res.status(400).json({ error: 'User is already a member' });
    }

    // Add user to group
    const newMember = await prisma.groupMember.create({
      data: {
        userId,
        groupId,
        role: 'MEMBER',
      },
      include: {
        user: {
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

    res.status(201).json({
      message: 'Member added successfully',
      member: newMember,
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ error: 'Failed to add member' });
  }
});

// Remove member from group
router.delete('/:groupId/members/:userId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { groupId, userId } = req.params;

    // Check if current user is admin or moderator
    const currentUserMembership = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: req.user!.id,
          groupId,
        }
      }
    });

    if (!currentUserMembership || (currentUserMembership.role !== 'ADMIN' && currentUserMembership.role !== 'MODERATOR')) {
      return res.status(403).json({ error: 'Only admins and moderators can remove members' });
    }

    // Check if member exists
    const memberToRemove = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        }
      }
    });

    if (!memberToRemove) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Prevent removing the group creator (admin)
    if (memberToRemove.role === 'ADMIN') {
      return res.status(400).json({ error: 'Cannot remove group admin' });
    }

    // Remove member
    await prisma.groupMember.delete({
      where: {
        userId_groupId: {
          userId,
          groupId,
        }
      }
    });

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

// Leave group
router.post('/:groupId/leave', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { groupId } = req.params;

    const membership = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: req.user!.id,
          groupId,
        }
      }
    });

    if (!membership) {
      return res.status(404).json({ error: 'You are not a member of this group' });
    }

    if (membership.role === 'ADMIN') {
      return res.status(400).json({ error: 'Group admin cannot leave. Transfer admin role first.' });
    }

    await prisma.groupMember.delete({
      where: {
        userId_groupId: {
          userId: req.user!.id,
          groupId,
        }
      }
    });

    res.json({ message: 'Left group successfully' });
  } catch (error) {
    console.error('Leave group error:', error);
    res.status(500).json({ error: 'Failed to leave group' });
  }
});

export default router;
