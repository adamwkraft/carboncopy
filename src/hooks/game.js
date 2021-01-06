import { useCallback, useMemo, useRef, useState } from 'react';

import { useScreenController } from './screenController';
import { useEffect } from 'react';
import { screenStates } from '../lib/screenConstants';
import { useLoop } from './loop';
import { useAudio } from '../context/audio';

export const useGameController = () => {
  const loop = useLoop();
  const [mode, setMode] = useState(null);
  const [screenState, screenHandlers] = useScreenController();
  const [warningAcknowledged, setWarningAcknowledged] = useState(false);
  const warningRef = useRef();
  const audio = useAudio();
  const [helpOpen, setHelpOpen] = useState(false);

  const handleOpenHelp = useCallback(() => {
    setHelpOpen(true);
  }, []);

  const handleCloseHelp = useCallback(() => {
    setHelpOpen(false);
  }, []);

  const handleCloseWarning = useCallback(() => {
    setWarningAcknowledged(true);
  }, []);

  const headerController = useMemo(
    () => ({
      onHomeScreen: screenState.screen === screenStates.screen.DEFAULT,
      handleBack: screenHandlers.reverseState,
      toggleAudio: audio.handlers.toggle,
      audioState: audio.state,
      openHelp: handleOpenHelp,
      closeHelp: handleCloseHelp,
      helpOpen,
    }),
    [screenState, screenHandlers, audio, handleCloseHelp, handleOpenHelp, helpOpen],
  );

  useEffect(() => {
    if (warningRef.current) return;

    if (screenState.screen === screenStates.screen.DEFAULT) {
      warningRef.current = true;
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
      warning: {
        completed: warningAcknowledged,
        handleCloseWarning,
      },
    }),
    [
      mode,
      loop,
      screenState,
      screenHandlers,
      headerController,
      handleCloseWarning,
      warningAcknowledged,
    ],
  );

  return gameController;
};
