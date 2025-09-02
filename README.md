# Commune - Full Stack Chat Application

A modern, real-time chat application with authentication, private messaging, and group chats. Built with Next.js frontend and Express.js backend.

## 🚀 Features

### Authentication
- User registration and login
- JWT-based authentication
- Secure password hashing
- Session management

### Real-time Messaging
- Socket.IO for instant messaging
- Private one-on-one conversations
- Group chat functionality
- Typing indicators
- Online/offline status

### Friend System
- Send and receive friend requests
- Accept/reject friend requests
- Friends list management
- Search users

### Group Management
- Create public/private groups
- Add/remove members
- Group admin controls
- Role-based permissions (Admin, Moderator, Member)

### Modern UI/UX
- Responsive design with Tailwind CSS
- Clean and intuitive interface
- Real-time updates
- Loading states and error handling

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Context** - State management

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Socket.IO** - Real-time communication
- **Prisma** - Database ORM
- **PostgreSQL** - Database (Neon recommended)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Zod** - Validation

## 📁 Project Structure

```
chat-app/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   │   ├── login/       # Login page
│   │   │   ├── register/    # Registration page
│   │   │   ├── chat/        # Main chat interface
│   │   │   └── layout.tsx   # Root layout
│   │   ├── contexts/        # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   └── ChatContext.tsx
│   │   ├── lib/             # Utilities
│   │   │   ├── api.ts       # API client
│   │   │   └── socket.ts    # Socket.IO client
│   │   └── types/           # TypeScript types
│   ├── package.json
│   └── README.md
└── backend/                  # Express.js backend
    ├── src/
    │   ├── routes/          # API routes
    │   │   ├── auth.ts      # Authentication
    │   │   ├── users.ts     # User management
    │   │   ├── chat.ts      # Messaging
    │   │   ├── groups.ts    # Group management
    │   │   └── friends.ts   # Friend system
    │   ├── middleware/      # Express middleware
    │   │   └── auth.ts      # JWT authentication
    │   ├── socket/          # Socket.IO handlers
    │   │   └── socketHandler.ts
    │   ├── utils/           # Utilities
    │   │   ├── auth.ts      # Auth helpers
    │   │   └── validation.ts # Zod schemas
    │   └── index.ts         # Server entry point
    ├── prisma/
    │   └── schema.prisma    # Database schema
    ├── package.json
    └── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended for cloud)
- pnpm (recommended) or npm

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Environment setup:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your database and secrets:
   ```env
   DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=5000
   FRONTEND_URL="http://localhost:3000"
   ```

4. **Database setup:**
   ```bash
   pnpm db:generate
   pnpm db:push
   ```

5. **Start development server:**
   ```bash
   pnpm dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Environment setup:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local`:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

4. **Start development server:**
   ```bash
   pnpm dev
   ```

5. **Open your browser:**
   ```
   http://localhost:3000
   ```

## 🌐 Deployment

### Backend (Render)

1. **Connect your GitHub repository to Render**
2. **Set environment variables:**
   - `DATABASE_URL` - Your Neon database URL
   - `JWT_SECRET` - Secure random string
   - `FRONTEND_URL` - Your Vercel app URL
   - `PORT` - 5000

3. **Build command:** `pnpm build`
4. **Start command:** `pnpm start`

### Frontend (Vercel)

1. **Connect your GitHub repository to Vercel**
2. **Set environment variables:**
   - `NEXTAUTH_URL` - Your Vercel app URL
   - `NEXTAUTH_SECRET` - Secure random string
   - `NEXT_PUBLIC_API_URL` - Your Render backend URL
   - `NEXT_PUBLIC_SOCKET_URL` - Your Render backend URL

3. **Deploy automatically on push to main branch**

### Database (Neon)

1. **Create a Neon account and database**
2. **Copy the connection string**
3. **Update environment variables in both frontend and backend**

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User Endpoints
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile
- `GET /api/users/search` - Search users

### Chat Endpoints
- `POST /api/chat/send` - Send message
- `GET /api/chat/messages` - Get messages
- `GET /api/chat/conversations` - Get conversations

### Group Endpoints
- `POST /api/groups` - Create group
- `GET /api/groups` - Get user groups
- `POST /api/groups/:id/members` - Add member

### Friend Endpoints
- `POST /api/friends/request` - Send friend request
- `GET /api/friends/requests/received` - Get received requests
- `POST /api/friends/request/:id/accept` - Accept request

## 🔧 Development Scripts

### Backend
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema changes
- `pnpm db:studio` - Open Prisma Studio

### Frontend
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- File upload functionality is prepared but not fully implemented
- Voice/video calling features are not included
- Message encryption is not implemented (planned for future release)

## 🔮 Future Features

- [ ] File and image sharing
- [ ] Voice and video calls
- [ ] Message encryption
- [ ] Push notifications
- [ ] Message reactions and replies
- [ ] User presence indicators
- [ ] Dark mode
- [ ] Mobile app (React Native)

## 📞 Support

If you have any questions or need help with setup, please create an issue on GitHub.

---

**Happy Chatting! 💬**
#   C o m m u n e  
 #   C o m m u n e  
 