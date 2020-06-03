import React, { useRef } from 'react'
import { useWebcam } from '../context/webcam';
import Webcam from './Webcam';
import WebcamSelect from './WebcamSelect';
import * as bodyPix from '@tensorflow-models/body-pix';
import { Button } from '@material-ui/core';

const Main = (props) => {
  const webcam = useWebcam();
  const net = useRef();
  const running = useRef();

  const makePrediction = async () => {
    const segmentation = await net.current.segmentPerson(webcam.videoRef.current);
    const coloredPartImage = bodyPix.toMask(segmentation);
    const opacity = 0.7;
    const maskBlurAmount = 0;

    bodyPix.drawMask(
     webcam.canvasRef.current, webcam.videoRef.current, coloredPartImage, opacity, maskBlurAmount,
      webcam.flipX);

    if (running.current) {
      requestAnimationFrame(makePrediction);
    } else{
      // Clear canvas.
      webcam.clearCanvas();
    }
  };

  window.p = makePrediction

  const handleClickStartAButtonPressFun = async () => {
    if (!net.current) {
      net.current = await bodyPix.load();
    }
    running.current = true;
    makePrediction();
  }

  const handleClickStopAButtonPressFun = async () => {
    running.current = false;
  }

  return (
    <div>
      <div>
        <WebcamSelect />
        <Button variant='contained' onClick={handleClickStartAButtonPressFun}>Start</Button>
        <Button variant='contained' onClick={handleClickStopAButtonPressFun}>Stop</Button>
      </div>
      <Webcam width={1280} withCanvas={true} />
      <canvas
          width={500}
          height={500}
        />
    </div>
  );
};

export default Main;
