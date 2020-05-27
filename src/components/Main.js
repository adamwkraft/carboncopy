import React from 'react'
import { useWebcam } from '../context/webcam';

const Main = (props) => {
  window.webcam = useWebcam();


  return (
    <div>
      hey {props.name}
    </div>
  );
};

export default Main;
