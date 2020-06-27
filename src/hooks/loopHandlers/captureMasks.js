import { getSegmentationOverlay, getBinaryOverlay, saveAs } from "../../lib/util";
import { useRef } from "react";
import { useCallback } from "react";
import { useSpeech } from "../speech";
import { useState } from "react";
import JSZip from "jszip";
import imageDataUri from 'image-data-uri';

const CAPTURE_MS = 3000;
const CAPTURE_S = CAPTURE_MS / 1000;

export const useCaptureMasks = (numCaptures=3) => {
  const promRef = useRef();
  const captureRef = useRef();
  const speech = useSpeech();
  const lastSpeechRef = useRef();
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

  const handleLoop = useCallback(async ({ predict, webcam, time, stop }) => {
    const { ctx } = webcam;
    ctx.font = '40px Arial';
    ctx.fillStyle = 'white';
    ctx.clearRect(0, 0, 50, 50);

    const secondsPassed = Math.floor(time.timer / 1000);
    // force min to 0 as we get a single instance of -1 otherwise
    const countdown = Math.max(CAPTURE_S - secondsPassed, 0);

    // print countdown time on the screen
    if (countdown) { // don't print if 0
      ctx.fillText(countdown, 10, 40);

      // announce the current countdown time (if not announced yet)
      if (lastSpeechRef.current !== countdown) {
        lastSpeechRef.current = countdown;
        speech.say(`${countdown}`);
      }
    }
    
    // Once we've reached the time to capture (and only once)
    // capture a segmentation and push it into the state array
    // also display the overlay to provide some feedback
    if (time.timer > CAPTURE_MS && !captureRef.current) {
      captureRef.current = true;
      promRef.current = predict(webcam.videoRef.current)
        .then(async segmentation => {
          const overlay = getSegmentationOverlay(segmentation, webcam.flipX);
          const binaryOverlay = getBinaryOverlay(segmentation, webcam.flipX);
          const dataUri = webcam.imageDataToDataUri(binaryOverlay);

          webcam.clearCanvas();
          ctx.putImageData(overlay, 0, 0);
          setMasks(state => [...state, dataUri]);
        });
    // if we've already captured and delayed an extra second reset the timer
    } else if (time.timer > CAPTURE_MS + 1000) {
      time.resetTimer();
      captureRef.current = false;
    }

    // return a cleanup function to clear the canvas
    // use a promise ref since we are capturing asynchronously
    return () => promRef.current.then(webcam.clearCanvas);
  }, [speech]);

  return { handleLoop, masks, removeMask, removeAllMasks, downloadMasks };
};
