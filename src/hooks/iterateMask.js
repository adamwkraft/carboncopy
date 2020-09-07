import { useMemo, useRef, useState, useCallback } from 'react';

// set masks, iterate masks, retain ref to current mask
export const useIterateMask = () => {
  const masksRef = useRef([]);
  const maskRef = useRef(null);
  const maskIdxRef = useRef(0);
  const [masks, _setMasks] = useState([]);

  const setMasks = useCallback((newMasks) => {
    _setMasks(newMasks);
    masksRef.current = typeof newMasks === 'function' ? newMasks(masksRef.current) : newMasks;
  }, []);

  const reset = useCallback(() => {
    maskIdxRef.current = 0;
    maskRef.current = null;
  }, []);

  const next = useCallback(() => {
    const currentMask = masksRef.current[maskIdxRef.current];

    if (!currentMask) {
      maskRef.current = null;
      maskIdxRef.current = 0;

      return null;
    }

    maskRef.current = currentMask;
    maskIdxRef.current++;

    return currentMask;
  }, []);

  const getNumMasks = useCallback(() => masksRef.current.length, []);

  return useMemo(
    () => ({
      next,
      reset,
      maskRef,
      setMasks,
      getNumMasks,
      hasMasks: !!masks.length,
    }),
    [next, masks, reset, setMasks, getNumMasks],
  );
};
