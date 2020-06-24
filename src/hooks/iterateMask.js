import { useRef, useState, useCallback } from "react";

// set masks, iterate masks, retain ref to current mask

export const useIterateMask = () => {
  const [masks, setMasks] = useState([]);
  
  const maskRef = useRef(null);
  const maskIdxRef = useRef(0);
  const reset = useCallback(() => {
    maskIdxRef.current = 0;
  }, []);

  const next = useCallback(() => {
    maskIdxRef.current++;
    const currentPoly = masks[maskIdxRef.current];

    if (!currentPoly) {
      maskRef.current = null;
      maskIdxRef.current = 0;

      return null;
    }

    maskRef.current = currentPoly;
    
    return currentPoly;
  }, [masks]);

  return { maskRef, next, setMasks, reset };
};
