import React, { useContext, createContext } from 'react';

import { useBodyPixController } from '../hooks/bodyPixController';

export const bodyPixContext = createContext();

export const useBodyPix = () => {
  const state = useContext(bodyPixContext);

  // specifically check for undefined, not just truthy
  // bc bodyPixController returns null before it is ready
  if (state === undefined) {
    throw new Error('useBodyPix must be used within a BodyPixProvider');
  }

  return state;
};

const BodyPixProvider = ({children}) => {
  const context = useBodyPixController();

  return (
    <bodyPixContext.Provider value={context}>
      {children}
    </bodyPixContext.Provider>
  )
}

export default BodyPixProvider;
