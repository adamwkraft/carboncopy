import { useMemo, useRef, useCallback, useState } from 'react';

import { useZip } from '../zip';
import { useIterateMask } from '../iterateMask';
import { useWebcam } from '../../context/webcam';
import { getScoreAndOverlayForSegmentationAndImageData } from '../../lib/util';
import { rawScoreToTenBinScore } from '../../lib/score_utils';

export const useSimpleGame = () => {
  const promRef = useRef();
  const webcam = useWebcam();
  const maskIterator = useIterateMask();
  const [scores, setScores] = useState([]);
  const zip = useZip(maskIterator.setMasks);
  const [progressPercent, setProgressPercent] = useState(0);

  const clearScores = useCallback(() => {
    setScores([]);
  }, []);

  const handleLoop = useCallback(
    async (controller) => {
      const lapDuration = 3000;
      if (controller.time.first) {
        maskIterator.next(); // load the first mask
        setProgressPercent(0.0);
        clearScores();
        controller.useTimer({
          maxLaps: maskIterator.getNumMasks(),
          printSeconds: true,
          announceSeconds: true,
          lapDuration,
          newLapDelay: 1000,
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
      } else {
        // Set the progress
        const progress_percent = Math.min(controller.time.lapTime / lapDuration, 1.0);
        setProgressPercent(Math.round(progress_percent * 100));
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
    [webcam, maskIterator, clearScores],
  );

  const handleSurvivalLoop = useCallback(
    async (controller) => {
      const lapDuration = 3000;
      if (controller.time.first) {
        maskIterator.random();
        // maskIterator.infiniteNext();
        setProgressPercent(0.0);
        clearScores();
        controller.useTimer({
          maxLaps: 9999999, // Good luck surviving this long!
          printSeconds: true,
          announceSeconds: true,
          lapDuration,
          newLapDelay: 1000,
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
              // // Blend and create a new DataUri
              // webcam.clearScratchpad();
              // webcam.scratchpad.ctx.putImageData(segOverlay, 0, 0);
              // webcam.scratchpad.ctx.putImageData(targetOverlay, 0, 0);
              // const dataUri = webcam.scratchpad.canvas.toDataURL('image/png');
              // webcam.clearScratchpad();

              setScores((state) => [...state, { score, dataUri }]);

              webcam.clearCanvas();
              const tenBinScore = rawScoreToTenBinScore(score);
              if (tenBinScore < 5) {
                // Game Over
                maskIterator.reset();
                return stop();
              } else {
                maskIterator.random();
                // maskIterator.infiniteNext();
              }
            });
          },
        });
      } else {
        // Set the progress
        const progress_percent = Math.min(controller.time.lapTime / lapDuration, 1.0);
        setProgressPercent(Math.round(progress_percent * 100));
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
    [webcam, maskIterator, clearScores],
  );

  return useMemo(
    () => ({
      zip,
      scores,
      handleLoop,
      handleSurvivalLoop,
      clearScores,
      progressPercent,
      reset: maskIterator.reset,
      ready: maskIterator.hasMasks,
      setMasks: maskIterator.setMasks,
    }),
    [
      zip,
      scores,
      progressPercent,
      handleLoop,
      handleSurvivalLoop,
      clearScores,
      maskIterator.hasMasks,
      maskIterator.reset,
      maskIterator.setMasks,
    ],
  );
};
