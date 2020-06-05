import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import * as bodyPix from '@tensorflow-models/body-pix';

import { useWebcam } from "../context/webcam";
import { drawResultFlipped, flipPolygon} from '../lib/util';

export const useBodyPix = () => {
  const webcam = useWebcam();

  const loadRef = useRef();
  const loopRef = useRef();
  const [net, setNet] = useState(null);
  const [running, setRunning] = useState(false);
  
  const startRunning = useCallback(() => {
    loopRef.current = true;
    setRunning(true);
  }, []);
  
  const stopRunning = useCallback(() => {
    loopRef.current = false;
    setRunning(false);
  }, []);

  // load the model on the first mount
  useEffect(() => {
    if (!loadRef.current) {
      loadRef.current = true;
      bodyPix.load()
        .then(setNet)
        .catch(console.error);
    }
  }, []);

  const predictLoop = useCallback(async () => {
    const segmentation = await net.segmentPerson(webcam.videoRef.current);

    // console.log({segmentation});

    const width = webcam?.canvasRef?.current?.width;
    const height = webcam?.canvasRef?.current?.height;

    const template = [
      [0.25*width, .25*height],
      [0.75*width, .25*height],
      [0.75*width, .5*height],
      [0.5*width, .5*height],
      [0.5*width, height],
      [0.25*width, height],
    ];

    const flippedTemplate = flipPolygon(template, webcam?.canvasRef?.current?.width);
    
    const ctx = webcam.canvasRef.current.getContext('2d');

    const image = drawResultFlipped(flippedTemplate, segmentation);

    ctx.putImageData(image, 0, 0);

    if (loopRef.current) {
      requestAnimationFrame(predictLoop);
    } else{
      webcam.clearCanvas();
    }
  }, [net, webcam]);

  const start = useCallback(async () => {
    if (!net) {
      throw new Error('Please wait for the model to load...');
    } else if (loopRef.current) {
      console.error('BodyPix is already running.');
      return;
    }

    startRunning();

    return predictLoop();
  }, [net, predictLoop, startRunning]);

  const stop = useCallback(() => {
    stopRunning();
  }, [stopRunning]);

  const controller = useMemo(() => ({
    start,
    stop,
    ready: net && webcam.videoStarted,
    running,
  }), [start, stop, net, running, webcam]);

  return controller;
};
