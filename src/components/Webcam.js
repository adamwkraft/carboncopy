import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';
import EnterFullScreen from '@material-ui/icons/Fullscreen';
import ExitFullScreen from '@material-ui/icons/FullscreenExit';

import { useWebcam } from '../context/webcam';

const useStyles = makeStyles((theme) => ({
  root: ({ isFullScreen: fs }) => ({
    margin: '0 auto',
    maxWidth: 1200,
    ...(fs
      ? {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }
      : {}),
  }),
  container: ({ isFullScreen: fs }) => ({
    width: '100%',
    position: 'relative',
    marginLeft: fs ? 0 : theme.spacing(2),
    marginRight: fs ? 0 : theme.spacing(2),
  }),
  video: ({ flipX, isFullScreen: fs }) => ({
    width: '100%',
    height: '100%',
    borderRadius: fs ? 0 : theme.spacing(1),
    ...(flipX
      ? {
          'p-webkit-transform': 'scaleX(- 1)',
          transform: 'scaleX(-1)',
        }
      : {}),
  }),
  canvas: {
    borderRadius: ({ isFullScreen: fs }) => (fs ? 0 : theme.spacing(1)),
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
  hidden: {
    display: 'none',
  },
  children: {
    borderRadius: ({ isFullScreen: fs }) => (fs ? 0 : theme.spacing(1)),
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    bottom: 5,
    zIndex: 1,
  },
  fullScreen: {
    position: 'absolute',
    bottom: theme.spacing(1),
    right: theme.spacing(1),
    color: 'white',
    zIndex: 2,
  },
}));

const Webcam = (props) => {
  const webcam = useWebcam();
  const classes = useStyles({ ...props, ...webcam });

  return (
    <div
      ref={webcam.rootRef}
      className={classnames(classes.root, {
        [classes.hidden]: webcam.hidden,
      })}
    >
      <div className={classes.container}>
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
        {props.children && <div className={classes.children}>{props.children}</div>}
        {webcam.hasFullScreen && (
          <IconButton className={classes.fullScreen} onClick={webcam.toggleFullScreen}>
            {webcam.isFullScreen ? <ExitFullScreen /> : <EnterFullScreen />}
          </IconButton>
        )}
      </div>
    </div>
  );
};

Webcam.propTypes = {
  styles: PropTypes.object,
};

export default Webcam;
