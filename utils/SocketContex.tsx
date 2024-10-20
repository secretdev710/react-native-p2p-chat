import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextProps {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextProps>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socketRef, setSocketRef] = useState<Socket | null>(null);

  useEffect(() => {
    setSocketRef(io('http://192.168.132.72:3000'));

    return () => {
      // Cleanup when the component unmounts
      let socketTmp = socketRef;
      socketTmp?.disconnect();
      setSocketRef(socketTmp);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef }}>
      {children}
    </SocketContext.Provider>
  );
};