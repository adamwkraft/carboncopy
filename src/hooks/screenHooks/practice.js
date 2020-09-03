import { useMemo, useCallback } from 'react';
import { useLoop } from '../loop';
import { useSimpleGame } from '../loopHandlers/simpleGame';
import { useCaptureMasks } from '../loopHandlers/captureMasks';
import { useWebcam } from '../../context/webcam';

export const usePractice = () => {
  const loop = useLoop();
  const webcam = useWebcam();
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

  const setCapturedMasks = useCallback(async () => {
    const masks = await Promise.all(
      captureMasks.masks.map(({ overlay }) => webcam.dataUriToImageData(overlay)),
    );
    simpleGame.setMasks(masks);
  }, [captureMasks.masks, simpleGame, webcam]);

  const practice = useMemo(
    () => ({
      loop,
      simpleGame,
      captureMasks,
      handleClickGame,
      setCapturedMasks,
      handleClickCaptureMasks,
    }),
    [handleClickCaptureMasks, setCapturedMasks, handleClickGame, loop, simpleGame, captureMasks],
  );

  return practice;
};
