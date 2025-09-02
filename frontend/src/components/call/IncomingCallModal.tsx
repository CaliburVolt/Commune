'use client';

import { useState, useEffect } from 'react';
import { Phone, PhoneOff, Video } from 'lucide-react';

interface IncomingCallModalProps {
  isOpen: boolean;
  callData: {
    callId: string;
    senderId: string;
    senderName: string;
    callType: 'audio' | 'video';
  } | null;
  onAccept: () => void;
  onReject: () => void;
}

export default function IncomingCallModal({
  isOpen,
  callData,
  onAccept,
  onReject,
}: IncomingCallModalProps) {
  const [ringTone, setRingTone] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen && callData) {
      // Create ringtone effect (no actual audio file needed)
      const audio = new Audio();
      // We'll use a simple beep sound or system sound
      try {
        // Try to play a system sound if available
        audio.play().catch(() => {
          // Silently fail if audio can't be played
        });
      } catch (error) {
        // Audio not available, that's fine
      }
      setRingTone(audio);

      return () => {
        if (audio) {
          audio.pause();
        }
      };
    }
  }, [isOpen, callData]);

  useEffect(() => {
    return () => {
      if (ringTone) {
        ringTone.pause();
      }
    };
  }, [ringTone]);

  if (!isOpen || !callData) return null;

  const handleAccept = () => {
    if (ringTone) {
      ringTone.pause();
    }
    onAccept();
  };

  const handleReject = () => {
    if (ringTone) {
      ringTone.pause();
    }
    onReject();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center shadow-2xl">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-semibold">
                {callData.senderName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {callData.senderName}
          </h3>
          <p className="text-gray-600">
            Incoming {callData.callType} call...
          </p>
        </div>

        <div className="flex justify-center space-x-8">
          {/* Reject Button */}
          <button
            onClick={handleReject}
            className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <PhoneOff size={24} />
          </button>

          {/* Accept Button */}
          <button
            onClick={handleAccept}
            className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {callData.callType === 'video' ? (
              <Video size={24} />
            ) : (
              <Phone size={24} />
            )}
          </button>
        </div>

        <div className="mt-6">
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animation-delay-200"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animation-delay-400"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
