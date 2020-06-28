import { useCallback, useRef, useMemo } from "react";

export const useLoopTime = () => {
  const lastTimeRef = useRef();
  const startTimeRef = useRef();
  const totalFramesRef = useRef();
  const fpsSumRef = useRef();
  const lapTime = useRef();

  const reset = useCallback((timestamp=0) => {
    startTimeRef.current = timestamp;
    lastTimeRef.current = timestamp;
    fpsSumRef.current = 0;
    totalFramesRef.current = 0;
    lapTime.current = 0;
  }, []);

  const resetLapTime = useCallback(() => {
    lapTime.current = 0;
  }, []);
  
  const update = useCallback((timestamp) => {
    let first = false;
    if (!startTimeRef.current) {
      first = true;
      reset(timestamp);
    }

    const deltaTime = timestamp - lastTimeRef.current;
    lapTime.current += deltaTime;

    let fps = 0;
    let avgFps = 0;

    // start calculating after the first loop to avoid dividing by 0
    if (totalFramesRef.current++) {
      fps = 1000 / deltaTime;
      avgFps = fpsSumRef.current / totalFramesRef.current;
      fpsSumRef.current += fps;
    }
    
    const elapsed = timestamp - startTimeRef.current;
    lastTimeRef.current = timestamp;

    return {
      first,
      timestamp,
      fps,
      avgFps,
      elapsed,
      frames: totalFramesRef.current,
      lapTime: lapTime.current,
      resetLapTime,
    };
  }, [reset, resetLapTime]);

  const controller = useMemo(() => ({ update, reset }), [update, reset]);

  return controller;
};
