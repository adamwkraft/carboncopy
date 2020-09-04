import { useMemo } from 'react';

import { usePractice } from './screenHooks/practice';
import { useSurvival } from './screenHooks/survival';
import { useScreenController } from './screenController';

export const useGame = () => {
  const [screenState, screenHandlers] = useScreenController();
  const practice = usePractice();
  const survival = useSurvival();

  const game = useMemo(
    () => ({
      screen: {
        state: screenState,
        handlers: screenHandlers,
      },
      mode: {
        practice,
        survival,
      },
    }),
    [screenState, screenHandlers, practice, survival],
  );

  return game;
};
