'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { MessageCircle, Users, Shield, Zap, ArrowRight, Star, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/chat');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-teal-400 animate-ping mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to chat
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/90 backdrop-blur-md shadow-lg border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-3 rounded-2xl shadow-xl">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white animate-pulse shadow-lg"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Commune
                </h1>
                <p className="text-sm text-emerald-600 font-medium">Connect instantly</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/CaliburVolt/Commune"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center space-x-2 text-gray-600 hover:text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-emerald-50 border border-transparent hover:border-emerald-200"
                title="Star on GitHub"
              >
                <Star className="h-4 w-4" />
                <span>Star</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </a>
              <Link
                href="/login"
                className="text-gray-700 hover:text-emerald-700 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-emerald-50 border border-transparent hover:border-emerald-200"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 flex items-center space-x-2"
              >
                <span>Get started</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Chat with friends in
              <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                real-time
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Experience seamless communication with our modern chat platform. 
              Connect instantly, share moments, and stay close to the people who matter most.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                href="/register"
                className="group bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 transform hover:-translate-y-2 hover:scale-105 flex items-center space-x-3"
              >
                <span>Start Chatting Free</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
              
              <Link
                href="/login"
                className="group border-2 border-emerald-300 text-emerald-700 hover:text-emerald-800 hover:border-emerald-400 px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-3"
              >
                <span>Sign In</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 text-lg">
                Join thousands of users already experiencing the future of messaging.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need for modern communication
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with cutting-edge technology to deliver the best chat experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-emerald-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:border-emerald-200">
              <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-4 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Instant Messaging</h3>
              <p className="text-gray-600 leading-relaxed">
                Send and receive messages instantly with our lightning-fast real-time chat system powered by WebSockets.
              </p>
              <div className="mt-6 flex items-center space-x-2 text-emerald-600 font-medium">
                <CheckCircle className="h-5 w-5" />
                <span>Real-time delivery</span>
              </div>
            </div>
            
            <div className="group bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-teal-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:border-teal-200">
              <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 p-4 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Group Chats</h3>
              <p className="text-gray-600 leading-relaxed">
                Create unlimited group conversations and collaborate with multiple friends, family, or colleagues at once.
              </p>
              <div className="mt-6 flex items-center space-x-2 text-teal-600 font-medium">
                <CheckCircle className="h-5 w-5" />
                <span>Unlimited groups</span>
              </div>
            </div>
            
            <div className="group bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-cyan-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:border-cyan-200">
              <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 p-4 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure & Private</h3>
              <p className="text-gray-600 leading-relaxed">
                Your conversations are protected with enterprise-grade security and advanced encryption protocols.
              </p>
              <div className="mt-6 flex items-center space-x-2 text-cyan-600 font-medium">
                <CheckCircle className="h-5 w-5" />
                <span>End-to-end encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to revolutionize your communication?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Join thousands of users already experiencing the future of messaging.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center space-x-3 bg-white text-emerald-600 hover:text-emerald-700 px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 shadow-2xl hover:shadow-white/25 transform hover:-translate-y-2 hover:scale-105"
              >
                <span>Create Free Account</span>
                <ArrowRight className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6">
              <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-3 rounded-xl">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold">Commune</span>
            </div>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Connecting people around the world with secure, fast, and reliable messaging.
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-400">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors">Support</Link>
              <Link href="#" className="hover:text-white transition-colors">About</Link>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-gray-400 mb-4">
                © 2025 Commune. All rights reserved. Built with ❤️ for better communication.
              </p>
              <p className="text-gray-500 text-sm">
                Created by{' '}
                <a 
                  href="https://github.com/CaliburVolt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-200 hover:underline"
                >
                  CaliburVolt
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
