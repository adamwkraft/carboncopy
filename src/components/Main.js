import { makeStyles, Typography } from '@material-ui/core';
import React, { useState, useCallback } from 'react';

import Button from '@material-ui/core/Button';

import Webcam from './Webcam';
import FileUpload from './FileUpload';
import WebcamSelect from './WebcamSelect';
import CapturedMasks from './CapturedMasks';

import { useLoop } from '../hooks/loop';
import { useSimpleGame } from '../hooks/loopHandlers/simpleGame';
import { useCaptureMasks } from '../hooks/loopHandlers/captureMasks';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: theme.spacing(1),
  },
  options: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
}));

const clickStates = {
  capture: 'capture',
  simpleGame: 'simpleGame',
};

const Main = (props) => {
  const classes = useStyles();
  
  const loop = useLoop();
  const simpleGame = useSimpleGame();
  const captureMasks = useCaptureMasks();
  const [lastClick, setLastClick] = useState(null);
  
  const handleClickGame = useCallback(async () => {
    if (loop.looping) {
      loop.stop();
      setLastClick(null);
    } else {
      setLastClick(clickStates.simpleGame);
      loop.start(simpleGame.handleLoop);
    }
  }, [loop, simpleGame]);

  const handleClickCapture = useCallback(() => {
    if (loop.looping) {
      loop.stop();
      setLastClick(null);
    } else {
      setLastClick(clickStates.capture);
      loop.start(captureMasks.handleLoop);
    }
  }, [loop, captureMasks]);

  return (
    <div className={classes.root}>
      <div className={classes.options}>
        <Button
          variant='outlined'
          onClick={handleClickCapture}
          disabled={!loop.ready || (loop.looping && lastClick !== clickStates.capture)}
        >
          {(loop.looping && lastClick === clickStates.capture) ? 'Stop' : 'Capture Masks'}
        </Button>
        <FileUpload
          variant='outlined'
          onChange={simpleGame.handleLoadMasks}
          disabled={!loop.ready || loop.looping || simpleGame.loading}
        >
          {simpleGame.loading ? 'Loading...' : 'Load Masks'}
        </FileUpload>
        <Button
          color="primary"
          variant='outlined'
          onClick={handleClickGame}
          disabled={!(loop.ready && simpleGame.ready) || (loop.looping && lastClick !== clickStates.simpleGame)}
        >
          { (loop.looping && lastClick === clickStates.simpleGame) ? 'Stop' : 'Play' }
        </Button>
        <WebcamSelect />
      </div>
      <Webcam />
      <CapturedMasks captureMasks={captureMasks} />
      {!!simpleGame.scores.length && (
        <Typography>Scores: {simpleGame.scores.join()}</Typography>
      )}
    </div>
  );
};

export default Main;
