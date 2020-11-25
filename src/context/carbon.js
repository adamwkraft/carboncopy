import React, { useContext, createContext } from 'react';

import { useCarbonController } from '../hooks/carbonController';

export const carbonContext = createContext();

export const useCarbon = () => {
  const state = useContext(carbonContext);

  if (state === undefined) {
    throw new Error('useCarbon must be used within a CarbonProvider');
  }

  return state;
};

const CarbonProvider = ({ children }) => {
  const context = useCarbonController();

  return <carbonContext.Provider value={context}>{children}</carbonContext.Provider>;
};

export default CarbonProvider;
