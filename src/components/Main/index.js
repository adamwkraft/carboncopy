import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

import { useWebcam } from '../../context/webcam';

import Game from '../Game';
import NoWebcam from './NoWebcam';
import ChooseWebcam from './ChooseWebcam';
import WebcamIsLoading from './WebcamIsLoading';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 1600,
    margin: '0 auto',
  },
}));

const Main = (props) => {
  const webcam = useWebcam();
  const { currentDeviceId, hasVideo, cameras, autoStartDeviceId } = webcam;

  const startedRef = useRef();

  useEffect(() => {
    if (
      hasVideo &&
      cameras.length &&
      (currentDeviceId || autoStartDeviceId) &&
      !startedRef.current
    ) {
      startedRef.current = true;

      console.log('starting');
      webcam.start().catch(console.error);
    }
  }, [hasVideo, cameras, currentDeviceId, autoStartDeviceId]); // eslint-disable-line

  const classes = useStyles();

  // TODO: this is problematic. We need to put the video element on screen in order to prompt the user for permission to use the camera, otherwise we never progress past the WebcamIsLoading screen
  return (
    <main className={classes.root}>
      {!hasVideo ? (
        <NoWebcam />
      ) : !cameras.length || currentDeviceId === undefined ? (
        <WebcamIsLoading />
      ) : !currentDeviceId ? (
        <ChooseWebcam />
      ) : (
        <Game webcam={webcam} />
      )}
    </main>
  );
};

Main.propTypes = {
  cvReady: PropTypes.bool.isRequired,
};

export default Main;
