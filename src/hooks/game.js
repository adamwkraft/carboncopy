import { useCallback, useMemo, useRef, useState } from 'react';

import { useScreenController } from './screenController';
import { useEffect } from 'react';
import { screenStates } from '../lib/screenConstants';
import { useLoop } from './loop';
import { useAudio } from '../context/audio';

const TUTORIAL_LS_KEY = '__TUTORIAL_COMPLETE__';

export const useGameController = () => {
  const loop = useLoop();
  const [mode, setMode] = useState(null);
  const [screenState, screenHandlers] = useScreenController();
  const [tutorialCompleted, setTutorialCompleted] = useState(true);
  const tutorialRef = useRef();
  const audio = useAudio();
  const [helpOpen, setHelpOpen] = useState(false);

  const handleOpenHelp = useCallback(() => {
    setHelpOpen(true);
  }, []);

  const handleCloseHelp = useCallback(() => {
    setHelpOpen(false);
    setTutorialCompleted(true);
  }, []);

  const headerController = useMemo(
    () => ({
      onHomeScreen: screenState.screen === screenStates.screen.DEFAULT,
      handleBack:
        screenState.players === screenStates.players.MULTIPLAYER
          ? screenHandlers.resetState
          : screenHandlers.reverseState,
      toggleAudio: audio.handlers.toggle,
      audioState: audio.state,
      openHelp: handleOpenHelp,
      closeHelp: handleCloseHelp,
      helpOpen: helpOpen || !tutorialCompleted,
    }),
    [
      screenState,
      screenHandlers,
      audio,
      handleCloseHelp,
      handleOpenHelp,
      helpOpen,
      tutorialCompleted,
    ],
  );

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
      headerController,
      tutorial: {
        completed: tutorialCompleted,
      },
    }),
    [screenState, screenHandlers, mode, loop, tutorialCompleted, headerController],
  );

  return gameController;
};
