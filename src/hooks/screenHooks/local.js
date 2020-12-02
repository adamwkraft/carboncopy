import { useMemo, useCallback, useState } from 'react';

import { useWebcam } from '../../context/webcam';
import { useSimpleGame } from '../loopHandlers/simpleGame';
import { useCaptureMasks } from '../loopHandlers/captureMasks';
import { initialLapInfo } from '../lapTimer';
import { DEBUG } from '../../lib/constants';

const NUM_MASKS = DEBUG ? 1 : 5;

export const useLocal = (loop) => {
  const webcam = useWebcam();
  const [lapTimeInfo, setLapTimeInfo] = useState(initialLapInfo);
  const simpleGame = useSimpleGame({ setLapTimeInfo });
  const captureMasks = useCaptureMasks({ maxMasks: NUM_MASKS, setLapTimeInfo });

  const multiplayerScoreSums = useMemo(
    () =>
      simpleGame.multiplayerScores.map((scores) =>
        scores.length && !loop.looping ? scores.reduce((acc, { score }) => acc + score, 0) : 0,
      ),
    [simpleGame, loop],
  );

  const multiplayerResultsText = useMemo(
    () =>
      multiplayerScoreSums.map(
        (score, playerIdx) =>
          `Player ${playerIdx ? 'Two' : 'One'} scored a total of ${score} points`,
      ),
    [multiplayerScoreSums],
  );

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
    const maskIndex = setupProgress === 2 ? 1 : 0;
    const playerIndex = setupProgress === 2 ? 0 : 1;

    simpleGame.setMasks(masks[maskIndex]);
    loop.start(simpleGame.handleMultiplayerLoop(playerIndex));
    incrementProgress();
  }, [loop, masks, simpleGame, setupProgress, incrementProgress]);

  const handleReset = useCallback(() => {
    setSetupProgress(0);
    simpleGame.clearScores();
  }, [simpleGame]);

  const handleClick = useCallback(() => {
    if (loop.looping) return;

    if (setupProgress < 2) {
      handleCapture();
    } else if (setupProgress < 4) {
      handlePlayGame();
    } else {
      handleReset();
    }
  }, [loop.looping, handlePlayGame, handleCapture, handleReset, setupProgress]);

  const local = useMemo(
    () => ({
      name: 'local',
      simpleGame,
      handleClick,
      lapTimeInfo,
      captureMasks,
      setupProgress,
      multiplayerResultsText,
      multiplayerScoreSums,
      NUM_MASKS,
    }),
    [
      simpleGame,
      lapTimeInfo,
      captureMasks,
      setupProgress,
      handleClick,
      multiplayerResultsText,
      multiplayerScoreSums,
    ],
  );

  return local;
};
