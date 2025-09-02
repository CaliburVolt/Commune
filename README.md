# Commune - Real-time Chat & WebRTC Calling App

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)

A modern full-stack chat application with **real-time messaging** and **WebRTC voice/video calling**.

[🚀 Live Demo](https://commune-4gqx.onrender.com) • [📖 Documentation](#api-reference) • [🔧 Setup](#quick-start)

</div>

## ✨ Features

- 💬 **Real-time Chat** - Instant messaging with Socket.IO
- 📞 **Voice/Video Calls** - WebRTC peer-to-peer calling
- 🔐 **Authentication** - JWT + OAuth (Google, GitHub)
- 👥 **Friend System** - Send/accept friend requests
- 🔍 **User Search** - Find and connect with users
- 📱 **Responsive UI** - Modern design with Tailwind CSS
- ⚡ **Real-time Updates** - Live typing indicators & status

## 🏗️ Tech Stack

**Frontend:** Next.js 15, TypeScript, Tailwind CSS, NextAuth.js  
**Backend:** Node.js, Express.js, Socket.IO, Prisma ORM  
**Database:** PostgreSQL (Neon)  
**Real-time:** WebRTC, Socket.IO  
**Deployment:** Vercel (Frontend) + Render (Backend)

## 📁 Project Structure

```
commune/
├── frontend/          # Next.js App
│   ├── src/app/       # Pages (login, chat, settings)
│   ├── src/components/# UI Components
│   │   ├── call/      # WebRTC Components
│   │   └── chat/      # Chat Components
│   └── src/lib/       # Utils (webrtc, socket, api)
└── backend/           # Express.js API
    ├── src/routes/    # API Routes
    ├── src/socket/    # Socket.IO Handlers
    └── prisma/        # Database Schema
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (recommend [Neon](https://neon.tech))
- pnpm (recommended)

### 1. Backend Setup

```bash
cd backend
pnpm install

# Create .env file
DATABASE_URL="postgresql://user:pass@host:port/db"
JWT_SECRET="your-jwt-secret"
PORT=5000
FRONTEND_URL="http://localhost:3000"

# Setup database
pnpm run db:generate
pnpm run db:push

# Start server
pnpm run dev
```

### 2. Frontend Setup

```bash
cd frontend
pnpm install

# Create .env.local file
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# OAuth credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Start app
pnpm run dev
```

Open `http://localhost:3000` and start chatting!

## 🌐 Deployment

### Backend (Render)
- **Build Command:** `pnpm run build`
- **Start Command:** `pnpm start`
- **Environment Variables:** DATABASE_URL, JWT_SECRET, FRONTEND_URL

### Frontend (Vercel)
- **Framework:** Next.js (auto-detected)
- **Environment Variables:** All NEXTAUTH_* and NEXT_PUBLIC_* vars

**Production URLs:**
- Frontend: Auto-deployed via Vercel
- Backend: https://commune-4gqx.onrender.com

## 📡 API Reference

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/change-password` - Change password

### Users & Friends
- `GET /api/users/search` - Search users
- `POST /api/friends/request` - Send friend request
- `GET /api/friends` - Get friends list

### Chat
- `POST /api/chat/create` - Create chat
- Socket events: `send_message`, `receive_message`, `join_chat`

### WebRTC Calling
- Socket events: `call_request`, `accept_call`, `reject_call`, `webrtc_signal`

## 🔧 WebRTC Implementation

```mermaid
sequenceDiagram
    participant A as User A
    participant S as Socket Server
    participant B as User B
    
    A->>S: call_request
    S->>B: incoming call
    B->>S: accept_call
    Note over A,B: WebRTC P2P Connection
    A<->>B: Direct audio/video stream
```

**Key Components:**
- `webrtc.ts` - WebRTC service
- `IncomingCallModal.tsx` - Call notifications
- `ActiveCallInterface.tsx` - Call controls

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

ISC License - see [LICENSE](LICENSE) file

## 🔮 Roadmap

- [ ] File sharing
- [ ] Message encryption
- [ ] Group video calls
- [ ] Push notifications
- [ ] Mobile app

---

<div align="center">

**Built with ❤️ by [CaliburVolt](https://github.com/CaliburVolt)**

⭐ Star this repo if you found it helpful!

</div>Stack Chat Application with WebRTC Calling

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColo## 🔌 Socket.IO Events=white)
![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

A modern, real-time chat application with authentication, private messaging, and **WebRTC voice/video calling**. Built with Next.js frontend and Express.js backend.

[🚀 Live Demo](https://commune-4gqx.onrender.com) • [📖 Documentation](#-api-documentation) • [🔧 Setup Guide](#-getting-started)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication & Security
- User registration and login
- **OAuth integration** (Google, GitHub)
- JWT-based authentication
- Secure password hashing
- Session management

### 💬 Real-time Messaging
- **Socket.IO** for instant messaging
- Private one-on-one conversations
- Group chat functionality
- Typing indicators
- Online/offline status

</td>
<td width="50%">

### 📞 WebRTC Voice/Video Calling
- **Peer-to-peer** voice and video calls
- Real-time call signaling via Socket.IO
- Call controls (mute, video toggle, speaker)
- Incoming call notifications
- Call duration tracking

### 👥 Social Features
- Send and receive friend requests
- Accept/reject friend requests
- Friends list management
- User search functionality

</td>
</tr>
</table>

### 🎨 Modern UI/UX
- **Responsive design** with Tailwind CSS
- Clean and intuitive interface
- Real-time updates
- Loading states and error handling
- Professional call interface

## 🛠️ Tech Stack

<div align="center">

### Frontend
![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NextAuth.js](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=next.js&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js_22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

### Real-time & Communication
![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

</div>

<details>
<summary><strong>📋 Complete Technology List</strong></summary>

**Frontend Technologies:**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **NextAuth.js** - Authentication management
- **Socket.IO Client** - Real-time communication
- **WebRTC API** - Peer-to-peer calling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Context** - State management

**Backend Technologies:**
- **Node.js 22** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Socket.IO** - Real-time bidirectional communication
- **Prisma** - Database ORM
- **PostgreSQL** - Database (Neon)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Zod** - Schema validation

</details>

## 📁 Project Architecture

```
commune/
├── 📁 frontend/                 # Next.js Frontend Application
│   ├── 📁 src/
│   │   ├── 📁 app/             # Next.js App Router
│   │   │   ├── 📄 layout.tsx   # Root layout
│   │   │   ├── 📄 page.tsx     # Home page
│   │   │   ├── 📁 login/       # Authentication pages
│   │   │   ├── 📁 register/    
│   │   │   ├── 📁 chat/        # Main chat interface
│   │   │   └── 📁 settings/    # User settings
│   │   ├── 📁 components/      # Reusable UI Components
│   │   │   ├── 📁 call/        # 📞 WebRTC Components
│   │   │   │   ├── 📄 IncomingCallModal.tsx
│   │   │   │   └── 📄 ActiveCallInterface.tsx
│   │   │   ├── 📁 chat/        # 💬 Chat Components
│   │   │   └── 📁 ui/          # 🎨 Basic UI Components
│   │   ├── 📁 lib/             # 🔧 Utility Libraries
│   │   │   ├── 📄 webrtc.ts    # WebRTC service
│   │   │   ├── 📄 socket.ts    # Socket.IO client
│   │   │   └── 📄 api.ts       # API client
│   │   └── 📁 types/           # TypeScript definitions
│   ├── 📁 public/              # Static assets
│   └── 📄 package.json
├── 📁 backend/                  # Express.js Backend API
│   ├── 📁 src/
│   │   ├── 📁 routes/          # 🛣️ API Routes
│   │   │   ├── 📄 auth.ts      # Authentication
│   │   │   ├── 📄 users.ts     # User management
│   │   │   ├── 📄 chat.ts      # Messaging
│   │   │   └── 📄 friends.ts   # Friend system
│   │   ├── 📁 socket/          # 🔌 Socket.IO Handlers
│   │   │   └── 📄 socketHandler.ts
│   │   ├── 📁 middleware/      # Express middleware
│   │   ├── 📁 utils/           # Utility functions
│   │   └── 📄 index.ts         # Server entry point
│   ├── 📁 prisma/
│   │   ├── 📄 schema.prisma    # Database schema
│   │   └── 📁 migrations/      # Database migrations
│   └── 📄 package.json
└── 📄 README.md
```

## 🚀 Quick Start Guide

### 📋 Prerequisites
- **Node.js 18+** and **pnpm** (recommended)
- **PostgreSQL** database (we recommend [Neon](https://neon.tech))
- **Google/GitHub OAuth** credentials

---

### 🔧 Backend Setup

<details>
<summary><strong>Click to expand backend setup</strong></summary>

1. **📂 Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **📦 Install dependencies**
   ```bash
   pnpm install
   ```

3. **⚙️ Environment Configuration**
   Create `.env` file:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/commune"
   
   # Authentication
   JWT_SECRET="your-super-secret-jwt-key-here"
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **🗄️ Database Setup**
   ```bash
   pnpm run db:generate    # Generate Prisma client
   pnpm run db:push        # Push schema to database
   ```

5. **🚀 Start Development Server**
   ```bash
   pnpm run dev
   ```
   > Server runs on `http://localhost:5000`

</details>

---

### 🎨 Frontend Setup

<details>
<summary><strong>Click to expand frontend setup</strong></summary>

1. **📂 Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **📦 Install dependencies**
   ```bash
   pnpm install
   ```

3. **⚙️ Environment Configuration**
   Create `.env.local` file:
   ```env
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-change-in-production
   
   # Backend URLs
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   
   # OAuth Providers
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

4. **🚀 Start Development Server**
   ```bash
   pnpm run dev
   ```
   > Frontend runs on `http://localhost:3000`

</details>

---

### 🌟 You're Ready!
Open `http://localhost:3000` in your browser and start chatting!

## 🌐 Deployment Guide

<div align="center">

### Production URLs
🌐 **Frontend**: Deployed on [Vercel](https://vercel.com)  
🔧 **Backend**: [`https://commune-4gqx.onrender.com`](https://commune-4gqx.onrender.com)

</div>

---

### 🔧 Backend Deployment (Render)

<details>
<summary><strong>Step-by-step Render deployment</strong></summary>

1. **🔗 Connect Repository**
   - Connect your GitHub repository to Render
   - Select the backend directory as root

2. **⚙️ Environment Variables**
   ```env
   DATABASE_URL=your-neon-database-url
   JWT_SECRET=secure-random-string
   FRONTEND_URL=your-vercel-app-url
   PORT=5000
   ```

3. **🏗️ Build Settings**
   - **Build Command**: `pnpm run build`
   - **Start Command**: `pnpm start`

</details>

---

### 🎨 Frontend Deployment (Vercel)

<details>
<summary><strong>Step-by-step Vercel deployment</strong></summary>

1. **🔗 Connect Repository**
   - Connect your GitHub repository to Vercel
   - Select the frontend directory as root

2. **⚙️ Environment Variables**
   ```env
   NEXTAUTH_URL=your-vercel-app-url
   NEXTAUTH_SECRET=secure-random-string
   NEXT_PUBLIC_API_URL=https://commune-4gqx.onrender.com
   NEXT_PUBLIC_SOCKET_URL=https://commune-4gqx.onrender.com
   # Add your OAuth credentials
   ```

3. **🚀 Auto-Deploy**
   - Automatically deploys on push to main branch

</details>

---

### 🗄️ Database Setup (Neon)

<details>
<summary><strong>PostgreSQL setup with Neon</strong></summary>

1. **🆕 Create Account**: Sign up at [Neon.tech](https://neon.tech)
2. **🗄️ Create Database**: Create a new PostgreSQL database
3. **🔗 Get Connection String**: Copy the connection URL
4. **⚙️ Update Environment**: Add to both backend `.env` and deployment configs

</details>

## 📚 API Documentation

<div align="center">

### 🔗 Base URL
**Development**: `http://localhost:5000`  
**Production**: `https://commune-4gqx.onrender.com`

</div>

---

<details>
<summary><strong>🔐 Authentication Endpoints</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/change-password` | Change password |
| `DELETE` | `/api/auth/delete-account` | Delete account |
| `GET` | `/api/auth/[provider]` | OAuth routes (Google, GitHub) |

</details>

<details>
<summary><strong>👥 User Management</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users/me` | Get current user profile |
| `PUT` | `/api/users/me` | Update user profile |
| `GET` | `/api/users/search` | Search users by username |

</details>

<details>
<summary><strong>💬 Chat System</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat/create` | Create/get chat with user |
| `GET` | `/api/chat/messages` | Get chat messages |
| `GET` | `/api/chat/conversations` | Get user conversations |

</details>

<details>
<summary><strong>🤝 Friend System</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/friends/request` | Send friend request |
| `GET` | `/api/friends/requests/received` | Get received requests |
| `GET` | `/api/friends/requests/sent` | Get sent requests |
| `GET` | `/api/friends` | Get friends list |
| `POST` | `/api/friends/request/:id/accept` | Accept friend request |
| `POST` | `/api/friends/request/:id/reject` | Reject friend request |

</details>

## � Socket.IO Events

### Connection & Chat
- `join_chat` - Join a chat room
- `send_message` - Send a message
- `receive_message` - Receive a message
- `user_connected` - User comes online
- `user_disconnected` - User goes offline

### WebRTC Calling
- `call_request` - Initiate a call
- `accept_call` - Accept incoming call
- `reject_call` - Reject incoming call
- `end_call` - End active call
- `webrtc_signal` - Exchange WebRTC signaling data (ICE candidates, offers, answers)

## 📱 WebRTC Implementation

The application uses WebRTC for peer-to-peer voice and video calls:

### Call Flow
1. **Initiate Call**: User clicks call button → sends `call_request` via Socket.IO
2. **Signaling**: Socket.IO server relays call request to recipient
3. **Accept/Reject**: Recipient can accept or reject the call
4. **WebRTC Setup**: If accepted, WebRTC peer connection is established
5. **Media Stream**: Audio/video streams are shared directly between peers
6. **ICE Candidates**: Network information exchanged via Socket.IO signaling

### Key Components
- `webrtc.ts` - WebRTC service with connection management
- `IncomingCallModal.tsx` - Handle incoming call notifications
- `ActiveCallInterface.tsx` - Call controls and UI during active calls
- Socket.IO events for signaling coordination

## �🔧 Development Scripts

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
- Message encryption is not implemented (planned for future release)
- Group chat features are defined in schema but UI not fully implemented

## 🔮 Future Features

- [ ] File and image sharing
- [ ] Message encryption
- [ ] Push notifications
- [ ] Message reactions and replies
- [ ] User presence indicators
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Screen sharing in calls
- [ ] Group video calls

## 📞 Support

If you have any questions or need help with setup, please create an issue on GitHub.

---

**Happy Chatting! 💬**
#   C o m m u n e 
 
 #   C o m m u n e 
 
 #   C o m m u n e 
 
 