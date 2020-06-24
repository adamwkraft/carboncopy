import { useRef, useState, useCallback, useMemo } from "react";

import { useBodyPix } from "./bodyPix";
import { useWebcam } from "../context/webcam";

export const useMainLoop = (handleLoop) => {
  const webcam = useWebcam();
  const predict = useBodyPix();

  const loopingRef = useRef();
  const [looping, setLooping] = useState(false);

  const setStartLoop = useCallback(() => {
    loopingRef.current = true;
    setLooping(true);
  }, []);
  
  const setStopLoop = useCallback(() => {
    loopingRef.current = false;
    setLooping(false);
  }, []);

  const loop = useCallback(async () => {
    const finished = await handleLoop({ webcam, predict });

    if (loopingRef.current && !finished) {
      requestAnimationFrame(loop);
    } else{
      setStopLoop();
      webcam.clearCanvas();
    }
  }, [
    webcam,
    predict,
    handleLoop,
    setStopLoop,
  ]);

  const start = useCallback(async () => {
    if (!predict) {
      throw new Error('Please wait for BodyPix to load...');
    }
    
    if (!handleLoop) {
      throw new Error('A loop handler is required when calling useMainLoop');
    }

    if (loopingRef.current) {
      console.error('The loop is already looping.');
      return;
    }

    setStartLoop();

    return loop();
  }, [loop, handleLoop, predict, setStartLoop]);

  const controller = useMemo(() => ({
    start,
    stop: setStopLoop,
    ready: predict && webcam.videoStarted,
    looping,
  }), [
    start,
    predict,
    looping,
    setStopLoop,
    webcam.videoStarted,
    ]);

  return controller;
};
