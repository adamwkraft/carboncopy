import { useRef, useState, useCallback, useMemo } from 'react';

import { useLoopTime } from './loopTime';
import { useLapTimer } from './lapTimer';
import { useWebcam } from '../context/webcam';
import { useBodyPix } from '../context/bodyPix';

export const useLoop = () => {
  const webcam = useWebcam();
  const predict = useBodyPix();
  const loopReady = predict && webcam.ready;

  const loopTime = useLoopTime();
  const lapTimer = useLapTimer();

  const loopingRef = useRef();
  const handleLoopRef = useRef();
  const [looping, setLooping] = useState(false);

  // set the flags to start the loop
  const setStartLoop = useCallback(() => {
    // we clear the lapTimer here as opposed to after "stopping" the loop to avoid async errors
    lapTimer.clear();
    loopTime.reset();
    loopingRef.current = true;
    setLooping(true);
  }, [loopTime, lapTimer]);

  // clear loop flags to trigger end of loop
  // not synchronous, loop will terminate on next pass
  const setStopLoop = useCallback(() => {
    loopingRef.current = false;
    setLooping(false);
  }, []);

  // fn passed to requestAnimationFrame
  // keeps time and runs handleLoop fn passed to start
  const loop = useCallback(
    async (timestamp) => {
      const time = loopTime.update(timestamp);
      const controller = {
        time,
        webcam,
        predict,
        timerRef: lapTimer.timerRef,
        useTimer: lapTimer.useTimer,
        stop: setStopLoop,
      };

      const cleanup = await handleLoopRef.current(controller);

      lapTimer.handleLap(controller);

      if (loopingRef.current) {
        requestAnimationFrame(loop);
      } else {
        setStopLoop();
        handleLoopRef.current = null;
        webcam.clearCanvas();
        if (cleanup) cleanup();
      }
    },
    [webcam, predict, lapTimer, loopTime, setStopLoop],
  );

  const start = useCallback(
    async (handleLoop) => {
      if (!loopReady) {
        throw new Error('The loop is not ready');
      } else if (loopingRef.current) {
        throw new Error('The loop is already running');
      } else if (!predict) {
        throw new Error('Please wait for BodyPix to load...');
      } else if (!handleLoop) {
        throw new Error('A loop handler is required when calling loop.start');
      }

      handleLoopRef.current = handleLoop;
      setStartLoop();

      return requestAnimationFrame(loop);
    },
    [loop, predict, setStartLoop, loopReady],
  );

  const controller = useMemo(
    () => ({
      start,
      looping,
      ready: loopReady,
      stop: setStopLoop,
    }),
    [start, looping, setStopLoop, loopReady],
  );

  return controller;
};
