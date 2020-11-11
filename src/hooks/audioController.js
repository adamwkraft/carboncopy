import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { useSfx } from './sfx';
import { useSpeech } from './speech';

const LS_AUDIO = '__audio_muted__';

export const useAudioController = () => {
  const audioRef = useRef(true);
  const [audioState, setAudioState] = useState(true);

  const speech = useSpeech(audioRef);
  const sfx = useSfx(audioRef);

  useEffect(() => {
    const muteAudio = localStorage.getItem(LS_AUDIO);

    if (muteAudio) {
      setAudioState(false);
    }
  }, []);

  useEffect(() => {
    if (audioState && !audioRef.current) {
      audioRef.current = true;
      localStorage.removeItem(LS_AUDIO);
    } else if (!audioState && audioRef.current) {
      audioRef.current = false;
      localStorage.setItem(LS_AUDIO, 'true');
    }
  }, [audioState]);

  const toggle = useCallback(() => {
    setAudioState((state) => !state);
  }, []);

  const audio = useMemo(
    () => ({
      state: audioState,
      stateRef: audioRef,
      handlers: { toggle, speech, sfx },
    }),
    [audioState, toggle, speech, sfx],
  );

  return audio;
};
