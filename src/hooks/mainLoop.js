import { useRef, useState, useCallback, useMemo } from "react";

import { useSpeech } from "./speech";
import { useBodyPix } from "./bodyPix";
import { usePolygon } from "./polygon";
import { useWebcam } from "../context/webcam";
import { getScoreAndOverlay } from '../lib/util';

export const useMainLoop = () => {
  const { countdown } = useSpeech();
  const webcam = useWebcam();
  const predict = useBodyPix();
  const { polygonRef, next } = usePolygon();

  const loopRef = useRef();
  const initializedRef = useRef();
  const captureScoreRef = useRef();

  const [looping, setLooping] = useState(false);

  const [score, setScore] = useState(0);
  const [scores, setScores] = useState([]);
  
  const setStartLoop = useCallback(() => {
    loopRef.current = true;
    setLooping(true);
  }, []);
  
  const setStopLoop = useCallback(() => {
    loopRef.current = false;
    setLooping(false);
  }, []);

  const triggerNextCountdown = useCallback(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      countdown(5, {
        onEnd: () => {
          captureScoreRef.current = true;
        }
      });
    }
  }, [countdown]);

  const predictLoop = useCallback(async () => {
    const segmentation = await predict();
    triggerNextCountdown(); // call this after first segmentation to ensure we are ready to go

    // console.log({segmentation});
    
    const ctx = webcam.canvasRef.current.getContext('2d');
    
    const { score, overlay } = getScoreAndOverlay (polygonRef.current, segmentation, webcam.flipX);
    setScore(score);

    let finished = null;
    if (captureScoreRef.current) {
      setScores(state => [...state, score]);
      initializedRef.current = false;
      captureScoreRef.current = false;
      finished = !next();
    }

    ctx.putImageData(overlay, 0, 0);

    if (loopRef.current && !finished) {
      requestAnimationFrame(predictLoop);
    } else{
      setStopLoop();
      webcam.clearCanvas();
    }
  }, [
    next,
    webcam,
    predict,
    polygonRef,
    setStopLoop,
    triggerNextCountdown,
  ]);

  const start = useCallback(async () => {
    if (!predict) {
      throw new Error('Please wait for the BodyPix to load...');
    } else if (loopRef.current) {
      console.error('The app is already running.');
      return;
    }

    setStartLoop();

    return predictLoop();
  }, [predict, predictLoop, setStartLoop]);

  const stop = useCallback(() => {
    setStopLoop();
  }, [setStopLoop]);

  const controller = useMemo(() => ({
    start,
    stop,
    score,
    scores,
    ready: predict && webcam.videoStarted,
    looping,
    nextPolygon: next,
  }), [start, stop, predict, looping, webcam, next, score, scores]);

  return controller;
};
