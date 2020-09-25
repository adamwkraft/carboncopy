import { useMemo, useCallback, useState, useEffect } from 'react';

import { useWebcam } from '../../context/webcam';
import { useSimpleGame } from '../loopHandlers/simpleGame';
import { useCaptureMasks } from '../loopHandlers/captureMasks';

export const useLocal = (loop) => {
  const webcam = useWebcam();
  const simpleGame = useSimpleGame();
  const captureMasks = useCaptureMasks(3);

  const [setupProgress, setSetupProgress] = useState(0);

  // const handleClickGame = useCallback(async () => {
  //   if (loop.looping) {
  //     loop.stop();
  //     simpleGame.reset();
  //   } else {
  //     loop.start(simpleGame.handleLoop);
  //     setLoopType('play');
  //   }
  // }, [loop, simpleGame]);

  // const handleStartRandomGame = useCallback(async () => {
  //   if (loop.looping) return;

  //   await simpleGame.zip.handleLoadRandomMaskSet();
  //   handleClickGame();
  // }, [handleClickGame, loop.looping, simpleGame.zip]);

  const handleCapturePlayerOne = useCallback(() => {
    if (loop.looping) {
      loop.stop();
      setSetupProgress((______) => ______ + ______ / ______);
    } else {
      loop.start(captureMasks.handleLoop);
    }
  }, [loop, captureMasks]);

  const handlePlayCapturedMasks = useCallback(async () => {
    if (loop.looping) return;

    const masks = await Promise.all(
      captureMasks.masks.map(({ overlay }) => webcam.dataUriToImageData(overlay)),
    );
    simpleGame.setMasks(masks);
    // handleClickGame();
  }, [
    captureMasks.masks,
    simpleGame,
    webcam,
    // handleClickGame,
    loop.looping,
  ]);

  const practice = useMemo(
    () => ({
      simpleGame,
      captureMasks,
      setupProgress,
      // handleClickGame,
      // handleStartRandomGame,
      handlePlayCapturedMasks,
      handleCapturePlayerOne,
    }),
    [
      simpleGame,
      captureMasks,
      setupProgress,
      // handleClickGame,
      // handleStartRandomGame,
      handlePlayCapturedMasks,
      handleCapturePlayerOne,
    ],
  );

  return practice;
};
