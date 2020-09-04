import { useMemo, useCallback } from 'react';
import { useLoop } from '../loop';
import { useSimpleGame } from '../loopHandlers/simpleGame';
import { useCaptureMasks } from '../loopHandlers/captureMasks';

export const useSurvival = () => {
  const loop = useLoop();
  const simpleGame = useSimpleGame();
  const captureMasks = useCaptureMasks();

  const handleClickGame = useCallback(async () => {
    simpleGame.handleLoadShippedMasks('set2.zip'); // TODO: Make a Survival Set.
    if (loop.looping) {
      loop.stop();
    } else {
      loop.start(simpleGame.handleSurvivalLoop);
    }
  }, [loop, simpleGame]);

  const handleClickCaptureMasks = useCallback(() => {
    if (loop.looping) {
      loop.stop();
    } else {
      loop.start(captureMasks.handleLoop);
    }
  }, [loop, captureMasks]);

  const survival = useMemo(
    () => ({
      loop,
      simpleGame,
      captureMasks,
      handleClickGame,
      handleClickCaptureMasks,
    }),
    [handleClickCaptureMasks, handleClickGame, loop, simpleGame, captureMasks],
  );

  return survival;
};
