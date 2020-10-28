import { useCallback, useMemo, useRef, useState } from 'react';

import { useScreenController } from './screenController';
import { useEffect } from 'react';
import { screenStates } from '../lib/screenConstants';
import { useLoop } from './loop';

const TUTORIAL_LS_KEY = '__TUTORIAL_COMPLETE__';

export const useGameController = () => {
  const loop = useLoop();
  const [mode, setMode] = useState(null);
  const [screenState, screenHandlers] = useScreenController();
  const [tutorialCompleted, setTutorialCompleted] = useState(true);
  const tutorialRef = useRef();

  const markTutorialCompleted = useCallback(() => {
    setTutorialCompleted(true);
  }, []);

  useEffect(() => {
    if (tutorialRef.current) return;

    const hasCompletedTutorial = !!localStorage.getItem(TUTORIAL_LS_KEY);

    if (hasCompletedTutorial) return;

    if (screenState.screen === screenStates.screen.DEFAULT) {
      tutorialRef.current = true;
      localStorage.setItem(TUTORIAL_LS_KEY, true);
      setTutorialCompleted(false);
    }
  }, [screenState]);

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
      tutorial: {
        completed: tutorialCompleted,
        markTutorialCompleted,
      },
    }),
    [screenState, screenHandlers, mode, loop, tutorialCompleted, markTutorialCompleted],
  );

  return gameController;
};
