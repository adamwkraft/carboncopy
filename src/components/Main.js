import React from 'react'
import { useWebcam } from '../context/webcam';
import Webcam from './Webcam';
import WebcamSelect from './WebcamSelect';

const Main = (props) => {
  window.webcam = useWebcam();


  return (
    <div>
      <WebcamSelect />
      <Webcam width={1280} />
    </div>
  );
};

export default Main;
