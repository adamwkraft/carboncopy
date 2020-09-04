import { useMemo, useCallback } from 'react';

import { useLoop } from '../loop';
import { useWebcam } from '../../context/webcam';
import { useSimpleGame } from '../loopHandlers/simpleGame';
import { useCaptureMasks } from '../loopHandlers/captureMasks';
import { useState } from 'react';
import { useEffect } from 'react';

export const usePractice = () => {
  const loop = useLoop();
  const webcam = useWebcam();
  const simpleGame = useSimpleGame();
  const captureMasks = useCaptureMasks();
  const [loopType, setLoopType] = useState(null);

  useEffect(() => {
    if (!loop.looping && loopType) {
      setLoopType(null);
    }
  }, [loop.looping, loopType]);

  const handleClickGame = useCallback(async () => {
    if (loop.looping) {
      loop.stop();
    } else {
      loop.start(simpleGame.handleLoop);
      setLoopType('play');
    }
  }, [loop, simpleGame]);

  const handleClickCaptureMasks = useCallback(() => {
    if (loop.looping) {
      loop.stop();
    } else {
      loop.start(captureMasks.handleLoop);
      setLoopType('capture');
    }
  }, [loop, captureMasks]);

  const setCapturedMasks = useCallback(async () => {
    const masks = await Promise.all(
      captureMasks.masks.map(({ overlay }) => webcam.dataUriToImageData(overlay)),
    );
    simpleGame.setMasks(masks);
  }, [captureMasks.masks, simpleGame, webcam]);

  const practice = useMemo(
    () => ({
      loop,
      loopType,
      simpleGame,
      captureMasks,
      handleClickGame,
      setCapturedMasks,
      handleClickCaptureMasks,
    }),
    [
      loop,
      loopType,
      simpleGame,
      captureMasks,
      handleClickGame,
      setCapturedMasks,
      handleClickCaptureMasks,
    ],
  );

  return practice;
};
