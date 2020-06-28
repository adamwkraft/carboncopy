import JSZip from "jszip";
import imageDataUri from 'image-data-uri';
import { useRef, useCallback, useState } from "react";

import {
  saveAs,
  getBinaryOverlay,
  getSegmentationOverlay,
} from "../../lib/util";

export const useSimpleGame = (numCaptures=3) => {
  const promRef = useRef();
  const [masks, setMasks] = useState([]);

  const removeMask = useCallback(({ currentTarget: { name: idx } }) => {
    // the plus coerces the idx to a number
    setMasks(state => state.filter((_, index) => index !== +idx));
  }, []);

  const removeAllMasks = useCallback(() => {
    setMasks([]);
  }, []);

  const downloadMasks = useCallback(() => {
    const zip = new JSZip();
    const img = zip.folder("masks");
    masks.forEach((mask, idx) => {
      img.file(`mask-${idx}.png`, imageDataUri.decode(mask).dataBase64, {base64: true});
    });

    zip.generateAsync({type:'blob'})
      .then(zipFile => saveAs(zipFile, 'masks.zip'));
  }, [masks]);

  const handleLoop = useCallback(async (controller) => {
    if (controller.time.first) {
      controller.useTimer({
        printSeconds: true,
        announceSeconds: true,
        lapDuration: 3000,
        newLapDelay: 1000,
        onLap: ({ predict, webcam, time, stop }) => {
          promRef.current = predict(webcam.videoRef.current)
            .then(async segmentation => {
              const overlay = getSegmentationOverlay(segmentation, webcam.flipX);
              const binaryOverlay = getBinaryOverlay(segmentation, webcam.flipX);
              const dataUri = webcam.imageDataToDataUri(binaryOverlay);

              webcam.clearCanvas();
              webcam.ctx.putImageData(overlay, 0, 0);
              setMasks(state => [...state, dataUri]);
            });
        }
      });
    }
    
    // return a cleanup function to clear the canvas
    // use a promise ref since we are capturing asynchronously
    return () => promRef.current.then(controller.webcam.clearCanvas);
  }, []);

  return { handleLoop, masks, removeMask, removeAllMasks, downloadMasks };
};
