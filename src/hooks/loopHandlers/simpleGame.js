import JSZip from "jszip";
import { useMemo, useRef, useCallback, useState } from "react";

import { useIterateMask } from "../iterateMask";
import { useWebcam } from "../../context/webcam";
import { getScoreAndOverlayForSegmentationAndImageData } from "../../lib/util";

export const useSimpleGame = () => {
  const promRef = useRef();
  const webcam = useWebcam();

  const maskIterator = useIterateMask();
  const [scores, setScores] = useState([]);

  const handleLoadMasks = useCallback(async ([file]) => {
    if (file.type !== 'application/zip') {
      console.error('Expected a zip file but got', file.type);
      return;
    }

    const data = await JSZip.loadAsync(file);

    const binaryMasks = await Promise.all(data
      .filter((name) => name.endsWith('.png'))
      .map(({ name }) => data.file(name).async('base64'))
    );

    const masksAsImageData = await Promise.all(binaryMasks
      .map(b64 => webcam.dataUriToImageData(`data:image/png;base64,${b64}`))
    );

    maskIterator.setMasks(masksAsImageData);
  }, [maskIterator, webcam]);

  const handleLoop = useCallback(async (controller) => {
    if (controller.time.first) {
      maskIterator.next();
      controller.useTimer({
        printSeconds: true,
        announceSeconds: true,
        lapDuration: 3000,
        newLapDelay: 1000,
        onLap: ({ predict, time, stop }) => {
          const target = maskIterator.maskRef.current;

          if (!target) return stop();

          promRef.current = predict(webcam.videoRef.current)
            .then(async segmentation => {
              const { score, overlay } = getScoreAndOverlayForSegmentationAndImageData(target, segmentation, webcam.flipX);
              setScores(state => [...state, score]);

              webcam.clearCanvas();
              webcam.ctx.putImageData(overlay, 0, 0);
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
    return () => promRef.current.then(controller.webcam.clearCanvas);
  }, [webcam, maskIterator]);

  return useMemo(() => ({
    scores,
    handleLoop,
    handleLoadMasks,
    ready: maskIterator.hasMasks,
  }), [
    scores,
    maskIterator,
    handleLoop,
    handleLoadMasks,
  ]);
};
