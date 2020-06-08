import React, { useCallback } from 'react'
import Button from '@material-ui/core/Button';

import Webcam from './Webcam';
import WebcamSelect from './WebcamSelect';
import { useMainLoop } from '../hooks/mainLoop';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 1280,
    margin: '0 auto',
  },
  options: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
}));

const Main = (props) => {
  const loop = useMainLoop();
  const classes = useStyles();

  const handleClickStartStop = useCallback(async () => (loop.looping
    ? loop.stop()
    : loop.start()
  ), [loop]);

  return (
    <div className={classes.root}>
      <div className={classes.options}>
        <WebcamSelect />
        <Button
          color={ loop.looping ? 'secondary' : 'primary' }
          variant='contained'
          disabled={!loop.ready}
          onClick={handleClickStartStop}
        >
          { loop.looping ? 'Stop' : 'Start' }
        </Button>
      </div>
      <Webcam />
    </div>
  );
};

export default Main;
