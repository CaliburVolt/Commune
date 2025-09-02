'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatWindow from '@/components/chat/ChatWindow';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ArrowLeft, Menu } from 'lucide-react';

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  const { loading: chatLoading, activeConversation, setActiveConversation } = useChat();
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // On desktop, always show sidebar
      if (!mobile) {
        setShowSidebar(true);
      }
    };

    // Initial check
    if (typeof window !== 'undefined') {
      handleResize();
    }
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // On mobile, show chat window when conversation is selected
  useEffect(() => {
    if (activeConversation && isMobile) {
      setShowSidebar(false);
    }
  }, [activeConversation, isMobile]);

  // Handle conversation selection on mobile
  const handleConversationSelect = (conversation: any) => {
    setActiveConversation(conversation);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleBackToSidebar = () => {
    setShowSidebar(true);
  };

  // Swipe functionality
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isMobile) {
      if (isRightSwipe && !showSidebar) {
        // Swipe right to open sidebar
        setShowSidebar(true);
      } else if (isLeftSwipe && showSidebar) {
        // Swipe left to close sidebar
        setShowSidebar(false);
      }
    }
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <div 
      className="h-screen bg-gray-100 dark:bg-gray-900 flex overflow-hidden relative"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Mobile Navigation Buttons */}
      {isMobile && (
        <>
          {/* Back Button (when sidebar is hidden) */}
          {!showSidebar && activeConversation && (
            <button
              onClick={handleBackToSidebar}
              className="fixed top-4 left-4 z-50 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
          )}

          {/* Menu Button (when sidebar is hidden and no conversation selected) */}
          {!showSidebar && !activeConversation && (
            <button
              onClick={() => setShowSidebar(true)}
              className="fixed top-4 left-4 z-50 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </>
      )}

      {/* Mobile Overlay */}
      {isMobile && showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        isMobile 
          ? `fixed inset-y-0 left-0 z-40 w-full transform transition-transform duration-300 ease-in-out shadow-2xl ${
              showSidebar ? 'translate-x-0' : '-translate-x-full'
            }`
          : 'w-80 flex-shrink-0'
      }`}>
        <ChatSidebar onConversationSelect={handleConversationSelect} />
      </div>

      {/* Chat Window */}
      <div className={`${
        isMobile 
          ? `flex-1 ${showSidebar ? 'hidden' : 'flex'} flex-col` 
          : 'flex-1 flex flex-col min-w-0'
      }`}>
        <ChatWindow />
      </div>
    </div>
  );
}
