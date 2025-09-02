# Commune 💬

A modern, real-time chat application built with Next.js, Express, and Socket.IO, featuring secure authentication, instant messaging, and group conversations.

![Commune](https://img.shields.io/badge/Status-Active-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **🚀 Real-time Messaging** - Instant chat powered by Socket.IO
- **👥 Group Chats** - Create and manage unlimited group conversations
- **🔐 Secure Authentication** - JWT-based auth with NextAuth.js integration
- **👫 Friend System** - Send/accept friend requests and manage connections
- **🌐 OAuth Support** - Sign in with popular providers
- **📱 Responsive Design** - Beautiful UI that works on all devices
- **🎨 Modern UI** - Built with Tailwind CSS and Headless UI
- **⚡ Real-time Updates** - Live user status and message delivery
- **🛡️ Type Safety** - Full TypeScript implementation
- **📊 Database Management** - Prisma ORM with PostgreSQL

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **NextAuth.js** - Authentication solution
- **Socket.IO Client** - Real-time communication
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

### Backend
- **Express.js** - Node.js web framework
- **Socket.IO** - Real-time bidirectional communication
- **Prisma** - Database ORM and migration tool
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Zod** - Schema validation
- **TypeScript** - Type-safe backend development

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CaliburVolt/Commune.git
   cd Commune
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (frontend + backend)
   pnpm install
   ```

3. **Environment Setup**

   **Backend (.env in `/backend` folder):**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/commune"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=5000
   ```

   **Frontend (.env.local in `/frontend` folder):**
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXT_PUBLIC_API_URL=http://localhost:5000
   
   # OAuth providers (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

4. **Database Setup**
   ```bash
   cd backend
   pnpm db:migrate
   pnpm db:generate
   ```

5. **Start Development Servers**
   
   **Terminal 1 - Backend:**
   ```bash
   cd backend
   pnpm dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   pnpm dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
commune/
├── 📂 frontend/                    # Next.js Frontend Application
│   ├── 📂 src/
│   │   ├── 📂 app/                # Next.js App Router
│   │   │   ├── page.tsx           # Homepage with landing page
│   │   │   ├── layout.tsx         # Root layout component
│   │   │   ├── globals.css        # Global styles
│   │   │   ├── 📂 api/            # API routes
│   │   │   │   └── 📂 auth/       # NextAuth.js configuration
│   │   │   ├── 📂 chat/           # Chat application pages
│   │   │   ├── 📂 login/          # Login page
│   │   │   ├── 📂 register/       # Registration page
│   │   │   ├── 📂 profile/        # User profile page
│   │   │   └── 📂 settings/       # User settings page
│   │   ├── 📂 components/         # Reusable React Components
│   │   │   ├── 📂 auth/           # Authentication components
│   │   │   │   └── UsernameSetup.tsx
│   │   │   ├── 📂 call/           # Video/voice call components
│   │   │   │   ├── ActiveCallInterface.tsx
│   │   │   │   └── IncomingCallModal.tsx
│   │   │   ├── 📂 chat/           # Chat-related components
│   │   │   │   ├── ChatLayout.tsx # Main chat layout
│   │   │   │   ├── ChatSidebar.tsx # Chat sidebar with conversations
│   │   │   │   ├── ChatWindow.tsx # Main chat window
│   │   │   │   ├── FriendRequests.tsx # Friend request management
│   │   │   │   └── UserSearch.tsx # User search functionality
│   │   │   └── 📂 ui/             # UI components
│   │   │       └── LoadingSpinner.tsx
│   │   ├── 📂 contexts/           # React Context Providers
│   │   │   ├── AuthContext.tsx    # Authentication state management
│   │   │   ├── ChatContext.tsx    # Chat state management
│   │   │   └── ThemeContext.tsx   # Theme management
│   │   ├── 📂 hooks/              # Custom React Hooks
│   │   │   └── useWebRTC.ts       # WebRTC functionality for calls
│   │   ├── 📂 lib/                # Utility Libraries
│   │   │   ├── api.ts             # API client configuration
│   │   │   ├── auth.ts            # Authentication utilities
│   │   │   ├── socket.ts          # Socket.IO client setup
│   │   │   └── webrtc.ts          # WebRTC utilities
│   │   └── 📂 types/              # TypeScript Type Definitions
│   │       ├── index.ts           # Main type definitions
│   │       └── next-auth.d.ts     # NextAuth.js type extensions
│   ├── 📂 public/                 # Static Assets
│   │   ├── next.svg               # Next.js logo
│   │   ├── vercel.svg             # Vercel logo
│   │   └── *.svg                  # Other icons
│   ├── package.json               # Frontend dependencies
│   ├── next.config.ts             # Next.js configuration
│   ├── tailwind.config.ts         # Tailwind CSS configuration
│   ├── tsconfig.json              # TypeScript configuration
│   └── README.md                  # Frontend-specific documentation
├── 📂 backend/                     # Express.js Backend Application
│   ├── 📂 src/
│   │   ├── index.ts               # Main server entry point
│   │   ├── 📂 routes/             # API Route Handlers
│   │   │   ├── auth.ts            # Authentication routes
│   │   │   ├── authRoutes.ts      # Additional auth routes
│   │   │   ├── chat.ts            # Chat message routes
│   │   │   ├── friends.ts         # Friend management routes
│   │   │   ├── groups.ts          # Group chat routes
│   │   │   └── users.ts           # User management routes
│   │   ├── 📂 middleware/         # Express Middleware
│   │   │   └── auth.ts            # Authentication middleware
│   │   ├── 📂 socket/             # Socket.IO Handlers
│   │   │   └── socketHandler.ts   # Real-time event handlers
│   │   └── 📂 utils/              # Utility Functions
│   │       ├── auth.ts            # Authentication utilities
│   │       └── validation.ts      # Input validation schemas
│   ├── 📂 prisma/                 # Database Management
│   │   ├── schema.prisma          # Database schema definition
│   │   └── 📂 migrations/         # Database migration files
│   │       ├── migration_lock.toml
│   │       └── 📂 20250831181326_init/
│   │           └── migration.sql
│   ├── package.json               # Backend dependencies
│   ├── tsconfig.json              # TypeScript configuration
│   ├── pnpm-workspace.yaml        # pnpm workspace configuration
│   └── README.md                  # Backend-specific documentation
├── README.md                      # Main project documentation (this file)
└── 📂 .git/                       # Git version control
```

### 📂 Frontend (`/frontend`)
The frontend is a **Next.js 15** application using the App Router with:
- **Modern React 19** with TypeScript
- **Tailwind CSS** for styling with custom design system
- **NextAuth.js** for authentication with OAuth support
- **Socket.IO client** for real-time communication
- **WebRTC** integration for voice/video calls
- **Responsive design** that works on all devices

### 📂 Backend (`/backend`) 
The backend is an **Express.js** server with:
- **RESTful API** with TypeScript
- **Socket.IO** for real-time bidirectional communication
- **Prisma ORM** with PostgreSQL database
- **JWT authentication** with secure token management
- **Input validation** using Zod schemas
- **File upload** support via Cloudinary

## 🔧 Available Scripts

### Frontend
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Backend
```bash
pnpm dev          # Start development server with hot reload
pnpm build        # Build TypeScript to JavaScript
pnpm start        # Start production server
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema changes to database
pnpm db:migrate   # Run database migrations
pnpm db:studio    # Open Prisma Studio
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/search` - Search users
- `PUT /api/users/profile` - Update user profile

### Friends
- `POST /api/friends/request` - Send friend request
- `PUT /api/friends/accept` - Accept friend request
- `GET /api/friends` - Get user's friends
- `DELETE /api/friends/:id` - Remove friend

### Groups
- `POST /api/groups` - Create new group
- `GET /api/groups` - Get user's groups
- `POST /api/groups/:id/join` - Join group
- `DELETE /api/groups/:id/leave` - Leave group

### Chat
- `GET /api/chat/messages/:id` - Get chat messages
- WebSocket events for real-time messaging

## 🔌 Socket.IO Events

### Client → Server
- `join_room` - Join a chat room
- `send_message` - Send a message
- `typing_start` - User started typing
- `typing_stop` - User stopped typing

### Server → Client
- `message` - New message received
- `user_joined` - User joined room
- `user_left` - User left room
- `typing` - Someone is typing
- `user_online` - User came online
- `user_offline` - User went offline

## 🔒 Authentication Flow

1. **Registration/Login** - User creates account or signs in
2. **JWT Token** - Server issues JWT token on successful auth
3. **Client Storage** - Token stored securely in HTTP-only cookies
4. **API Protection** - Protected routes verify JWT token
5. **Socket Auth** - Socket connections authenticated via token

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User** - User accounts and profiles
- **Message** - Chat messages (private and group)
- **Group** - Group chat rooms
- **GroupMember** - Group membership with roles
- **Friend** - Friend relationships
- **FriendRequest** - Pending friend requests

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Heroku)
1. Create new project on Railway or Heroku
2. Connect GitHub repository
3. Set environment variables
4. Deploy with automatic builds

### Database (Railway/Supabase)
1. Create PostgreSQL database instance
2. Update `DATABASE_URL` in environment variables
3. Run migrations: `pnpm db:migrate`

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
pnpm test

# Run backend tests
cd backend
pnpm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Socket.IO](https://socket.io/) - Real-time bidirectional event-based communication
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**Built with ❤️ for better communication**