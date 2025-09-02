import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters'),
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
  type: z.enum(['TEXT', 'IMAGE', 'FILE']).default('TEXT'),
  receiverId: z.string().optional(),
  groupId: z.string().optional(),
});

export const createGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(50, 'Group name must be less than 50 characters'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional(),
  isPrivate: z.boolean().default(false),
});

export const sendFriendRequestSchema = z.object({
  receiverId: z.string().min(1, 'Receiver ID is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters').optional(),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters').optional(),
});
