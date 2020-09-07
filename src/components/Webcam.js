import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';
import { useSpring, animated, config } from 'react-spring';
import EnterFullScreen from '@material-ui/icons/Fullscreen';
import ExitFullScreen from '@material-ui/icons/FullscreenExit';

import Loader from './Loader';
import { maxWidth } from '../lib/constants';
import { useWebcam } from '../context/webcam';

const useStyles = makeStyles((theme) => ({
  root: ({ isFullScreen: fs }) => ({
    maxWidth,
    margin: '0 auto',
    position: 'relative',
    height: `calc(0.5625 * (100vw - ${theme.spacing(4)}px))`,
    maxHeight: `calc(0.5625 * (1200px - ${theme.spacing(4)}px))`,
    ...(fs
      ? {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }
      : {}),
  }),
  container: ({ isFullScreen: fs }) => ({
    width: '100%',
    position: 'relative',
    paddingLeft: fs ? 0 : theme.spacing(2),
    paddingRight: fs ? 0 : theme.spacing(2),
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
  canvas: ({ isFullScreen: fs }) => ({
    borderRadius: fs ? 0 : theme.spacing(1),
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    paddingLeft: fs ? 0 : theme.spacing(2),
    paddingRight: fs ? 0 : theme.spacing(2),
  }),
  children: ({ isFullScreen: fs }) => ({
    borderRadius: fs ? 0 : theme.spacing(1),
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    bottom: 5,
    zIndex: 1,
    paddingLeft: fs ? 0 : theme.spacing(2),
    paddingRight: fs ? 0 : theme.spacing(2),
  }),
  fullScreen: {
    position: 'absolute',
    bottom: theme.spacing(1.5),
    right: ({ isFullScreen: fs }) => theme.spacing(fs ? 1.5 : 3),
    color: 'white',
    zIndex: 20,
    '&:hover': {
      background: 'rgba(255,255,255,0.25)',
    },
  },
  overlay: ({ overlayColor }) => ({
    background: overlayColor,
    position: 'absolute',
    top: 0,
    bottom: 5,
    left: theme.spacing(2),
    right: theme.spacing(2),
    borderRadius: theme.spacing(1),
    zIndex: 0,
  }),
  fsOverlay: {
    left: 0,
    right: 0,
    borderRadius: 0,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& > div': {
      width: 100,
      height: 100,
    },
  },
}));

const Webcam = ({ overlay, ...props }) => {
  const webcam = useWebcam();
  const overlayColor = typeof overlay !== 'string' ? 'rgba(255,255,255,0.5)' : overlay;
  const classes = useStyles({ ...props, ...webcam, overlayColor });

  const styleProps = useSpring({ to: { opacity: !webcam.hidden ? 1 : 0 }, config: config.stiff });

  return (
    <div ref={webcam.rootRef} className={classes.root}>
      <animated.div style={styleProps} className={classes.container}>
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
        {!webcam.hidden && overlay && (
          <div
            className={classnames(classes.overlay, {
              [classes.fsOverlay]: webcam.isFullScreen,
            })}
          />
        )}
        {props.children && !webcam.hidden && (
          <div className={classes.children}>{props.children}</div>
        )}
        {webcam.hasFullScreen && (
          <IconButton className={classes.fullScreen} onClick={webcam.toggleFullScreen}>
            {webcam.isFullScreen ? (
              <ExitFullScreen color="primary" />
            ) : (
              <EnterFullScreen color="primary" />
            )}
          </IconButton>
        )}
      </animated.div>
      {webcam.hidden && (
        <div className={classes.loader}>
          <div>
            <Loader color="#000" />
          </div>
        </div>
      )}
    </div>
  );
};

Webcam.propTypes = {
  styles: PropTypes.object,
};

export default Webcam;
