import { useState, useEffect, useCallback } from "react";

const synth = window.speechSynthesis;

export const useSpeech = () => {
  const [voices, setVoices] = useState(null);
  const [voice, setVoice] = useState(null);

  useEffect(() => {
    if (!voices) {
      const allVoices = synth.getVoices();
      setVoices(allVoices);
      setVoice(allVoices[0]);
    }
  }, [voices]);

  const say = useCallback((text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    synth.speak(utterance);
  }, [voice]);

  const countdown = useCallback((from, { onEnd, onEach }={}) => {
    if (onEnd) setTimeout(onEnd, from * 1000);
    Array.from({ length: from })
      .forEach((_, idx) => {
        const num = from - idx;
        setTimeout(() => {
          say(num);
          if (onEach) onEach(num);
        }, idx * 1000);
      })
  }, [say]);

  return { say, countdown };
};
