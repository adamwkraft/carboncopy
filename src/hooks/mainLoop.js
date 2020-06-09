import { useRef, useState, useCallback, useMemo } from "react";

import { useBodyPix } from "./bodyPix";
import { usePolygon } from "./polygon";
import { useWebcam } from "../context/webcam";
import { getScoreAndOverlay } from '../lib/util';

export const useMainLoop = () => {
  const webcam = useWebcam();
  const predict = useBodyPix();
  const { polygonRef, next } = usePolygon();

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
    
    const ctx = webcam.canvasRef.current.getContext('2d');
    
    const image = getScoreAndOverlay (polygonRef.current, segmentation, webcam.flipX);

    ctx.putImageData(image, 0, 0);

    if (loopRef.current) {
      requestAnimationFrame(predictLoop);
    } else{
      webcam.clearCanvas();
    }
  }, [predict, webcam, polygonRef]);

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
    nextPolygon: next,
  }), [start, stop, predict, looping, webcam, next]);

  return controller;
};
