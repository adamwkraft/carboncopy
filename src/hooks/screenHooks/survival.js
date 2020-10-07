import { useState } from 'react';
import { useRef, useEffect, useMemo, useCallback } from 'react';
import { useSimpleGame } from '../loopHandlers/simpleGame';
import { useCaptureMasks } from '../loopHandlers/captureMasks';
import { initialLapInfo } from '../lapTimer';

export const useSurvival = (loop) => {
  const [lapTimeInfo, setLapTimeInfo] = useState(initialLapInfo);
  const simpleGame = useSimpleGame({ setLapTimeInfo });
  const captureMasks = useCaptureMasks({ setLapTimeInfo });

  const resultsText = useMemo(
    () =>
      `You survived ${simpleGame?.scores?.length - 1} round${
        simpleGame?.scores?.length !== 2 ? 's' : ''
      }.`,
    [simpleGame.scores],
  );

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
      name: 'survival',
      loop,
      simpleGame,
      lapTimeInfo,
      resultsText,
      captureMasks,
      handleClickGame,
      handleClickCaptureMasks,
    }),
    [
      loop,
      simpleGame,
      lapTimeInfo,
      resultsText,
      captureMasks,
      handleClickGame,
      handleClickCaptureMasks,
    ],
  );

  return survival;
};
