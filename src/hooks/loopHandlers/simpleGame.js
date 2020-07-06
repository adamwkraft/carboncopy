import JSZip from "jszip";
import JSZipUtils from 'jszip-utils';
import { useMemo, useRef, useCallback, useState } from "react";

import { useIterateMask } from "../iterateMask";
import { useWebcam } from "../../context/webcam";
import { getScoreAndOverlayForSegmentationAndImageData } from "../../lib/util";

export const useSimpleGame = () => {
  const promRef = useRef();
  const webcam = useWebcam();
  const [loading, setLoading] = useState(false);

  const maskIterator = useIterateMask();
  const [scores, setScores] = useState([]);


  const handleZip = useCallback(async (file) => {
    setLoading(true);
    const data = await JSZip.loadAsync(file);
      const binaryMasks = await Promise.all(data
        .filter((name) => name.endsWith('.png'))
        .map(({ name }) => data.file(name).async('base64'))
      );

      const masksAsImageData = await Promise.all(binaryMasks
        .map(b64 => webcam.dataUriToImageData(`data:image/png;base64,${b64}`))
      );

      maskIterator.setMasks(masksAsImageData);
      setLoading(false);
  }, [maskIterator, webcam]);

  const handleLoadSavedMask = useCallback(([file]) => {
    if (file.type !== 'application/zip') {
      console.error('Expected a zip file but got', file.type);
      return;
    }

    handleZip(file);
  }, [handleZip]);

  const handleLoadLocalMasks = useCallback(async ({ target: { value: filename }}) => {
    const file = await new JSZip.external.Promise((resolve, reject) => {
      JSZipUtils.getBinaryContent(process.env.PUBLIC_URL + `/masks/${filename}`, (err, data) => {
          if (err) reject(err);
          else resolve(data);
      });
    });

  handleZip(file)
  }, [handleZip]);

  const handleLoop = useCallback(async (controller) => {
    if (controller.time.first) {
      maskIterator.next(); // load the first mask
      setScores([]); // clear the scores
      controller.useTimer({
        maxLaps: maskIterator.numMasks,
        printSeconds: true,
        announceSeconds: true,
        lapDuration: 3000,
        newLapDelay: 1000,
        onLap: ({ predict, time, stop }) => {
          const target = maskIterator.maskRef.current;

          // we actually shouldn't reach this,
          // because the maxLaps should trigger a stop first
          if (!target) return stop();

          promRef.current = predict(webcam.videoRef.current)
            .then(async segmentation => {
              const { score, overlay } = getScoreAndOverlayForSegmentationAndImageData(target, segmentation, webcam.flipX);

              const dataUri = webcam.imageDataToDataUri(overlay);
              setScores(state => [...state, { score, dataUri }]);

              webcam.clearCanvas();
              maskIterator.next();
            });
        }
      });
    }

    if (maskIterator.maskRef.current) {
      webcam.ctx.putImageData(maskIterator.maskRef.current, 0, 0);
    }
    
    // return a cleanup function to clear the canvas
    // use a promise ref since we are capturing asynchronously
    // if first promise not initialized, clear canvas right away
    return () => {
      if (promRef.current) promRef.current.then(controller.webcam.clearCanvas)
      else controller.webcam.clearCanvas();
    };
  }, [webcam, maskIterator]);

  return useMemo(() => ({
    scores,
    loading,
    handleLoop,
    handleLoadSavedMask,
    handleLoadLocalMasks,
    ready: !!maskIterator.numMasks,
  }), [
    scores,
    loading,
    maskIterator,
    handleLoop,
    handleLoadSavedMask,
    handleLoadLocalMasks,
  ]);
};
