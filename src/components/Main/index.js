import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import React, { useRef, useEffect, memo } from 'react';

import { useWebcam } from '../../context/webcam';

import Game from '../Game';
import NoWebcam from './NoWebcam';

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

  // console.log(
  //   !hasVideo
  //     ? 'no webcam'
  //     : !cameras.length || currentDeviceId === undefined
  //     ? 'webcams is loading'
  //     : !currentDeviceId
  //     ? 'no webcam chosen'
  //     : 'rendering game',
  // );

  return (
    <main className={classes.root}>{!hasVideo ? <NoWebcam /> : <Game webcam={webcam} />}</main>
  );
};

Main.propTypes = {
  cvReady: PropTypes.bool.isRequired,
};

export default memo(Main);
