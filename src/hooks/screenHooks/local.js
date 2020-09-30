import { useMemo, useCallback, useState } from 'react';

import { useWebcam } from '../../context/webcam';
import { useSimpleGame } from '../loopHandlers/simpleGame';
import { useCaptureMasks } from '../loopHandlers/captureMasks';

export const useLocal = (loop) => {
  const webcam = useWebcam();
  const [lapTimeInfo, setLapTimeInfo] = useState({});
  const simpleGame = useSimpleGame({ setLapTimeInfo });
  const captureMasks = useCaptureMasks({ maxMasks: 3, setLapTimeInfo });

  const [masks, setMasks] = useState([[], []]);
  const [setupProgress, setSetupProgress] = useState(0);
  const incrementProgress = useCallback(() => {
    setSetupProgress((_) => _ + 1);
  }, []);

  const handleCapture = useCallback(() => {
    if (loop.looping) {
      loop.stop();
    } else {
      incrementProgress();
      loop.start(
        captureMasks.handleLoop(async () => {
          const imageData = await Promise.all(
            captureMasks.getMasks().map(({ overlay }) => webcam.dataUriToImageData(overlay)),
          );

          if (setupProgress === 0) {
            setMasks([imageData, []]);
          } else if (setupProgress === 1) {
            setMasks((state) => [[...state[0]], imageData]);
          }
          captureMasks.removeAllMasks();
        }),
      );
    }
  }, [loop, captureMasks, setupProgress, webcam, incrementProgress]);

  const handlePlayGame = useCallback(() => {
    simpleGame.setMasks(masks[setupProgress === 2 ? 1 : 0]);
    loop.start(simpleGame.handleLoop);
    incrementProgress();
  }, [loop, masks, simpleGame, setupProgress, incrementProgress]);

  const handleClick = useCallback(() => {
    if (loop.looping) return;

    if (setupProgress < 2) {
      handleCapture();
    } else if (setupProgress < 4) {
      handlePlayGame();
    }
  }, [loop.looping, handlePlayGame, handleCapture, setupProgress]);

  const practice = useMemo(
    () => ({
      simpleGame,
      handleClick,
      lapTimeInfo,
      captureMasks,
      setupProgress,
    }),
    [simpleGame, lapTimeInfo, captureMasks, setupProgress, handleClick],
  );

  return practice;
};
