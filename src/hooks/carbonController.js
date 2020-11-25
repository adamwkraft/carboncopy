import { useState, useCallback, useRef, useEffect } from 'react';
import { useAudio } from '../context/audio';

export const useCarbonController = () => {
  const {
    handlers: {
      speech: { say },
    },
  } = useAudio();

  const carbonRef = useRef();
  const [carbonState, setCarbonState] = useState(false);

  useEffect(() => {
    if (carbonState && !carbonRef.current) {
      carbonRef.current = true;
    } else if (!carbonState && carbonRef.current) {
      carbonRef.current = false;
    }
  }, [carbonState]);

  const toggle = useCallback(() => {
    setCarbonState((state) => {
      if (!state) {
        say('Carbon Activated!');
      }
      return !state;
    });
  }, [say]);

  window.__carbonate__ = toggle;

  return { carbonState, carbonRef };
};
