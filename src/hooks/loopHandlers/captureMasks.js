import JSZip from 'jszip';
import imageDataUri from 'image-data-uri';
import { useRef, useCallback, useState } from 'react';

import { saveAs, getSegmentationeOverlayAndBinaryImageData } from '../../lib/util';
import { useMemo } from 'react';

export const useCaptureMasks = ({ maxMasks = 0, setLapTimeInfo } = {}) => {
  const promRef = useRef();
  const masksRef = useRef([]);
  const maskCountRef = useRef();
  const [masks, _setMasks] = useState([]);

  const setMasks = useCallback((arg) => {
    if (typeof arg === 'function') {
      _setMasks((state) => {
        const newState = arg(state);
        if (newState !== state) {
          masksRef.current = newState;
        }

        return newState;
      });
    } else {
      masksRef.current = arg;
      _setMasks(arg);
    }
  }, []);

  const getMasks = useCallback(() => masksRef.current, []);

  const removeMask = useCallback(
    ({ currentTarget: { name: idx } }) => {
      // the plus coerces the idx to a number
      setMasks((state) => state.filter((_, index) => index !== +idx));
    },
    [setMasks],
  );

  const removeAllMasks = useCallback(() => {
    setMasks([]);
  }, [setMasks]);

  const downloadMasks = useCallback(() => {
    const zip = new JSZip();
    const img = zip.folder('masks');
    masks.forEach(({ overlay: mask }, idx) => {
      img.file(`mask-${idx}.png`, imageDataUri.decode(mask).dataBase64, { base64: true });
    });

    zip.generateAsync({ type: 'blob' }).then((zipFile) => saveAs(zipFile, 'masks.zip'));
  }, [masks]);

  const handleLoop = useCallback(
    (onLoopEnd) => async (controller) => {
      if (controller.time.first) {
        maskCountRef.current = masks.length;
        controller.useTimer({
          announceSeconds: true,
          lapDuration: 3000,
          maxLaps: maxMasks,
          setLapTimeInfo: setLapTimeInfo,
          // run a single prediction before starting the lap to ensure things roll smoothly
          onBeforeStartLap: async ({ predict, webcam, time, stop }) => {
            return predict();
          },
          onLap: ({ predict, webcam, time, stop }) => {
            promRef.current = predict(webcam.videoRef.current).then(async (segmentation) => {
              const {
                overlayImageData,
                binaryImageData,
              } = getSegmentationeOverlayAndBinaryImageData(segmentation, webcam.flipX);
              const overlayDataUri = webcam.imageDataToDataUri(overlayImageData);
              const binaryDataUri = webcam.imageDataToDataUri(binaryImageData);

              webcam.clearCanvas();
              webcam.ctx.putImageData(overlayImageData, 0, 0);
              setMasks((state) => [...state, { overlay: overlayDataUri, binary: binaryDataUri }]);

              if (maxMasks && ++maskCountRef.current > maxMasks) {
                return stop();
              }
            });
          },
        });
      }

      // return a cleanup function to clear the canvas
      // use a promise ref since we are capturing asynchronously
      // if first promise not initialized, clear canvas right away
      return () => {
        if (promRef.current) {
          promRef.current.then(controller.webcam.clearCanvas).then(() => {
            if (onLoopEnd) {
              onLoopEnd();
            }
          });
        } else {
          controller.webcam.clearCanvas();
          if (onLoopEnd) {
            onLoopEnd();
          }
        }
      };
    },
    [masks.length, maxMasks, setLapTimeInfo, setMasks],
  );

  return useMemo(
    () => ({
      masks,
      getMasks,
      handleLoop,
      removeMask,
      downloadMasks,
      removeAllMasks,
    }),
    [masks, getMasks, handleLoop, removeMask, downloadMasks, removeAllMasks],
  );
};
