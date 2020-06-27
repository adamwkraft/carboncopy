import { useCallback, useRef, useMemo } from "react";

export const useLoopTimer = () => {
  const lastTimeRef = useRef();
  const startTimeRef = useRef();
  const totalFramesRef = useRef();
  const fpsSumRef = useRef();
  const timerRef = useRef();

  const reset = useCallback((timestamp=0) => {
    startTimeRef.current = timestamp;
    lastTimeRef.current = timestamp;
    fpsSumRef.current = 0;
    totalFramesRef.current = 0;
    timerRef.current = 0;
  }, []);

  const resetTimer = useCallback(() => {
    timerRef.current = 0;
  }, []);
  
  const update = useCallback((timestamp) => {
    let first = false;
    if (!startTimeRef.current) {
      first = true;
      reset(timestamp);
    }

    const deltaTime = timestamp - lastTimeRef.current;
    timerRef.current += deltaTime;

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
      timer: timerRef.current,
      resetTimer,
    };
  }, [reset, resetTimer]);

  const controller = useMemo(() => ({ update, reset }), [update, reset]);

  return controller;
};
