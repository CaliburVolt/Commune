<div align="center">

# 🗨️ Commune

**Modern Real-time Chat Application with WebRTC Calling**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white)](https://webrtc.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

[🚀 **Live Demo**](https://commune-4gqx.onrender.com) · [📖 **Documentation**](#-api-reference) · [🐛 **Report Bug**](https://github.com/CaliburVolt/Commune/issues) · [💡 **Request Feature**](https://github.com/CaliburVolt/Commune/issues)

![Commune Demo](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Commune+Chat+App)

</div>

---

## 🌟 Features

<table>
<tr>
<td width="50%">

### 💬 **Real-time Communication**
- ⚡ Instant messaging with Socket.IO
- 🔔 Live typing indicators
- 📍 Online/offline status
- 💨 Message delivery status

### 🔐 **Authentication & Security**
- 🔑 JWT-based authentication
- 🌐 OAuth integration (Google, GitHub)
- 🛡️ Secure password hashing
- 🎫 Session management

</td>
<td width="50%">

### 📞 **WebRTC Voice & Video Calls**
- 🎥 Peer-to-peer video calling
- 🎤 Crystal clear voice calls
- 🔇 Mute/unmute controls
- 📵 Call notifications

### 👥 **Social Features**
- 🤝 Friend system
- 🔍 User search
- 📝 Friend requests
- 👫 Friends management

</td>
</tr>
</table>

## 🚀 Quick Start

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (recommended package manager)
- [PostgreSQL](https://www.postgresql.org/) database

### ⚡ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CaliburVolt/Commune.git
   cd Commune
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pnpm install
   ```

   Create `.env` file in backend directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/commune"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=5000
   FRONTEND_URL="http://localhost:3000"
   ```

   Setup database:
   ```bash
   pnpm run db:generate
   pnpm run db:push
   pnpm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   pnpm install
   ```

   Create `.env.local` file in frontend directory:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   
   # OAuth Providers
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

   Start the frontend:
   ```bash
   pnpm run dev
   ```

4. **🎉 Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🏗️ Tech Stack

<div align="center">

### Frontend
![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![NextAuth.js](https://img.shields.io/badge/NextAuth.js-000000?style=flat-square&logo=next.js&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js_22-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat-square&logo=socket.io&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)

### Database & Deployment
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-000000?style=flat-square&logo=render&logoColor=white)

</div>

## 📁 Project Structure

```
Commune/
├── 📂 frontend/                # Next.js Frontend Application
│   ├── 📂 src/
│   │   ├── 📂 app/            # App Router Pages
│   │   │   ├── 🏠 page.tsx    # Home page
│   │   │   ├── 🔐 login/      # Authentication
│   │   │   ├── 💬 chat/       # Chat interface
│   │   │   └── ⚙️ settings/   # User settings
│   │   ├── 📂 components/     # Reusable Components
│   │   │   ├── 📞 call/       # WebRTC Components
│   │   │   ├── 💬 chat/       # Chat Components
│   │   │   └── 🎨 ui/         # UI Components
│   │   ├── 📂 lib/            # Utilities & Services
│   │   │   ├── 🔗 webrtc.ts   # WebRTC Service
│   │   │   ├── 🔌 socket.ts   # Socket.IO Client
│   │   │   └── 🌐 api.ts      # API Client
│   │   └── 📂 types/          # TypeScript Definitions
│   └── 📄 package.json
├── 📂 backend/                 # Express.js Backend API
│   ├── 📂 src/
│   │   ├── 📂 routes/         # API Routes
│   │   ├── 📂 socket/         # Socket.IO Handlers
│   │   ├── 📂 middleware/     # Express Middleware
│   │   └── 📂 utils/          # Utility Functions
│   ├── 📂 prisma/             # Database Schema
│   └── 📄 package.json
└── 📄 README.md
```

## 🌐 Deployment

### 🔧 Backend (Render)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

**Settings:**
- **Build Command:** `pnpm run build`
- **Start Command:** `pnpm start`
- **Environment Variables:**
  ```
  DATABASE_URL=your-postgresql-url
  JWT_SECRET=your-jwt-secret
  FRONTEND_URL=your-vercel-app-url
  ```

### 🎨 Frontend (Vercel)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/CaliburVolt/Commune)

**Settings:**
- **Framework Preset:** Next.js
- **Environment Variables:** All `NEXTAUTH_*` and `NEXT_PUBLIC_*` variables

## 📚 API Reference

<details>
<summary><strong>🔐 Authentication Endpoints</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/change-password` | Change password |
| `DELETE` | `/api/auth/delete-account` | Delete account |

</details>

<details>
<summary><strong>👥 User Management</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users/search` | Search users |
| `GET` | `/api/users/me` | Get current user |
| `PUT` | `/api/users/me` | Update profile |

</details>

<details>
<summary><strong>🤝 Friend System</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/friends/request` | Send friend request |
| `GET` | `/api/friends` | Get friends list |
| `POST` | `/api/friends/request/:id/accept` | Accept request |
| `POST` | `/api/friends/request/:id/reject` | Reject request |

</details>

<details>
<summary><strong>💬 Chat System</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat/create` | Create/get chat |
| **Socket Events** | | |
| `join_chat` | Join chat room |
| `send_message` | Send message |
| `receive_message` | Receive message |

</details>

<details>
<summary><strong>📞 WebRTC Calling</strong></summary>

| Socket Event | Description |
|--------------|-------------|
| `call_request` | Initiate call |
| `accept_call` | Accept incoming call |
| `reject_call` | Reject call |
| `end_call` | End active call |
| `webrtc_signal` | Exchange signaling data |

</details>

## 🔧 WebRTC Implementation

```mermaid
sequenceDiagram
    participant A as User A
    participant S as Socket Server
    participant B as User B
    
    A->>S: call_request
    S->>B: 📞 Incoming call notification
    B->>S: accept_call
    S->>A: ✅ Call accepted
    
    Note over A,B: 🔗 WebRTC Peer Connection Setup
    A<-->S: 📡 ICE candidates exchange
    S<-->B: 📡 ICE candidates exchange
    
    Note over A,B: 🎥 Direct P2P Audio/Video Stream
```

## 🤝 Contributing

We love contributions! Here's how you can help:

<details>
<summary><strong>🚀 Getting Started</strong></summary>

1. **🍴 Fork the Project**
2. **🌿 Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **✅ Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **📤 Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **🔀 Open a Pull Request**

</details>

<details>
<summary><strong>📋 Development Guidelines</strong></summary>

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

</details>

## 📊 Project Status

![GitHub last commit](https://img.shields.io/github/last-commit/CaliburVolt/Commune?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/CaliburVolt/Commune?style=flat-square)
![GitHub pull requests](https://img.shields.io/github/issues-pr/CaliburVolt/Commune?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/CaliburVolt/Commune?style=flat-square)

## 🔮 Roadmap

- [ ] 📁 **File Sharing** - Send documents and images
- [ ] 🔐 **End-to-End Encryption** - Secure messaging
- [ ] 👥 **Group Video Calls** - Multi-user conferences
- [ ] 🔔 **Push Notifications** - Real-time alerts
- [ ] 📱 **Mobile App** - React Native version
- [ ] 🌙 **Dark Mode** - Theme customization
- [ ] 🌍 **Internationalization** - Multi-language support

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [WebRTC](https://webrtc.org/) for peer-to-peer communication
- [Socket.IO](https://socket.io/) for real-time features
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Prisma](https://www.prisma.io/) for database management
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

<div align="center">

### 💝 Support the Project

If you find this project helpful, please consider giving it a ⭐!

**Made with ❤️ by [CaliburVolt](https://github.com/CaliburVolt)**

[![GitHub followers](https://img.shields.io/github/followers/CaliburVolt?style=social)](https://github.com/CaliburVolt)

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