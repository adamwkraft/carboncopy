import { useMemo } from 'react';

import { usePractice } from './screenHooks/practice';
import { useScreenController } from './screenController';

export const useGame = () => {
  const [screenState, screenHandlers] = useScreenController();
  const practice = usePractice();

  const game = useMemo(
    () => ({
      screen: {
        state: screenState,
        handlers: screenHandlers,
      },
      mode: {
        practice,
      },
    }),
    [screenState, screenHandlers, practice],
  );

  return game;
};
