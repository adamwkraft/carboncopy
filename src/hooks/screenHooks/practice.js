import { useMemo, useCallback } from 'react';
import { useLoop } from '../loop';
import { useSimpleGame } from '../loopHandlers/simpleGame';
import { useCaptureMasks } from '../loopHandlers/captureMasks';

export const usePractice = () => {
  const loop = useLoop();
  const simpleGame = useSimpleGame();
  const captureMasks = useCaptureMasks();

  const handleClickGame = useCallback(async () => {
    if (loop.looping) {
      loop.stop();
    } else {
      loop.start(simpleGame.handleLoop);
    }
  }, [loop, simpleGame]);

  const handleClickCaptureMasks = useCallback(() => {
    if (loop.looping) {
      loop.stop();
    } else {
      loop.start(captureMasks.handleLoop);
    }
  }, [loop, captureMasks]);

  const practice = useMemo(
    () => ({
      loop,
      simpleGame,
      captureMasks,
      handleClickGame,
      handleClickCaptureMasks,
    }),
    [handleClickCaptureMasks, handleClickGame, loop, simpleGame, captureMasks],
  );

  return practice;
};
