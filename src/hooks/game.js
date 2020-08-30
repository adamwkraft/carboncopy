import { useReducer, useMemo, useCallback } from 'react';

import { initialState, gameStates, types, gameStatesArrays } from '../lib/constants';

const reducer = (state, action) => {
  switch (action.type) {
    case types.SET_GAME_MODE:
      return { ...state, mode: action.value };
    case types.SET_PLAYER_MODE:
      return { ...state, screen: gameStates.screen.PLAY, players: action.value };
    case types.RESET:
      return initialState;
    default:
      throw new Error(`Invalid action: ${action.type}`);
  }
};

export const useGameState = () => {
  const [gameState, dispatch] = useReducer(reducer, initialState);

  const setScreen = useCallback((screen) => {
    if (!gameStatesArrays.screen.includes(screen)) {
      throw new Error(`Unknown screen: ${screen}`);
    }

    dispatch({ type: types.SET_SCREEN, value: screen });
  }, []);

  const setGameMode = useCallback((gameMode) => {
    if (
      ![
        ...gameStatesArrays.mode[gameStates.players.SINGLE_PLAYER],
        ...gameStatesArrays.mode[gameStates.players.MULTIPLAYER],
      ].includes(gameMode)
    ) {
      throw new Error(`Unknown gameMode: ${gameMode}`);
    }

    dispatch({ type: types.SET_GAME_MODE, value: gameMode });
  }, []);

  const setPlayerMode = useCallback((playerMode) => {
    if (!gameStatesArrays.players.includes(playerMode)) {
      throw new Error(`Unknown playerMode: ${playerMode}`);
    }

    dispatch({ type: types.SET_PLAYER_MODE, value: playerMode });
  }, []);

  const resetState = useCallback(() => {
    dispatch({ type: types.RESET });
  }, []);

  const handlers = useMemo(
    () => ({
      setScreen,
      resetState,
      setGameMode,
      setPlayerMode,
    }),
    [setScreen, resetState, setGameMode, setPlayerMode],
  );

  return [gameState, handlers];
};
