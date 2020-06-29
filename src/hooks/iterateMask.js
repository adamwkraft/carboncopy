import { useRef, useState, useCallback } from "react";
import { useMemo } from "react";

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

  return useMemo(() => ({
    next,
    reset,
    maskRef,
    setMasks,
    numMasks: masks.length,
  }), [
    next,
    reset,
    masks,
  ]);
};
