import { useMemo, useState } from 'react';

import { useScreenController } from './screenController';
import { useEffect } from 'react';
import { screenStates } from '../lib/screenConstants';
import { useLoop } from './loop';

export const useGame = () => {
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

  const game = useMemo(
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

  return game;
};
