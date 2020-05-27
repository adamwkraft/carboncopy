import React from 'react'
import { useWebcam } from '../context/webcam';
import Webcam from './Webcam';
import WebcamSelect from './WebcamSelect';
import * as bodyPix from '@tensorflow-models/body-pix';

const Main = (props) => {
  const webcam = useWebcam();
  window.webcam = webcam; // TODO: remove

  const makePrediction = async () => {
    const net = await bodyPix.load();
    
    const segmentation = await net.segmentPerson(webcam.videoRef.current);
    const coloredPartImage = bodyPix.toMask(segmentation);
    const opacity = 0.7;
    const flipHorizontal = false;
    const maskBlurAmount = 0;

    bodyPix.drawMask(
     webcam.canvasRef.current, webcam.videoRef.current, coloredPartImage, opacity, maskBlurAmount,
      flipHorizontal);
    console.log(segmentation);
  };

  window.p = makePrediction

  return (
    <div>
      <WebcamSelect />
      <Webcam width={1280} withCanvas={true} />
    </div>
  );
};

export default Main;
