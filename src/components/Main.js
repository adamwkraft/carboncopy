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
    
    const segmentation = await net.segmentPerson(webcam.canvasRef.current);
    console.log(segmentation);
  };

  window.p = makePrediction

  return (
    <div>
      <WebcamSelect />
      <Webcam width={1280} />
    </div>
  );
};

export default Main;
