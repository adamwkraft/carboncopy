import React, { createContext, useContext } from 'react';

import { useSocketHandler } from './socketHandler';

const socketContext = createContext();

export const useSocket = () => {
  const ctx = useContext(socketContext);

  if (ctx === undefined) {
    throw new Error('useSocket must be called within a WebsocketProvider');
  }

  return ctx;
};

const WebsocketProvider = ({children}) => {
  const socketHandler = useSocketHandler();

  return (
    <socketContext.Provider value={socketHandler}>
      {typeof children === 'function' ? children(socketHandler) : children}
    </socketContext.Provider>
  )
};

export default WebsocketProvider;
