import { useEffect, useState } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '../shared/socket.js';

export default function useSocket(token) {
  const socket = getSocket();
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    socket.auth = { token };

    if (!socket.connected) {
      connectSocket();
    }

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      disconnectSocket();
    };
  }, [token]);

  return { socket, connected };
}
