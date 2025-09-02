'use client';

import { useState, useEffect, useCallback } from 'react';
import { webRTCService } from '@/lib/webrtc';

interface CallState {
  isInCall: boolean;
  incomingCall: {
    callId: string;
    senderId: string;
    senderName: string;
    callType: 'audio' | 'video';
  } | null;
  activeCall: {
    id: string;
    partnerId: string;
    partnerName: string;
    isIncoming: boolean;
    isConnected: boolean;
    startTime?: Date;
  } | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isVideoEnabled: boolean;
}

export function useWebRTC() {
  const [callState, setCallState] = useState<CallState>({
    isInCall: false,
    incomingCall: null,
    activeCall: null,
    localStream: null,
    remoteStream: null,
    isMuted: false,
    isVideoEnabled: false,
  });

  // Initialize WebRTC service callbacks
  useEffect(() => {
    // Handle incoming call requests
    webRTCService.onCallRequest((data: {
      callId: string;
      senderId: string;
      senderName: string;
      callType: 'audio' | 'video';
    }) => {
      setCallState(prev => ({
        ...prev,
        incomingCall: data,
      }));
    });

    // Handle call accepted
    webRTCService.onCallAccepted((_data: { callId: string }) => {
      setCallState(prev => ({
        ...prev,
        incomingCall: null,
        activeCall: prev.activeCall ? {
          ...prev.activeCall,
          isConnected: false, // Will be set to true when connection is established
        } : null,
        isInCall: true,
      }));
    });

    // Handle call rejected
    webRTCService.onCallRejected((_data: { callId: string }) => {
      setCallState(prev => ({
        ...prev,
        incomingCall: null,
        activeCall: null,
        isInCall: false,
        localStream: null,
        remoteStream: null,
      }));
      webRTCService.cleanup();
    });

    // Handle call ended
    webRTCService.onCallEnded((_data: { callId: string }) => {
      setCallState(prev => ({
        ...prev,
        incomingCall: null,
        activeCall: null,
        isInCall: false,
        localStream: null,
        remoteStream: null,
      }));
      webRTCService.cleanup();
    });

    // Handle local stream
    webRTCService.onLocalStream((stream: MediaStream) => {
      setCallState(prev => ({
        ...prev,
        localStream: stream,
        isVideoEnabled: stream.getVideoTracks().length > 0,
      }));
    });

    // Handle remote stream
    webRTCService.onRemoteStream((stream: MediaStream) => {
      setCallState(prev => ({
        ...prev,
        remoteStream: stream,
      }));
    });

    // Handle connection state changes
    webRTCService.onConnectionStateChange((state: RTCPeerConnectionState) => {
      console.log('Connection state changed:', state);
      if (state === 'connected') {
        setCallState(prev => ({
          ...prev,
          activeCall: prev.activeCall ? {
            ...prev.activeCall,
            isConnected: true,
            startTime: new Date(),
          } : null,
        }));
      } else if (state === 'disconnected' || state === 'failed') {
        setCallState(prev => ({
          ...prev,
          incomingCall: null,
          activeCall: null,
          isInCall: false,
          localStream: null,
          remoteStream: null,
        }));
        webRTCService.cleanup();
      }
    });

    return () => {
      webRTCService.cleanup();
    };
  }, []);

  // Start a call
  const startCall = useCallback(async (targetUserId: string, targetName: string, callType: 'audio' | 'video' = 'audio') => {
    try {
      const callId = await webRTCService.startCall(targetUserId, callType);
      
      setCallState(prev => ({
        ...prev,
        activeCall: {
          id: callId,
          partnerId: targetUserId,
          partnerName: targetName,
          isIncoming: false,
          isConnected: false,
        },
        isInCall: true,
      }));
    } catch (error) {
      console.error('Failed to start call:', error);
      // Handle error (show toast, etc.)
    }
  }, []);

  // Accept incoming call
  const acceptCall = useCallback(async () => {
    if (!callState.incomingCall) return;

    try {
      await webRTCService.acceptCall(
        callState.incomingCall.callId,
        callState.incomingCall.callType
      );

      setCallState(prev => ({
        ...prev,
        incomingCall: null,
        activeCall: {
          id: prev.incomingCall!.callId,
          partnerId: prev.incomingCall!.senderId,
          partnerName: prev.incomingCall!.senderName,
          isIncoming: true,
          isConnected: false,
        },
        isInCall: true,
      }));
    } catch (error) {
      console.error('Failed to accept call:', error);
    }
  }, [callState.incomingCall]);

  // Reject incoming call
  const rejectCall = useCallback(() => {
    if (!callState.incomingCall) return;
    
    webRTCService.rejectCall(callState.incomingCall.callId);
    setCallState(prev => ({
      ...prev,
      incomingCall: null,
    }));
  }, [callState.incomingCall]);

  // End current call
  const endCall = useCallback(() => {
    webRTCService.endCall();
    setCallState(prev => ({
      ...prev,
      incomingCall: null,
      activeCall: null,
      isInCall: false,
      localStream: null,
      remoteStream: null,
    }));
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const newMutedState = !callState.isMuted;
    webRTCService.toggleAudio(!newMutedState);
    
    setCallState(prev => ({
      ...prev,
      isMuted: newMutedState,
    }));
  }, [callState.isMuted]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    const newVideoState = !callState.isVideoEnabled;
    webRTCService.toggleVideo(newVideoState);
    
    setCallState(prev => ({
      ...prev,
      isVideoEnabled: newVideoState,
    }));
  }, [callState.isVideoEnabled]);

  return {
    ...callState,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo,
  };
}
