const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 1234;

// Track active rooms and their connections
const activeRooms = new Map();

// Create HTTP server for handling room management API
const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle room ending API endpoint
  if (req.method === 'POST' && req.url?.startsWith('/api/rooms/') && req.url?.endsWith('/end')) {
    const roomId = req.url.split('/')[3];
    
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        console.log(`Ending room: ${roomId}`);
        
        // Get all connections for this room
        const roomConnections = activeRooms.get(roomId) || new Set();
        
        console.log(`Found ${roomConnections.size} connections for room ${roomId}`);
        
        // Send end session message to all connected clients
        roomConnections.forEach(ws => {
          if (ws.readyState === WebSocket.OPEN) {
            console.log(`Sending room-ended message to client in room ${roomId}`);
            ws.send(JSON.stringify({
              type: 'room-ended',
              roomId: roomId,
              message: 'The session has been ended by the host'
            }));
          }
        });
        
        // Clean up room
        activeRooms.delete(roomId);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          message: 'Room ended successfully',
          notifiedClients: roomConnections.size
        }));
        
      } catch (error) {
        console.error('Error ending room:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to end room' }));
      }
    });
    return;
  }
  
  // Health check endpoint
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'healthy', 
      activeRooms: activeRooms.size,
      uptime: process.uptime()
    }));
    return;
  }
  
  res.writeHead(404);
  res.end('Not found');
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  // Extract room ID from URL path
  const url = new URL(req.url, `http://${req.headers.host}`);
  const roomId = url.pathname.slice(1); // Remove leading slash
  
  if (!roomId) {
    ws.close(1008, 'Room ID required');
    return;
  }
  
  console.log(`New connection to room: ${roomId}`);
  
  // Track this connection for the room
  if (!activeRooms.has(roomId)) {
    activeRooms.set(roomId, new Set());
  }
  activeRooms.get(roomId).add(ws);
  
  console.log(`Room ${roomId} now has ${activeRooms.get(roomId).size} connections`);
  
  // Basic message forwarding for Y.js (simplified)
  ws.on('message', (message) => {
    // Forward Y.js messages to other clients in the same room
    const roomConnections = activeRooms.get(roomId);
    if (roomConnections) {
      roomConnections.forEach(otherWs => {
        if (otherWs !== ws && otherWs.readyState === WebSocket.OPEN) {
          otherWs.send(message);
        }
      });
    }
  });
  
  // Handle connection close
  ws.on('close', () => {
    console.log(`Connection closed for room: ${roomId}`);
    const roomConnections = activeRooms.get(roomId);
    if (roomConnections) {
      roomConnections.delete(ws);
      if (roomConnections.size === 0) {
        activeRooms.delete(roomId);
        console.log(`Room ${roomId} is now empty`);
      } else {
        console.log(`Room ${roomId} now has ${roomConnections.size} connections`);
      }
    }
  });
  
  // Handle errors
  ws.on('error', (error) => {
    console.error(`WebSocket error for room ${roomId}:`, error);
  });
});

server.listen(PORT, () => {
  console.log(`Custom WebSocket server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log(`Room management API available at http://localhost:${PORT}/api/rooms/:roomId/end`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down WebSocket server...');
  wss.close(() => {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
});

module.exports = { server, wss };
