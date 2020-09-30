import { useRef, useEffect, useMemo, useCallback } from 'react';
import { useSimpleGame } from '../loopHandlers/simpleGame';
import { useCaptureMasks } from '../loopHandlers/captureMasks';

export const useSurvival = (loop) => {
  const simpleGame = useSimpleGame();
  const captureMasks = useCaptureMasks();

  const loadedRef = useRef(false);
  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true;
      simpleGame.zip.handleLoadPreparedMasks('survival_2.zip'); // TODO: Make a BETTER Survival Set.
    }
  }, [simpleGame]);

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
      loop.start(captureMasks.handleLoop());
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
