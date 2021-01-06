import io from 'socket.io-client';
import { useMemo, useEffect, useState } from 'react';

export const useSocketHandler = () => {
  const [ready, setReady] = useState(false);
  const socket = useMemo(() => {
    const _socket = io('http://localhost:3001');

    return _socket;
  }, []);

  useEffect(() => {
    console.log(socket);
    console.log('Setting up connection listeners');

    socket.on('connect', (...args) => {
      console.log('connected to socket server', ...args);
      setReady(true);
    });

    socket.on('reconnect', (...args) => {
      console.log('reconnected to socket server', ...args);
      setReady(true);
    });

    socket.on('disconnect', (...args) => {
      console.log('disconnected from socket server', ...args);
      setReady(false);
    });

    socket.on('adam', (msg) => {
      console.log('Adam:', msg);
    });

    return () => {
      console.log('__DISCONNECTING_SOCKET__');
      socket.disconnect();
    };
  }, [socket]);

  return useMemo(
    () => ({
      ready,
      _socket: socket,
    }),
    [ready, socket],
  );
};
