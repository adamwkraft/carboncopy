import { useMemo, useRef, useState, useCallback } from 'react';
import { jitterMask } from '../lib/util';

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

  const shuffle = useCallback(() => {
    const array = masks.slice();
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    setMasks(array);
    masksRef.current = array;
  }, [masks, setMasks]);

  const resetAndShuffle = useCallback(() => {
    maskIdxRef.current = 0;
    maskRef.current = null;
    shuffle();
  }, [shuffle]);

  const next = useCallback((jitter = false) => {
    const currentMask = masksRef.current[maskIdxRef.current];

    if (!currentMask) {
      maskRef.current = null;
      maskIdxRef.current = 0;

      return null;
    }

    if (jitter) {
      const mask = jitterMask(currentMask);
      maskRef.current = mask;
      return mask;
    } else {
      maskRef.current = currentMask;
      maskIdxRef.current++;
      return currentMask;
    }
  }, []);

  const getNumMasks = useCallback(() => masksRef.current.length, []);

  const random = useCallback(() => {
    let orig_mask = masks[Math.floor(Math.random() * masks.length)];
    // Always jittering for random (used by survival)
    const mask = jitterMask(orig_mask);
    maskRef.current = mask;
    return mask;
  }, [masks]);

  return useMemo(
    () => ({
      next,
      reset,
      random,
      maskRef,
      setMasks,
      maskIdxRef,
      getNumMasks,
      resetAndShuffle,
      hasMasks: !!masks.length,
    }),
    [next, masks, random, reset, setMasks, resetAndShuffle, getNumMasks],
  );
};
