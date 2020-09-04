import { useRef, useState, useCallback } from 'react';
import { useMemo } from 'react';

// set masks, iterate masks, retain ref to current mask
export const useIterateMask = () => {
  const [masks, setMasks] = useState([]);

  const maskRef = useRef(null);
  const maskIdxRef = useRef(0);

  const reset = useCallback(() => {
    maskIdxRef.current = 0;
    maskRef.current = null;
  }, []);

  const next = useCallback(() => {
    const currentPoly = masks[maskIdxRef.current];

    if (!currentPoly) {
      maskRef.current = null;
      maskIdxRef.current = 0;

      return null;
    }

    maskRef.current = currentPoly;
    maskIdxRef.current++;

    return currentPoly;
  }, [masks]);

  const random = useCallback(() => {
    const index = Math.floor(Math.random() * masks.length);
    console.log('ADAM, index:', index);
    const mask = masks[Math.floor(Math.random() * masks.length)];
    maskRef.current = mask;
    console.log('ADMA< MASK:', mask);
    return mask;
  }, [masks]);

  return useMemo(
    () => ({
      next,
      reset,
      random,
      maskRef,
      setMasks,
      numMasks: masks.length,
    }),
    [next, reset, random, masks],
  );
};
