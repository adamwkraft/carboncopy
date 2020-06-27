import { useRef, useState, useCallback, useMemo } from "react";

import { useBodyPix } from "./bodyPix";
import { useWebcam } from "../context/webcam";
import { useLoopTimer } from "./useLoopTimer";

export const useLoop = (handleLoop) => {
  const webcam = useWebcam();
  const predict = useBodyPix();

  const timer = useLoopTimer();
  const loopingRef = useRef();
  const [looping, setLooping] = useState(false);

  const setStartLoop = useCallback(() => {
    timer.reset();
    loopingRef.current = true;
    setLooping(true);
  }, [timer]);
  
  const setStopLoop = useCallback(() => {
    loopingRef.current = false;
    setLooping(false);
  }, []);

  const loop = useCallback(async (timestamp) => {
    const time = timer.update(timestamp);
    const cleanup = await handleLoop({ webcam, predict, time, stop: setStopLoop });

    if (loopingRef.current) {
      requestAnimationFrame(loop);
    } else{
      setStopLoop();
      webcam.clearCanvas();
      if (cleanup) cleanup();
    }
  }, [
    timer,
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

    return requestAnimationFrame(loop);
  }, [loop, handleLoop, predict, setStartLoop]);

  const controller = useMemo(() => ({
    start,
    stop: setStopLoop,
    ready: predict && webcam.ready,
    looping,
  }), [
    start,
    predict,
    looping,
    setStopLoop,
    webcam.ready,
    ]);

  return controller;
};
