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
  const [scores, setScores] = useState([]);
  const zip = useZip(maskIterator.setMasks);
  const {
    handlers: {
      speech: { say },
    },
  } = useAudio();

  const clearScores = useCallback(() => {
    setScores([]);
  }, []);

  const handleLoop = useCallback(
    async (controller) => {
      if (controller.time.first) {
        maskIterator.next(); // load the first mask
        clearScores();
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

              setScores((state) => [...state, { score, dataUri }]);

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

  const handleSurvivalLoop = useCallback(
    async (controller) => {
      if (controller.time.first) {
        maskIterator.random();
        clearScores();
        controller.useTimer({
          maxLaps: 9999999, // Good luck surviving this long!
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

              setScores((state) => [...state, { score, dataUri }]);

              webcam.clearCanvas();
              const tenBinScore = rawScoreToTenBinScore(score);
              if (tenBinScore < 5) {
                // Game Over
                maskIterator.reset();
                return stop();
              } else {
                controller.timerRef.current.lapDuration =
                  Math.floor(Math.max(controller.timerRef.current.lapDuration * 0.9, 1) * 10) / 10;
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
        maskIterator.next();
        clearScores();
        controller.useTimer({
          setLapTimeInfo: setLapTimeInfo,
          announceSeconds: false,
          lapDuration: 500,
          postLapDelay: 0,
          onLap: ({ predict, time, stop }) => {
            const currentMaskIdx = maskIterator.maskIdxRef.current;
            const target = maskIterator.maskRef.current;

            // we will reach this
            if (!target) {
              stop();
              roundTracker.current = 0;
              maskIterator.reset();
              return stop();
            }

            // if we hit this then we succeeded in the predict promise
            // but fired a new lap before it succeeded
            if (roundTracker.current >= currentMaskIdx) return;

            promRef.current = predict(webcam.videoRef.current)
              .then(async (segmentation) => {
                const score = getScore(target, segmentation, webcam.flipX);

                const tenBinScore = rawScoreToTenBinScore(score);
                if (tenBinScore > 5) {
                  const { score, targetOverlay } = getScoreAndOverlayForSegmentationAndImageData(
                    target,
                    segmentation,
                    webcam.flipX,
                  );
                  const dataUri = webcam.imageDataToDataUri(targetOverlay);
                  // if we hit this then we succeeded in the predict promise
                  // but fired a new lap before it succeeded
                  if (roundTracker.current >= currentMaskIdx) return;
                  say('Got it!');
                  setScores((state) => [...state, { score, dataUri }]);
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
    [webcam, maskIterator, clearScores, setLapTimeInfo, say],
  );

  return useMemo(
    () => ({
      zip,
      scores,
      handleLoop,
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
      handleLoop,
      handleSurvivalLoop,
      handleTimeAttackLoop,
      clearScores,
      maskIterator.hasMasks,
      maskIterator.reset,
      maskIterator.setMasks,
    ],
  );
};
