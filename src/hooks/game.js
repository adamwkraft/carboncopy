import { useReducer, useMemo, useCallback } from 'react';

import { gameStates, types } from '../lib/constants';

const initialState = {
  screen: gameStates.screen.START,
};

const reducer = (state, action) => {
  switch (action.type) {
    case types.screen.SET:
      return { ...state, screen: action.value };
    default:
      throw new Error(`Invalid action: ${action.type}`);
  }
};

export const useGameState = () => {
  const [gameState, dispatch] = useReducer(reducer, initialState);

  const setScreen = useCallback((screen) => {
    if (!Object.values(gameStates.screen).includes(screen)) {
      throw new Error(`Unknown screen: ${screen}`);
    }

    dispatch({ type: types.screen.SET, value: screen });
  }, []);

  const handlers = useMemo(
    () => ({
      setScreen,
    }),
    [setScreen],
  );

  return [gameState, handlers];
};
