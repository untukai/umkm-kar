// A placeholder WebSocket signaling service.
// In a real application, this would be replaced with a robust backend service.
// This uses a public echo server which is not ideal for production but demonstrates the concept.

const SIGNALING_SERVER_URL = 'wss://socketsbay.com/wss/v2/1/demo/';

let socket: WebSocket | null = null;
let onMessageCallback: ((message: any) => void) | null = null;
let currentSessionId: string | null = null;

const signalingService = {
  connect: (sessionId: string) => {
    if (socket && socket.readyState === WebSocket.OPEN && currentSessionId === sessionId) {
      console.log('Already connected to signaling service for this session.');
      return;
    }
    
    // If connecting to a new session, disconnect the old one first.
    if (socket) {
        socket.close();
    }
    
    currentSessionId = sessionId;
    socket = new WebSocket(SIGNALING_SERVER_URL);

    socket.onopen = () => {
      console.log(`Signaling service connected for session: ${sessionId}`);
      // In a real app, you would join a specific room for the session.
      // This demo server doesn't support rooms, so we filter messages on the client-side.
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // **CRITICAL**: Filter messages to only process those for the current session.
        // This simulates a "room" on the client-side, which a real backend would handle.
        if (message.sessionId === currentSessionId && onMessageCallback) {
          onMessageCallback(message);
        }
      } catch (error) {
        // Ignore non-JSON messages that might be sent by other clients on the public server.
      }
    };
    
    socket.onerror = (error) => {
      console.error('Signaling service error:', error);
    };

    socket.onclose = () => {
      console.log('Signaling service disconnected.');
      if (currentSessionId === sessionId) {
        socket = null;
        currentSessionId = null;
      }
    };
  },
  
  sendMessage: (message: any) => {
    // The message MUST include a sessionId property.
    if (!message.sessionId) {
        console.error('Signaling message must include a sessionId.');
        return;
    }
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.error('Signaling service is not connected.');
    }
  },

  onMessage: (callback: (message: any) => void) => {
    onMessageCallback = callback;
  },
  
  disconnect: () => {
    if (socket) {
      socket.close();
      socket = null;
    }
    onMessageCallback = null;
    currentSessionId = null;
  }
};

export default signalingService;