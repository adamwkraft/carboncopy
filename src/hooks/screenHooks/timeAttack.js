import { useMemo, useCallback } from 'react';

import { useSimpleGame } from '../loopHandlers/simpleGame';
import { useRef } from 'react';
import { useEffect } from 'react';

export const useTimeAttack = (loop) => {
  const simpleGame = useSimpleGame();

  const loadedRef = useRef(false);
  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true;
      simpleGame.zip.handleLoadPreparedMasks('survival_2.zip');
    }
  }, [simpleGame]);

  const handleClickGame = useCallback(async () => {
    if (loop.looping) {
      loop.stop();
      simpleGame.reset();
    } else {
      loop.start(simpleGame.handleTimeAttackLoop);
    }
  }, [loop, simpleGame]);

  const timeAttack = useMemo(
    () => ({
      simpleGame,
      handleClickGame,
    }),
    [simpleGame, handleClickGame],
  );

  return timeAttack;
};
