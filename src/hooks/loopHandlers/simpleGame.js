import { useMemo, useRef, useCallback, useState } from 'react';

import { useZip } from '../zip';
import { useAudio } from '../../context/audio';
import { useIterateMask } from '../iterateMask';
import { useWebcam } from '../../context/webcam';
import { rawScoreToTenBinScore } from '../../lib/score';
import { getScoreAndOverlayForSegmentationAndImageData, getScore } from '../../lib/util';

export const useSimpleGame = ({ setLapTimeInfo } = {}) => {
  const promRef = useRef();
  const webcam = useWebcam();
  const roundTracker = useRef(0);
  const maskIterator = useIterateMask();
  const lastTimeAttackSuccess = useRef(0);
  const [scores, setScores] = useState([]);
  const [multiplayerScores, setMultiplayerScores] = useState([[], []]);
  const zip = useZip(maskIterator.setMasks);
  const {
    handlers: {
      sfx: { playSuccessSound, playFailureSound },
    },
  } = useAudio();

  const clearScores = useCallback(() => {
    setScores([]);
    setMultiplayerScores([[], []]);
  }, []);

  const handleBasicLoop = useCallback(
    (playerIndex) => async (controller) => {
      if (controller.time.first) {
        maskIterator.next(); // load the first mask
        if (!playerIndex) clearScores();
        controller.useTimer({
          maxLaps: maskIterator.getNumMasks(),
          setLapTimeInfo: setLapTimeInfo,
          announceSeconds: true,
          onLap: ({ predict, time, stop }) => {
            const target = maskIterator.maskRef.current;

            // we actually shouldn't reach this,
            // because the maxLaps should trigger a stop first
            if (!target) return stop();

            promRef.current = predict(webcam.videoRef.current).then(async (segmentation) => {
              const { score, targetOverlay } = getScoreAndOverlayForSegmentationAndImageData(
                target,
                segmentation,
                webcam.flipX,
              );

              const dataUri = webcam.imageDataToDataUri(targetOverlay);

              if (playerIndex !== undefined) {
                setMultiplayerScores((state) => {
                  const newState = [...state];
                  newState[playerIndex] = [
                    ...newState[playerIndex],
                    { score: rawScoreToTenBinScore(score), dataUri },
                  ];

                  return newState;
                });
              } else {
                setScores((state) => [...state, { score: rawScoreToTenBinScore(score), dataUri }]);
              }

              webcam.clearCanvas();
              maskIterator.next();
            });
          },
        });
      }

      if (maskIterator.maskRef.current) {
        webcam.ctx.putImageData(maskIterator.maskRef.current, 0, 0);
      }

      // return a cleanup function to clear the canvas
      // use a promise ref since we are capturing asynchronously
      // if first promise not initialized, clear canvas right away
      return () => {
        if (promRef.current) promRef.current.then(controller.webcam.clearCanvas);
        else controller.webcam.clearCanvas();
      };
    },
    [webcam, maskIterator, setLapTimeInfo, clearScores],
  );

  const handleLoop = useCallback(() => handleBasicLoop(), [handleBasicLoop]);

  const handleMultiplayerLoop = useCallback((playerIndex) => handleBasicLoop(playerIndex), [
    handleBasicLoop,
  ]);

  const handleSurvivalLoop = useCallback(
    async (controller) => {
      if (controller.time.first) {
        maskIterator.random();
        clearScores();
        controller.useTimer({
          maxLaps: 9999999, // Good luck surviving this long!
          lapDuration: 10.0 * 1000, // Initial time
          setLapTimeInfo: setLapTimeInfo,
          announceSeconds: true,
          onLap: ({ predict, time, stop }) => {
            const target = maskIterator.maskRef.current;

            // we actually shouldn't reach this,
            // because the maxLaps should trigger a stop first
            if (!target) return stop();

            promRef.current = predict(webcam.videoRef.current).then(async (segmentation) => {
              const { score, targetOverlay } = getScoreAndOverlayForSegmentationAndImageData(
                target,
                segmentation,
                webcam.flipX,
              );

              const dataUri = webcam.imageDataToDataUri(targetOverlay);

              setScores((state) => [...state, { score: rawScoreToTenBinScore(score), dataUri }]);

              webcam.clearCanvas();
              const tenBinScore = rawScoreToTenBinScore(score);
              if (tenBinScore < 4) {
                // Game Over
                maskIterator.reset();
                return stop();
              } else {
                // Adjust time - multiply (decay) by 0.9.
                // controller.timerRef.current.lapDuration =
                //   Math.floor(Math.max(controller.timerRef.current.lapDuration * 0.9, 1) * 10) / 10;

                // Adjust time linear - subtract a fixed value.
                // controller.timerRef.current.lapDuration =
                //   Math.floor(Math.max(controller.timerRef.current.lapDuration - 500, 1000) * 10) /
                //   10;

                // Adjust time, t + 1 = t - log(t) - small_constant
                // Intervals are: [10, 9.3, 8.6, 7.9, 7.4, 6.7, 6.1, 5.6, 5.0, 4.5, 4.0, 3.6, 3.2, 2.7, 2.4, 2.0, 1.8, 1.5, 1.3, 1.1, 1.0 ...... 0.67]
                const t_sec = controller.timerRef.current.lapDuration / 1000;
                controller.timerRef.current.lapDuration =
                  (t_sec - Math.log(t_sec) / Math.log(50)) * 1000 - 100;

                maskIterator.random();
              }
            });
          },
        });
      }

      if (maskIterator.maskRef.current) {
        webcam.ctx.putImageData(maskIterator.maskRef.current, 0, 0);
      }

      // return a cleanup function to clear the canvas
      // use a promise ref since we are capturing asynchronously
      // if first promise not initialized, clear canvas right away
      return () => {
        if (promRef.current) promRef.current.then(controller.webcam.clearCanvas);
        else controller.webcam.clearCanvas();
      };
    },
    [webcam, maskIterator, setLapTimeInfo, clearScores],
  );

  const handleTimeAttackLoop = useCallback(
    async (controller) => {
      if (controller.time.first) {
        maskIterator.resetAndShuffle();
        maskIterator.next();
        clearScores();
        roundTracker.current = 0;
        lastTimeAttackSuccess.current = 0;
        controller.useTimer({
          setLapTimeInfo: setLapTimeInfo,
          announceSeconds: false,
          lapDuration: 250,
          postLapDelay: 0,
          onLap: ({ predict, time, stop }) => {
            const currentMaskIdx = maskIterator.maskIdxRef.current;
            const target = maskIterator.maskRef.current;

            // we will reach this
            if (!target) {
              // stop(); TODO: Check if we need this.
              roundTracker.current = 0;
              maskIterator.reset();
              return stop();
            }

            // if we hit this then we succeeded in the predict promise
            // but fired a new lap before it succeeded
            if (roundTracker.current >= currentMaskIdx) return;

            const maxTimeAllowed = 10.0;
            const segmentationMs = time.elapsed - lastTimeAttackSuccess.current;
            if (segmentationMs / 1000 >= maxTimeAllowed) {
              lastTimeAttackSuccess.current = time.elapsed;
              // say('Missed it!');
              playFailureSound();
              const dataUri = webcam.imageDataToDataUri(target);
              setScores((state) => [...state, { score: maxTimeAllowed, dataUri }]);
              webcam.clearCanvas();
              maskIterator.next();
              roundTracker.current++;
            }

            promRef.current = predict(webcam.videoRef.current)
              .then(async (segmentation) => {
                const score = getScore(target, segmentation, webcam.flipX);

                const tenBinScore = rawScoreToTenBinScore(score);
                if (tenBinScore > 5) {
                  const segmentationSec = segmentationMs / 1000;
                  lastTimeAttackSuccess.current = time.elapsed;
                  const numSecs = Number(segmentationSec.toFixed(1));

                  const { targetOverlay } = getScoreAndOverlayForSegmentationAndImageData(
                    target,
                    segmentation,
                    webcam.flipX,
                  );
                  const dataUri = webcam.imageDataToDataUri(targetOverlay);
                  // if we hit this then we succeeded in the predict promise
                  // but fired a new lap before it succeeded
                  if (roundTracker.current >= currentMaskIdx) return;
                  // say('Got it!');
                  playSuccessSound();
                  setScores((state) => [...state, { score: numSecs, dataUri }]);
                  webcam.clearCanvas();
                  maskIterator.next();
                  roundTracker.current++;
                }
              })
              .catch(console.error);
          },
        });
      }

      if (maskIterator.maskRef.current) {
        webcam.ctx.putImageData(maskIterator.maskRef.current, 0, 0);
      }

      // return a cleanup function to clear the canvas
      // use a promise ref since we are capturing asynchronously
      // if first promise not initialized, clear canvas right away
      return () => {
        if (promRef.current) promRef.current.then(controller.webcam.clearCanvas);
        else controller.webcam.clearCanvas();
      };
    },
    [webcam, maskIterator, clearScores, setLapTimeInfo, playFailureSound, playSuccessSound],
  );

  return useMemo(
    () => ({
      zip,
      scores,
      multiplayerScores,
      handleLoop,
      handleMultiplayerLoop,
      handleSurvivalLoop,
      handleTimeAttackLoop,
      clearScores,
      reset: maskIterator.reset,
      ready: maskIterator.hasMasks,
      setMasks: maskIterator.setMasks,
    }),
    [
      zip,
      scores,
      multiplayerScores,
      handleLoop,
      handleMultiplayerLoop,
      handleSurvivalLoop,
      handleTimeAttackLoop,
      clearScores,
      maskIterator.hasMasks,
      maskIterator.reset,
      maskIterator.setMasks,
    ],
  );
};
