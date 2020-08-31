import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { useSpeech } from './speech';

export const useAudioController = () => {
  const audioRef = useRef(true);
  const [audioState, setAudioState] = useState(true);

  const speech = useSpeech(audioRef);

  useEffect(() => {
    if (audioState && !audioRef.current) {
      audioRef.current = true;
    } else if (!audioState && audioRef.current) {
      audioRef.current = false;
    }
  }, [audioState]);

  const toggle = useCallback(() => {
    setAudioState((state) => !state);
  }, []);

  const audio = useMemo(
    () => ({
      state: audioState,
      stateRef: audioRef,
      handlers: { toggle, speech },
    }),
    [audioState, toggle, speech],
  );

  return audio;
};
