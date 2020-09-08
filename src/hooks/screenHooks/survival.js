import { useMemo, useCallback } from 'react';
import { useLoop } from '../loop';
import { useSimpleGame } from '../loopHandlers/simpleGame';
import { useCaptureMasks } from '../loopHandlers/captureMasks';
import SelectInput from '@material-ui/core/Select/SelectInput';

export const useSurvival = () => {
  const loop = useLoop();
  const simpleGame = useSimpleGame();
  const captureMasks = useCaptureMasks();

  const handleClickGame = useCallback(async () => {
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
