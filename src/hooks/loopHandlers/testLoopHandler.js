import { useRef } from "react";
import { useCallback } from "react";

import { useSpeech } from "../speech";
import { getSegmentationOverlay } from "../../lib/util";

export const useTestLoopHandler = () => {
  const promRef = useRef();
  const captureRef = useRef();
  const speech = useSpeech();
  const lastSpeechRef = useRef();

  const handleLoop = useCallback(async ({ predict, webcam, time, stop }) => {
    const { ctx } = webcam;
    ctx.font = '40px Arial';
    ctx.fillStyle = 'white';
    ctx.clearRect(0, 0, 50, 50);
    const countdown = (
      time.timer < 1000
        ? 3
        : time.timer < 2000
          ? 2
          : time.timer < 3000
            ? 1
            : 0
    );

    if (countdown) {
      ctx.fillText(countdown, 10, 40);
      if (lastSpeechRef.current !== countdown) {
        lastSpeechRef.current = countdown;
        speech.say(`${countdown}`);
      }
    }
    
    if (time.timer > 3000 && !captureRef.current) {
      captureRef.current = true;
      promRef.current = predict(webcam.videoRef.current)
        .then(async segmentation => {
          const overlay = getSegmentationOverlay(segmentation, webcam.flipX);
          webcam.clearCanvas();
          ctx.putImageData(overlay, 0, 0);
        });
    } else if (time.timer > 4000) {
      time.resetTimer();
      captureRef.current = false;
    }

    return () => promRef.current.then(webcam.clearCanvas);
  }, [speech]);

  return handleLoop;
}
