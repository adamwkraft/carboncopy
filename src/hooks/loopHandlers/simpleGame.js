import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import { useMemo, useRef, useCallback, useState } from 'react';

import { useIterateMask } from '../iterateMask';
import { useWebcam } from '../../context/webcam';
import { getScoreAndOverlayForSegmentationAndImageData } from '../../lib/util';

export const useSimpleGame = () => {
  const promRef = useRef();
  const webcam = useWebcam();
  const [loading, setLoading] = useState(false);

  const maskIterator = useIterateMask();
  const [scores, setScores] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0.0);
  const [selectedMasks, setSelectedMasks] = useState(null);

  const clearScores = useCallback(() => {
    setScores([]);
  }, []);

  const handleZip = useCallback(
    async (file) => {
      setLoading(true);
      const data = await JSZip.loadAsync(file);
      const binaryMasks = await Promise.all(
        data
          .filter((name) => name.endsWith('.png'))
          .map(({ name }) => data.file(name).async('base64')),
      );

      const masksAsImageData = await Promise.all(
        binaryMasks.map((b64) => webcam.dataUriToImageData(`data:image/png;base64,${b64}`)),
      );

      maskIterator.setMasks(masksAsImageData);
      setLoading(false);
    },
    [maskIterator, webcam],
  );

  const handleLoadUserMasks = useCallback(
    ([file]) => {
      if (file.type !== 'application/zip') {
        console.error('Expected a zip file but got', file.type);
        return;
      }

      handleZip(file);
      setSelectedMasks(null);
    },
    [handleZip],
  );

  const handleLoadShippedMasks = useCallback(
    async (filename) => {
      if (!filename) {
        setSelectedMasks(null);
        return;
      }

      const file = await new JSZip.external.Promise((resolve, reject) => {
        JSZipUtils.getBinaryContent(process.env.PUBLIC_URL + `/masks/${filename}`, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });

      handleZip(file);
      setSelectedMasks(filename);
    },
    [handleZip],
  );

  const handleLoop = useCallback(
    async (controller) => {
      const lapDuration = 3000;
      if (controller.time.first) {
        maskIterator.next(); // load the first mask
        setProgressPercent(0.0);
        clearScores();
        controller.useTimer({
          maxLaps: maskIterator.numMasks,
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
        setProgressPercent(0.0);
        clearScores();
        controller.useTimer({
          maxLaps: 99999999999999,
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

              // Some Notes:
              // -I think one more countdown is still enabled.
              // -It is a big laggy, is there something weird about the logic?
              // -Obviously, we need a larger set of masks to randomly iterate through.

              // TODO: Create score utils to re-use scoring logic.
              if (score > 100) {
                // Game Over
                maskIterator.reset();
                return stop;
              } else {
                maskIterator.random();
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
      scores,
      progressPercent,
      loading,
      handleLoop,
      handleSurvivalLoop,
      clearScores,
      selectedMasks,
      handleLoadUserMasks,
      handleLoadShippedMasks,
      ready: !!maskIterator.numMasks,
    }),
    [
      scores,
      progressPercent,
      loading,
      handleLoop,
      handleSurvivalLoop,
      clearScores,
      maskIterator,
      selectedMasks,
      handleLoadUserMasks,
      handleLoadShippedMasks,
    ],
  );
};
