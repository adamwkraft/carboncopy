import { useMemo, useCallback, useState, useEffect } from 'react';

import { DEBUG } from '../../lib/constants';
import { initialLapInfo } from '../lapTimer';
import { useWebcam } from '../../context/webcam';
import { screenStates } from '../../lib/screenConstants';
import { useSimpleGame } from '../loopHandlers/simpleGame';
import { useCaptureMasks } from '../loopHandlers/captureMasks';
import { usePeerJS } from '../../context/peer';

export const NUM_MASKS = DEBUG ? 3 : 5;

export const useRemote = (loop, multiplayerScoreThing) => {
  const webcam = useWebcam();
  const peerJs = usePeerJS();
  const [lapTimeInfo, setLapTimeInfo] = useState(initialLapInfo);
  const simpleGame = useSimpleGame({ setLapTimeInfo, multiplayerScoreThing });
  const captureMasks = useCaptureMasks({ maxMasks: NUM_MASKS, setLapTimeInfo });

  useEffect(() => {
    if (!peerJs.peer) {
      peerJs.init();
    }
  }, [peerJs]);

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

  // setupProgress States:
  // 0 : Both players capture masks simultaneously
  // 1 : Player 1 Plays (using Player 2's masks) 
  // 2 : Player 2 Plays (using Player 3's masks)
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
          const maskDataURIs = captureMasks.getMasks().map(({ overlay }) => overlay);
          if (setupProgress === 0) {
            peerJs.send({
              eventName: 'initialMasks',
              maskDataURIs
            })
            const imageData = await Promise.all(
              maskDataURIs.map((overlay) => webcam.dataUriToImageData(overlay))
            );
            peerJs.setMasks((state) => {
              const playerOneMasks = peerJs.isPlayerOne() ? imageData : state[0];
              const playerTwoMasks = peerJs.isPlayerOne() ? state[1] : imageData;
              return [playerOneMasks, playerTwoMasks]
            });
          } else {
            console.error("Called handleCapture without setupProgress === 0")
          }
          captureMasks.removeAllMasks();
        }),
      );
    }
  }, [loop, captureMasks, setupProgress, webcam, peerJs, incrementProgress]);

  const handlePlayGame = useCallback(() => {
    if (setupProgress === 1) {
      // Player one plays
      if (peerJs.isPlayerOne()) {
        simpleGame.setMasks(peerJs.masks[1]);
        loop.start(simpleGame.handleMultiplayerLoop(0, peerJs.sendResults));
        incrementProgress();
      } else {
        // Do nothing...
        incrementProgress();
      }
    } else if (setupProgress === 2) {
      // Player two plays
      if (!peerJs.isPlayerOne()) {
        simpleGame.setMasks(peerJs.masks[0]);
        loop.start(simpleGame.handleMultiplayerLoop(1, peerJs.sendResults));
        incrementProgress();
      } else {
        // Do nothing...
        incrementProgress();
      }
    }
  }, [loop, peerJs, simpleGame, setupProgress, incrementProgress]);

  const handleReset = useCallback(() => {
    setSetupProgress(0);
    simpleGame.clearScores();
    peerJs.resetGame();
  }, [simpleGame, peerJs]);

  const handleOpponentReset = useCallback(() => {
    setSetupProgress(0);
    simpleGame.clearScores();
    peerJs.setOpponentClickedReset(false);
  }, [peerJs, simpleGame]);

  useEffect(() => {
    if (peerJs.opponentClickedReset) {
      handleOpponentReset();
    }
  }, [peerJs, handleOpponentReset]);

  const handleClick = useCallback(() => {
    if (loop.looping) return;

    if (setupProgress === 0) {
      handleCapture();
    } else if (setupProgress < 3) {
      handlePlayGame();
    } else {
      handleReset();
    }
  }, [loop.looping, handlePlayGame, handleCapture, handleReset, setupProgress]);

  const local = useMemo(
    () => ({
      peerJs,
      name: screenStates.mode['Multi Player'].REMOTE,
      simpleGame,
      handleClick,
      lapTimeInfo,
      captureMasks,
      setupProgress,
      multiplayerResultsText,
      multiplayerScoreSums,
      incrementProgress,
      NUM_MASKS,
    }),
    [
      peerJs,
      simpleGame,
      lapTimeInfo,
      captureMasks,
      setupProgress,
      handleClick,
      multiplayerResultsText,
      multiplayerScoreSums,
      incrementProgress,
    ],
  );

  return local;
};
