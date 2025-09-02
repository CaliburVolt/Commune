# OAuth Authentication Setup Guide

This guide will help you set up Google and GitHub OAuth authentication for your Commune chat application.

## Features Implemented

✅ **Google OAuth Login/Signup**
✅ **GitHub OAuth Login/Signup** 
✅ **Mandatory Username Setup** - After OAuth signup, users must choose a unique username
✅ **Real-time Username Validation** - Checks availability as users type
✅ **Seamless Integration** - Works on both login and register pages
✅ **Session Management** - Proper NextAuth.js integration

## Quick Setup

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set **Authorized redirect URIs**:
   - Development: `http://localhost:3001/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
6. Copy your **Client ID** and **Client Secret**

### 2. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in details:
   - **Application name**: Your app name
   - **Homepage URL**: `http://localhost:3001` (dev) or your domain
   - **Authorization callback URL**: `http://localhost:3001/api/auth/callback/github`
4. Copy your **Client ID** and **Client Secret**

### 3. Environment Variables

Update your `.env.local` file:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-here-generate-random-string

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Start Development Server

```bash
cd frontend
npm run dev
```

## How It Works

### OAuth Flow
1. **User clicks OAuth button** (Google/GitHub)
2. **Redirected to OAuth provider** for authentication
3. **Redirected back with OAuth data**
4. **Username setup required** for new OAuth users
5. **Account created** and user signed in

### Username Requirements
- **3-30 characters long**
- **Letters, numbers, underscores, hyphens only**
- **Must be unique**
- **Not in reserved list** (admin, support, etc.)

### Files Created/Modified

**Frontend OAuth Implementation:**
```
src/
├── lib/auth.ts                 # NextAuth configuration
├── types/next-auth.d.ts        # TypeScript type extensions
├── components/auth/
│   └── UsernameSetup.tsx      # Username selection component
├── app/
│   ├── api/auth/
│   │   ├── [...nextauth]/route.ts      # NextAuth API routes
│   │   ├── check-username/route.ts     # Username validation
│   │   └── oauth/complete/route.ts     # OAuth completion
│   ├── login/page.tsx         # Updated with OAuth buttons
│   ├── register/page.tsx      # Updated with OAuth buttons
│   └── layout.tsx             # Added SessionProvider
└── .env.local                 # OAuth credentials
```

## Testing

1. **Start the app**: `npm run dev`
2. **Visit**: `http://localhost:3001/login` or `http://localhost:3001/register`
3. **Click OAuth buttons** to test authentication
4. **Complete username setup** for new OAuth users

## Production Deployment

1. **Update OAuth redirect URIs** to your production domain
2. **Set production environment variables**
3. **Generate secure NEXTAUTH_SECRET**
4. **Test OAuth flows** in production environment

## Backend Integration

The current implementation includes mock endpoints. For production:

1. **Connect to your backend** database for user management
2. **Update username check** endpoint to query real database
3. **Implement OAuth completion** endpoint to create users
4. **Add proper session management**

## Troubleshooting

**OAuth button not working?**
- Check environment variables are set correctly
- Verify OAuth app configurations
- Check browser console for errors

**Username validation not working?**
- Check API endpoints are accessible
- Verify username validation logic
- Check network requests in dev tools

**Session not persisting?**
- Verify SessionProvider is wrapping the app
- Check NEXTAUTH_SECRET is set
- Clear browser storage and try again

## Next Steps

- Integrate with your backend API
- Add email verification for OAuth users
- Implement user profile management
- Add OAuth account linking
- Set up production OAuth apps

Your OAuth authentication system is now ready! Users can sign up/login with Google or GitHub and will be prompted to choose a username on first OAuth signup.
