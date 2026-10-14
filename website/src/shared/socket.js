import { io } from 'socket.io-client';
import api from './api';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001';

class SocketClient {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        auth: { token: api.getToken() },
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected() {
    return !!(this.socket && this.socket.connected);
  }

  on(event, handler) {
    this.connect().on(event, handler);
  }

  off(event, handler) {
    if (this.socket) this.socket.off(event, handler);
  }

  emit(event, payload, ack) {
    this.connect().emit(event, payload, ack);
  }
}

const socketClient = new SocketClient();
export default socketClient;
