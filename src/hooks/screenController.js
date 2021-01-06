import { useReducer, useMemo, useCallback } from 'react';

import {
  initialScreenState,
  screenStates,
  screenTypes,
  screenStatesArrays,
} from '../lib/screenConstants';

const reducer = (state, action) => {
  switch (action.type) {
    case screenTypes.SET_GAME_MODE:
      return { ...state, mode: action.value };
    case screenTypes.SET_PLAYER_MODE:
      return { ...state, screen: screenStates.screen.PLAY, players: action.value };
    case screenTypes.RESET:
      return initialScreenState;
    case screenTypes.REVERSE: {
      const newState = { ...state };
      if (state.mode) {
        newState.mode = screenStates.mode.DEFAULT;
      } else if (state.screen !== screenStates.screen.DEFAULT) {
        newState.screen = screenStates.screen.DEFAULT;
        newState.players = screenStates.players.DEFAULT;
      } else return state;

      return newState;
    }
    default:
      throw new Error(`Invalid action: ${action.type}`);
  }
};

export const useScreenController = () => {
  const [screenState, dispatch] = useReducer(reducer, initialScreenState);

  const setScreen = useCallback((screen) => {
    if (!screenStatesArrays.screen.includes(screen)) {
      throw new Error(`Unknown screen: ${screen}`);
    }

    dispatch({ type: screenTypes.SET_SCREEN, value: screen });
  }, []);

  const setGameMode = useCallback((gameMode) => {
    if (
      ![
        ...screenStatesArrays.mode[screenStates.players.SINGLE_PLAYER],
        ...screenStatesArrays.mode[screenStates.players.MULTIPLAYER],
      ].includes(gameMode)
    ) {
      throw new Error(`Unknown gameMode: ${gameMode}`);
    }

    dispatch({ type: screenTypes.SET_GAME_MODE, value: gameMode });
  }, []);

  const setPlayerMode = useCallback((playerMode) => {
    if (!screenStatesArrays.players.includes(playerMode)) {
      throw new Error(`Unknown playerMode: ${playerMode}`);
    }

    dispatch({ type: screenTypes.SET_PLAYER_MODE, value: playerMode });
  }, []);

  const resetState = useCallback(() => {
    dispatch({ type: screenTypes.RESET });
  }, []);

  const reverseState = useCallback(() => {
    dispatch({ type: screenTypes.REVERSE });
  }, []);

  const handlers = useMemo(
    () => ({
      setScreen,
      resetState,
      setGameMode,
      reverseState,
      setPlayerMode,
    }),
    [setScreen, resetState, setGameMode, reverseState, setPlayerMode],
  );

  return [screenState, handlers];
};
