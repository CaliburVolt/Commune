import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        // For OAuth users, we'll handle username setup in the session callback
        return true;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user && account) {
        // Store OAuth info in JWT for first-time OAuth users
        if (account.provider === 'google' || account.provider === 'github') {
          // Check if user needs username setup
          token.needsUsername = true;
          token.tempOAuthData = {
            provider: account.provider,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Pass username requirement to client
      if (session.user && token.needsUsername) {
        session.user.needsUsername = true;
        session.user.tempOAuthData = token.tempOAuthData;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
