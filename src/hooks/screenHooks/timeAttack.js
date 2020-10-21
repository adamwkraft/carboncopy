import { useMemo, useCallback } from 'react';

import { useSimpleGame } from '../loopHandlers/simpleGame';
import { useRef } from 'react';
import { useEffect } from 'react';

export const useTimeAttack = (loop) => {
  const simpleGame = useSimpleGame();

  const loadedRef = useRef(false);

  const resultsText = useMemo(() => {
    let total =
      simpleGame.scores.length && !loop.looping
        ? simpleGame.scores.reduce((acc, { score }) => acc + score, 0)
        : 0;
    const average = +total.toFixed(1) / simpleGame.scores.length;

    return `You finished Time Attack in ${total.toFixed(1)}
      seconds, averaging ${average.toFixed(1)} seconds per pose!`;
  }, [simpleGame, loop]);

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
      name: 'time attack',
      simpleGame,
      resultsText,
      handleClickGame,
    }),
    [simpleGame, resultsText, handleClickGame],
  );

  return timeAttack;
};
