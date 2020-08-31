import React, { useContext, createContext } from 'react';

import { useAudioController } from '../hooks/audioController';

export const audioContext = createContext();

export const useAudio = () => {
  const state = useContext(audioContext);

  if (state === undefined) {
    throw new Error('useAudio must be used within a AudioProvider');
  }

  return state;
};

const AudioProvider = ({ children }) => {
  const context = useAudioController();

  return <audioContext.Provider value={context}>{children}</audioContext.Provider>;
};

export default AudioProvider;
