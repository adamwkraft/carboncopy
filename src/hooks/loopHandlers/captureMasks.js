import JSZip from "jszip";
import imageDataUri from 'image-data-uri';
import { useRef, useCallback, useState } from "react";

import {
  saveAs,
  getSegmentationeOverlayAndBinaryImageData
} from "../../lib/util";
import { useMemo } from "react";

export const useCaptureMasks = () => {
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
    masks.forEach(({overlay:mask}, idx) => {
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
              const {overlayImageData, binaryImageData} = getSegmentationeOverlayAndBinaryImageData(segmentation, webcam.flipX);
              const overlayDataUri = webcam.imageDataToDataUri(overlayImageData);
              const binaryDataUri = webcam.imageDataToDataUri(binaryImageData);

              webcam.clearCanvas();
              webcam.ctx.putImageData(overlayImageData, 0, 0);
              setMasks(state => [...state, {overlay: overlayDataUri, binary: binaryDataUri}]);
            });
        }
      });
    }
    
    // return a cleanup function to clear the canvas
    // use a promise ref since we are capturing asynchronously
    // if first promise not initialized, clear canvas right away
    return () => {
      if (promRef.current) promRef.current.then(controller.webcam.clearCanvas)
      else controller.webcam.clearCanvas();
    };
  }, []);

  return useMemo(() => ({
    masks,
    handleLoop,
    removeMask,
    downloadMasks,
    removeAllMasks,
  }), [
    masks,
    handleLoop,
    removeMask,
    downloadMasks,
    removeAllMasks,
  ]);
};
