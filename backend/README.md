# Chat App Backend

A real-time chat application backend built with Express.js, Socket.IO, Prisma, and PostgreSQL.

## Features

- **Authentication**: JWT-based authentication with login/register
- **Real-time Messaging**: Socket.IO for instant messaging
- **Private Chat**: One-on-one conversations
- **Group Chat**: Create and manage group conversations
- **Friend System**: Send/accept friend requests
- **Online Status**: Real-time online/offline status
- **Typing Indicators**: Show when users are typing
- **Message History**: Persistent message storage
- **User Search**: Find users by username/email

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.IO
- **Authentication**: JWT
- **Validation**: Zod
- **File Upload**: Multer + Cloudinary

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (recommend Neon for cloud)
- Cloudinary account (for file uploads)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Update `.env` with your values:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A secure random string
- `FRONTEND_URL`: Your frontend URL (for CORS)
- Cloudinary credentials for file uploads

3. Set up the database:
```bash
npm run db:generate
npm run db:push
```

4. Start development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `GET /api/users/search?q=query` - Search users
- `GET /api/users/online` - Get online users

### Chat
- `POST /api/chat/send` - Send message
- `GET /api/chat/messages` - Get conversation messages
- `GET /api/chat/conversations` - Get user conversations

### Groups
- `POST /api/groups` - Create group
- `GET /api/groups` - Get user groups
- `GET /api/groups/:id` - Get group details
- `POST /api/groups/:id/members` - Add member
- `DELETE /api/groups/:id/members/:userId` - Remove member
- `POST /api/groups/:id/leave` - Leave group

### Friends
- `POST /api/friends/request` - Send friend request
- `GET /api/friends/requests/received` - Get received requests
- `GET /api/friends/requests/sent` - Get sent requests
- `POST /api/friends/request/:id/accept` - Accept request
- `POST /api/friends/request/:id/reject` - Reject request
- `GET /api/friends` - Get friends list
- `DELETE /api/friends/:id` - Remove friend

## Socket.IO Events

### Client to Server
- `send_message` - Send a message
- `join_group` - Join a group room
- `leave_group` - Leave a group room
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator

### Server to Client
- `new_message` - Receive new message
- `message_sent` - Message sent confirmation
- `user_typing` - User started typing
- `user_stopped_typing` - User stopped typing
- `friend_online` - Friend online status change
- `friend_request_received` - New friend request

## Database Schema

The database includes the following models:
- **User**: User accounts with authentication
- **Message**: Chat messages (private and group)
- **Group**: Group chat rooms
- **GroupMember**: Group membership with roles
- **Friend**: Friend relationships
- **FriendRequest**: Friend request management

## Deployment

### Environment Variables for Production
```bash
DATABASE_URL=your_neon_db_url
JWT_SECRET=your_secure_jwt_secret
PORT=5000
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Deploy to Render
1. Connect your GitHub repository
2. Set environment variables
3. Use build command: `npm run build`
4. Use start command: `npm start`

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio
