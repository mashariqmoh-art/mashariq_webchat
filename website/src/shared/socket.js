import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  autoConnect: false,
  transports: ['websocket'],
  auth: {
    token: localStorage.getItem('token') || '',
  },
});

export function getSocket() {
  return socket;
}

export function connectSocket() {
  const token = localStorage.getItem('token') || '';
  socket.auth = { token };

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
}

export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
  return socket;
}

export default socket;
