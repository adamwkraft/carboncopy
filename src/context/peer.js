import React, { useContext, createContext } from 'react';

import { usePeerJSController } from '../hooks/peerJSController';

export const peerJSContext = createContext();

export const usePeerJS = () => {
  const state = useContext(peerJSContext);

  if (state === undefined) {
    throw new Error('usePeerJS must be used within a PeerJSProvider');
  }

  return state;
};

const PeerJSProvider = ({ children }) => {
  const context = usePeerJSController();

  return <peerJSContext.Provider value={context}>{children}</peerJSContext.Provider>;
};

export default PeerJSProvider;
