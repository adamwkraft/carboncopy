import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import React, { useRef, useEffect, memo, createContext, useContext, useState } from 'react';

import { useWebcam } from '../../context/webcam';

import Game from '../Game';
import NoWebcam from './NoWebcam';
import { maxWidth } from '../../lib/constants';
import PeerJSProvider from '../../context/peer';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth,
    margin: `0 auto ${theme.spacing(2)}px`,
  },
}));

const multiplayerScoreContext = createContext();

export const useMultiplayerScores = () => {
  const state = useContext(multiplayerScoreContext);

  if (!state) {
    throw new Error('useMultiplayerScoreContext must be called from inside the <Game> component.');
  }

  return state;
};

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

      webcam.start().catch(console.error);
    }
  }, [hasVideo, cameras, currentDeviceId, autoStartDeviceId, webcam]);

  const classes = useStyles();

  const multiplayerScores = useState([[], []]);

  return (
    <main className={classes.root}>{
      !hasVideo
        ? <NoWebcam />
        : (
          <multiplayerScoreContext.Provider value={multiplayerScores}>
            <PeerJSProvider>
              <Game webcam={webcam} />
            </PeerJSProvider>
          </multiplayerScoreContext.Provider>
        )
      }</main>
  );
};

Main.propTypes = {
  cvReady: PropTypes.bool.isRequired,
};

export default memo(Main);
