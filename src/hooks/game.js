import { useMemo, useState } from 'react';

import { useScreenController } from './screenController';
import { useEffect } from 'react';
import { screenStates } from '../lib/screenConstants';
import { useLoop } from './loop';

export const useGameController = () => {
  const loop = useLoop();
  const [mode, setMode] = useState(null);
  const [screenState, screenHandlers] = useScreenController();

  useEffect(() => {
    if (
      (screenState.screen === screenStates.screen.DEFAULT ||
        screenState.mode === screenStates.mode.DEFAULT) &&
      mode
    ) {
      setMode(null);
    }
  }, [screenState, mode]);

  useEffect(() => {
    if (
      (screenState.screen === screenStates.screen.DEFAULT ||
        screenState.mode === screenStates.mode.DEFAULT) &&
      loop.looping
    ) {
      loop.stop();
    }
  }, [screenState, loop]);

  const gameController = useMemo(
    () => ({
      screen: {
        state: screenState,
        handlers: screenHandlers,
      },
      mode,
      loop,
      setMode,
    }),
    [screenState, screenHandlers, mode, loop],
  );

  return gameController;
};
