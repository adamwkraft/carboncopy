import { useRef, useState, useCallback, useMemo } from "react";

import { useBodyPix } from "./bodyPix";
import { drawResult} from '../lib/util';
import { useWebcam } from "../context/webcam";

export const useMainLoop = () => {
  const webcam = useWebcam();
  const predict = useBodyPix();

  const loopRef = useRef();
  const [looping, setLooping] = useState(false);
  
  const setStartLoop = useCallback(() => {
    loopRef.current = true;
    setLooping(true);
  }, []);
  
  const setStopLoop = useCallback(() => {
    loopRef.current = false;
    setLooping(false);
  }, []);

  const predictLoop = useCallback(async () => {
    const segmentation = await predict();

    // console.log({segmentation});

    const width = webcam?.canvasRef?.current?.width;
    const height = webcam?.canvasRef?.current?.height;

    const template = [
      [0.25*width, .25*height],
      [0.75*width, .25*height],
      [0.75*width, .5*height],
      [0.5*width, .5*height],
      [0.5*width, height],
      [0.25*width, height],
    ];
    
    const ctx = webcam.canvasRef.current.getContext('2d');
    
    const image = drawResult(template, segmentation, webcam.flipX);

    ctx.putImageData(image, 0, 0);

    if (loopRef.current) {
      requestAnimationFrame(predictLoop);
    } else{
      webcam.clearCanvas();
    }
  }, [predict, webcam]);

  const start = useCallback(async () => {
    if (!predict) {
      throw new Error('Please wait for the BodyPix to load...');
    } else if (loopRef.current) {
      console.error('The app is already running.');
      return;
    }

    setStartLoop();

    return predictLoop();
  }, [predict, predictLoop, setStartLoop]);

  const stop = useCallback(() => {
    setStopLoop();
  }, [setStopLoop]);

  const controller = useMemo(() => ({
    start,
    stop,
    ready: predict && webcam.videoStarted,
    looping,
  }), [start, stop, predict, looping, webcam]);

  return controller;
};
