import { useRef, useState, useCallback, useMemo } from 'react';

import { useLoopTime } from './loopTime';
import { useLapTimer } from './lapTimer';
import { useWebcam } from '../context/webcam';
import { useBodyPix } from '../context/bodyPix';

export const useLoop = (handleLoop) => {
  const webcam = useWebcam();
  const predict = useBodyPix();

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
      const cleanup = await handleLoopRef.current({
        time,
        webcam,
        predict,
        useTimer: lapTimer.useTimer,
        stop: setStopLoop,
      });

      lapTimer.handleLap({
        time,
        webcam,
        predict,
        stop: setStopLoop,
      });

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
      if (loopingRef.current) {
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
    [loop, predict, setStartLoop],
  );

  const controller = useMemo(
    () => ({
      start,
      looping,
      stop: setStopLoop,
      ready: predict && webcam.ready,
    }),
    [start, predict, looping, setStopLoop, webcam.ready],
  );

  return controller;
};
