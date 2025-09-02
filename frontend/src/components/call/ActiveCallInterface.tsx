'use client';

import { useState, useRef, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, VolumeX } from 'lucide-react';

interface ActiveCallInterfaceProps {
  isOpen: boolean;
  callData: {
    id: string;
    partnerId: string;
    partnerName: string;
    isIncoming: boolean;
    isConnected: boolean;
    startTime?: Date;
  } | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  isMuted: boolean;
  isVideoEnabled: boolean;
}

export default function ActiveCallInterface({
  isOpen,
  callData,
  localStream,
  remoteStream,
  onEndCall,
  onToggleMute,
  onToggleVideo,
  isMuted,
  isVideoEnabled,
}: ActiveCallInterfaceProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState('00:00');

  // Set up video streams
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Call duration timer
  useEffect(() => {
    if (!callData?.isConnected || !callData.startTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const duration = Math.floor((now.getTime() - callData.startTime!.getTime()) / 1000);
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      setCallDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [callData?.isConnected, callData?.startTime]);

  if (!isOpen || !callData) return null;

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    // In a real app, you would control audio output device here
  };

  const isVideoCall = (localStream?.getVideoTracks().length || 0) > 0 || (remoteStream?.getVideoTracks().length || 0) > 0;

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white p-3 md:p-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-semibold">{callData.partnerName}</h2>
          <p className="text-sm text-gray-300">
            {callData.isConnected ? callDuration : 'Connecting...'}
          </p>
          {/* Debug info */}
          <p className="text-xs text-gray-400">
            Call ID: {callData.id} | Connected: {callData.isConnected ? 'Yes' : 'No'}
          </p>
        </div>
        {!callData.isConnected && (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            <span className="text-sm">Connecting</span>
          </div>
        )}
      </div>

      {/* Video Area */}
      <div className="flex-1 relative bg-black">
        {isVideoCall ? (
          <>
            {/* Remote Video */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute top-2 md:top-4 right-2 md:right-4 w-24 md:w-32 h-18 md:h-24 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>

            {/* No remote video fallback */}
            {!remoteStream && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-semibold">
                      {callData.partnerName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-lg">{callData.partnerName}</p>
                  <p className="text-sm text-gray-300">Waiting for video...</p>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Audio Only Call */
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-3xl font-semibold">
                  {callData.partnerName.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-xl">{callData.partnerName}</p>
              <p className="text-gray-300">Audio call</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 md:p-6">
        <div className="flex justify-center space-x-4 md:space-x-6">
          {/* Mute Button */}
          <button
            onClick={onToggleMute}
            className={`w-12 md:w-14 h-12 md:h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
              isMuted 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isMuted ? (
              <MicOff className="text-white" size={20} />
            ) : (
              <Mic className="text-white" size={20} />
            )}
          </button>

          {/* Speaker Button */}
          <button
            onClick={toggleSpeaker}
            className={`w-12 md:w-14 h-12 md:h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
              isSpeakerOn 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {isSpeakerOn ? (
              <Volume2 className="text-white" size={20} />
            ) : (
              <VolumeX className="text-white" size={20} />
            )}
          </button>

          {/* Video Toggle Button (only for video calls) */}
          {isVideoCall && (
            <button
              onClick={onToggleVideo}
              className={`w-12 md:w-14 h-12 md:h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                isVideoEnabled 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isVideoEnabled ? (
                <Video className="text-white" size={20} />
              ) : (
                <VideoOff className="text-white" size={20} />
              )}
            </button>
          )}

          {/* End Call Button */}
          <button
            onClick={onEndCall}
            className="w-12 md:w-14 h-12 md:h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <PhoneOff className="text-white" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
