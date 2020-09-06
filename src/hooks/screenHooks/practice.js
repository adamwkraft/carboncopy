import { useMemo, useCallback, useState, useEffect } from 'react';

import { useWebcam } from '../../context/webcam';
import { useSimpleGame } from '../loopHandlers/simpleGame';
import { useCaptureMasks } from '../loopHandlers/captureMasks';

export const usePractice = (game) => {
  const { loop } = game;
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
      simpleGame.reset();
    } else {
      loop.start(simpleGame.handleLoop);
      setLoopType('play');
    }
  }, [loop, simpleGame]);

  const handleClickCaptureMasks = useCallback(() => {
    if (loop.looping) {
      loop.stop();
      simpleGame.reset();
    } else {
      loop.start(captureMasks.handleLoop);
      setLoopType('capture');
    }
  }, [loop, captureMasks, simpleGame]);

  const setCapturedMasks = useCallback(async () => {
    const masks = await Promise.all(
      captureMasks.masks.map(({ overlay }) => webcam.dataUriToImageData(overlay)),
    );
    simpleGame.setMasks(masks);
  }, [captureMasks.masks, simpleGame, webcam]);

  const practice = useMemo(
    () => ({
      loopType,
      simpleGame,
      captureMasks,
      handleClickGame,
      setCapturedMasks,
      handleClickCaptureMasks,
    }),
    [
      loopType,
      simpleGame,
      captureMasks,
      handleClickGame,
      setCapturedMasks,
      handleClickCaptureMasks,
    ],
  );

  useEffect(() => {
    game.setMode(practice);
  }, [game, practice]);

  return practice;
};
