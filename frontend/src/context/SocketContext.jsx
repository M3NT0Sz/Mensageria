import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Conectar ao servidor Socket.IO
    const socketInstance = io('http://localhost:3000', {
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      console.log('Conectado ao servidor Socket.IO');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Desconectado do servidor');
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.close();
    };
  }, []);

  const registerUser = (userType, userId, userInfo) => {
    if (!socket) return;

    const userData = {
      type: userType,
      userId,
      userInfo
    };

    setUser(userData);
    socket.emit('register', userData);

    console.log(`Usuário registrado: ${userType} - ${userId}`);
  };

  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };

    setNotifications(prev => [notification, ...prev.slice(0, 9)]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const contextValue = {
    socket,
    isConnected,
    user,
    notifications,
    registerUser,
    addNotification,
    clearNotifications
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};