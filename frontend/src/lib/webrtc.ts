'use client';

import { socketService } from './socket';

export interface CallData {
  callId: string;
  senderId: string;
  signal: {
    type: 'offer' | 'answer' | 'ice-candidate';
    sdp?: RTCSessionDescriptionInit;
    candidate?: RTCIceCandidateInit;
  };
}

export interface ActiveCall {
  id: string;
  partnerId: string;
  partnerName: string;
  isIncoming: boolean;
  isConnected: boolean;
  startTime?: Date;
  localStream?: MediaStream;
  remoteStream?: MediaStream;
}

class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private callId: string | null = null;
  private isInitiator = false;
  private partnerId: string | null = null;
  
  // Callbacks
  private onCallRequestCallback?: (data: { 
    callId: string;
    senderId: string;
    senderName: string;
    callType: 'audio' | 'video';
  }) => void;
  private onCallAcceptedCallback?: (data: { callId: string }) => void;
  private onCallRejectedCallback?: (data: { callId: string }) => void;
  private onCallEndedCallback?: (data: { callId: string }) => void;
  private onRemoteStreamCallback?: (stream: MediaStream) => void;
  private onLocalStreamCallback?: (stream: MediaStream) => void;
  private onConnectionStateChangeCallback?: (state: RTCPeerConnectionState) => void;

  private configuration: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  constructor() {
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    // Handle incoming call requests
    socketService.onCallRequest((data) => {
      this.onCallRequestCallback?.(data);
    });

    // Handle call accepted
    socketService.onCallAccepted((data) => {
      this.onCallAcceptedCallback?.(data);
      // Initialize peer connection for the caller
      if (this.isInitiator) {
        this.initializePeerConnection();
        this.createOffer();
      }
    });

    // Handle call rejected
    socketService.onCallRejected((data) => {
      this.onCallRejectedCallback?.(data);
      this.cleanup();
    });

    // Handle call ended
    socketService.onCallEnded((data) => {
      this.onCallEndedCallback?.(data);
      this.cleanup();
    });

    // Handle WebRTC signaling
    socketService.onWebRTCSignal((data) => {
      this.handleSignalingMessage(data);
    });
  }

  // Set callbacks for WebRTC events
  onCallRequest(callback: (data: { 
    callId: string;
    senderId: string;
    senderName: string;
    callType: 'audio' | 'video';
  }) => void) {
    this.onCallRequestCallback = callback;
  }

  onCallAccepted(callback: (data: { callId: string }) => void) {
    this.onCallAcceptedCallback = callback;
  }

  onCallRejected(callback: (data: { callId: string }) => void) {
    this.onCallRejectedCallback = callback;
  }

  onCallEnded(callback: (data: { callId: string }) => void) {
    this.onCallEndedCallback = callback;
  }

  onRemoteStream(callback: (stream: MediaStream) => void) {
    this.onRemoteStreamCallback = callback;
  }

  onLocalStream(callback: (stream: MediaStream) => void) {
    this.onLocalStreamCallback = callback;
  }

  onConnectionStateChange(callback: (state: RTCPeerConnectionState) => void) {
    this.onConnectionStateChangeCallback = callback;
  }

  // Initialize call (caller)
  async startCall(targetUserId: string, callType: 'audio' | 'video' = 'audio'): Promise<string> {
    try {
      this.callId = this.generateCallId();
      this.partnerId = targetUserId;
      this.isInitiator = true;

      // Get user media
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === 'video',
      });

      this.onLocalStreamCallback?.(this.localStream);

      // Send call request
      socketService.sendCallRequest({ 
        receiverId: targetUserId, 
        callType: callType 
      });

      return this.callId;
    } catch (error) {
      console.error('Error starting call:', error);
      throw error;
    }
  }

  // Accept incoming call
  async acceptCall(callId: string, callType: 'audio' | 'video' = 'audio'): Promise<void> {
    try {
      this.callId = callId;
      this.isInitiator = false;

      // Get user media
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === 'video',
      });

      this.onLocalStreamCallback?.(this.localStream);

      // Initialize peer connection
      this.initializePeerConnection();

      // Accept the call
      socketService.acceptCall({ callId });
    } catch (error) {
      console.error('Error accepting call:', error);
      throw error;
    }
  }

  // Reject incoming call
  rejectCall(callId: string, reason?: string) {
    socketService.rejectCall({ callId, reason });
  }

  // End current call
  endCall() {
    if (this.callId) {
      socketService.endCall({ callId: this.callId });
    }
    this.cleanup();
  }

  // Initialize peer connection
  private initializePeerConnection() {
    this.peerConnection = new RTCPeerConnection(this.configuration);

    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        this.peerConnection!.addTrack(track, this.localStream!);
      });
    }

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      this.onRemoteStreamCallback?.(this.remoteStream);
    };

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.callId && this.partnerId) {
        socketService.sendWebRTCSignal({
          callId: this.callId,
          receiverId: this.partnerId,
          signal: {
            type: 'ice-candidate',
            candidate: event.candidate.toJSON(),
          },
        });
      }
    };

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection!.connectionState;
      console.log('Connection state:', state);
      this.onConnectionStateChangeCallback?.(state);

      if (state === 'disconnected' || state === 'failed') {
        this.cleanup();
      }
    };
  }

  // Create offer (caller)
  private async createOffer() {
    if (!this.peerConnection || !this.callId || !this.partnerId) return;

    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      socketService.sendWebRTCSignal({
        callId: this.callId,
        receiverId: this.partnerId,
        signal: {
          type: 'offer',
          sdp: offer,
        },
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }

  // Handle signaling messages
  private async handleSignalingMessage(data: CallData) {
    if (!this.peerConnection || data.callId !== this.callId) return;

    try {
      this.partnerId = data.senderId;

      switch (data.signal.type) {
        case 'offer':
          await this.handleOffer(data.signal.sdp!);
          break;
        case 'answer':
          await this.handleAnswer(data.signal.sdp!);
          break;
        case 'ice-candidate':
          await this.handleIceCandidate(data.signal.candidate!);
          break;
      }
    } catch (error) {
      console.error('Error handling signaling message:', error);
    }
  }

  // Handle offer (callee)
  private async handleOffer(sdp: RTCSessionDescriptionInit) {
    if (!this.peerConnection || !this.callId || !this.partnerId) return;

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
    
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);

    socketService.sendWebRTCSignal({
      callId: this.callId,
      receiverId: this.partnerId,
      signal: {
        type: 'answer',
        sdp: answer,
      },
    });
  }

  // Handle answer (caller)
  private async handleAnswer(sdp: RTCSessionDescriptionInit) {
    if (!this.peerConnection) return;
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
  }

  // Handle ICE candidate
  private async handleIceCandidate(candidate: RTCIceCandidateInit) {
    if (!this.peerConnection) return;
    await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  // Generate unique call ID
  private generateCallId(): string {
    return `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Cleanup method
  cleanup() {
    console.log('Cleaning up WebRTC connection');

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.remoteStream = null;
    this.callId = null;
    this.partnerId = null;
    this.isInitiator = false;
  }

  // Toggle audio
  toggleAudio(enabled: boolean) {
    if (!this.localStream) return;
    
    const audioTracks = this.localStream.getAudioTracks();
    audioTracks.forEach(track => {
      track.enabled = enabled;
    });
  }

  // Toggle video
  toggleVideo(enabled: boolean) {
    if (!this.localStream) return;
    
    const videoTracks = this.localStream.getVideoTracks();
    videoTracks.forEach(track => {
      track.enabled = enabled;
    });
  }

  // Getters
  get getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  get getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }
}

export const webRTCService = new WebRTCService();
export default webRTCService;
