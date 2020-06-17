import { useRef, useState, useCallback, useMemo } from "react";

import { useSpeech } from "./speech";
import { useBodyPix } from "./bodyPix";
import { usePolygon } from "./polygon";
import { useWebcam } from "../context/webcam";
import { getScoreAndOverlay, getScoreAndOverlayForSegmentation, getSegmentationOverlay, getBinaryOverlay, getScoreAndOverlayForSegmentationAndImageData} from '../lib/util';

export const useMainLoop = () => {
  const { countdown } = useSpeech();
  const webcam = useWebcam();
  const predict = useBodyPix();
  const { polygonRef, next, setPolygons } = usePolygon();

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
      countdown(3, {
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
    
    const { score, overlay } = getScoreAndOverlayForSegmentation(polygonRef.current, segmentation, webcam.flipX);
    // const { score, overlay } = getScoreAndOverlay(polygonRef.current, segmentation, webcam.flipX);
    setScore(score);

    let finished = null;
    if (captureScoreRef.current) {
      setScores(state => [...state, score]);
      initializedRef.current = false;
      captureScoreRef.current = false;
      const polygon = next();
      console.log('poly', polygon);
      finished = !polygon;
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

  const predictOnCaptureScoreLoop = useCallback(async () => {
    triggerNextCountdown(); // call this after first segmentation to ensure we are ready to go
    
    const ctx = webcam.canvasRef.current.getContext('2d');
    console.log("SEGMENTATION, polygonRef.current", polygonRef.current) 
    const overlay = getSegmentationOverlay(polygonRef.current, webcam.flipX);

    let finished = null;
    if (captureScoreRef.current) {
      const segmentation = await predict();
      const { score } = getScoreAndOverlayForSegmentation(polygonRef.current, segmentation, webcam.flipX);
      setScores(state => [...state, score]);
      initializedRef.current = false;
      captureScoreRef.current = false;
      const polygon = next();
      console.log('poly', polygon);
      finished = !polygon;
    }

    ctx.putImageData(overlay, 0, 0);

    if (loopRef.current && !finished) {
      requestAnimationFrame(predictOnCaptureScoreLoop);
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

  const captureSegmentations = useCallback(async () => {
    triggerNextCountdown();
    
    let finished = null;
    if (captureScoreRef.current) {
      console.log('capturing!')
      const segmentation = await predict();
      setPolygons(state => {
        if (state.length + 1 === 3) finished = true;
        if (!state.length) polygonRef.current = segmentation; // set to the first segmentation

        return [...state, segmentation];
      });
      initializedRef.current = false;
      captureScoreRef.current = false;
    }

    if (loopRef.current && !finished) {
      requestAnimationFrame(captureSegmentations);
    } else{
      console.log('stopping loop')
      setStopLoop();
    }
  }, [
    predict,
    polygonRef,
    setStopLoop,
    setPolygons,
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

  //   return predictLoop();
  // }, [predict, predictLoop, setStartLoop]);
     return predictOnCaptureScoreLoop();
  }, [predict, predictOnCaptureScoreLoop, setStartLoop]);

  const startCaptureSegmentations = useCallback(async () => {
    if (!predict) {
      throw new Error('Please wait for the BodyPix to load...');
    } else if (loopRef.current) {
      console.error('The app is already running.');
      return;
    }

    setStartLoop();

    return captureSegmentations();
  }, [predict, captureSegmentations, setStartLoop]);

  const stop = useCallback(() => {
    setStopLoop();
  }, [setStopLoop]);

  const captureSegmentationAsDataURI = useCallback(async () => {
    const segmentation = await predict();
    
    const ctx = webcam.canvasRef.current.getContext('2d');
    const overlay = getBinaryOverlay(segmentation, webcam.flipX);

    ctx.putImageData(overlay, 0, 0);
    const dataUri = webcam.canvasRef.current.toDataURL("image/png");
    webcam.clearCanvas();

    console.log(dataUri);

    return dataUri;
  }, [predict, webcam]);

  const dataUriToImageData = useCallback(async (dataUri) => {
    const ctx = webcam.canvasRef.current.getContext('2d');

    const img = new Image();
    img.src = dataUri;
    await new Promise((resolve) => {
      img.onload = () => {
        ctx.drawImage(img,0,0);
        resolve();
      };
    });

    const imageData = ctx.getImageData(0, 0, webcam.canvasRef.current.width, webcam.canvasRef.current.height);
    webcam.clearCanvas();

    console.log(imageData);

    return imageData;
  }, [webcam]);

  // debug - pass in a URI, call a prediction to get a segmentation,
  // and calculate result.
  const getImageDataFromURIAndPredict = useCallback(async () => {
    const myDataUri = await captureSegmentationAsDataURI();
    const myImageData = await dataUriToImageData(myDataUri);
    const segmentation = await predict();

    const { score, overlay } = getScoreAndOverlayForSegmentationAndImageData(myImageData, segmentation, webcam.flipX);
    console.log("ADAM SCORE!", score);

    const ctx = webcam.canvasRef.current.getContext('2d');
    ctx.putImageData(overlay, 0, 0);

  }, [predict,
    captureSegmentationAsDataURI,
    dataUriToImageData,
     webcam]);

  window.cool_fn = getImageDataFromURIAndPredict;
  window.webcam = webcam;

  const controller = useMemo(() => ({
    start,
    stop,
    score,
    scores,
    ready: predict && webcam.videoStarted,
    looping,
    captureSegmentationAsDataURI,
    nextPolygon: next,
    startCaptureSegmentations,
  }), [
    start,
    stop,
    predict,
    looping,
    webcam,
    next,
    score,
    scores,
    captureSegmentationAsDataURI,
    startCaptureSegmentations,
    ]);

  return controller;
};
