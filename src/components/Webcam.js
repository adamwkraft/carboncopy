import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

import { useWebcam } from '../context/webcam';

const useStyles = makeStyles((theme) => ({
  root: (props) => ({
    position: 'relative',
  }),
  video: (props) => ({
    width: '100%',
    height: '100%',
    ...(props.flipX
      ? {
          'p-webkit-transform': 'scaleX(- 1)',
          transform: 'scaleX(-1)',
        }
      : {}),
  }),
  canvas: (props) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  }),
}));

const Webcam = (props) => {
  const webcam = useWebcam();
  const classes = useStyles({ ...props, ...webcam });

  return (
    <div className={classes.root}>
      <video
        autoPlay={true}
        ref={webcam.videoRef}
        className={classes.video}
        width={webcam.videoRef?.current?.videoWidth}
        height={webcam.videoRef?.current?.videoHeight}
      />
      <canvas
        ref={webcam.canvasRef}
        className={classes.canvas}
        width={webcam.videoRef?.current?.videoWidth}
        height={webcam.videoRef?.current?.videoHeight}
      />
    </div>
  );
};

Webcam.propTypes = {
  styles: PropTypes.object,
};

export default Webcam;
