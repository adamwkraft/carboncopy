import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Webcam from './Webcam';
import WebcamSelect from './WebcamSelect';

import { useMainLoop } from '../hooks/mainLoop';

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
  score: {

  }
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
        {
          loop.looping && (
            <Button
              color="primary"
              variant="outlined"
              onClick={loop.nextPolygon}
            >
              Next
            </Button>
          )
        }
        <Button
          color={ loop.looping ? 'secondary' : 'primary' }
          variant='contained'
          disabled={!loop.ready}
          onClick={handleClickStartStop}
        >
          { loop.looping ? 'Stop' : 'Start' }
        </Button>
        <Button
          color='primary'
          variant='contained'
          disabled={!loop.ready}
          onClick={loop.startCaptureSegmentations}
        >
          Capture Segmentations
        </Button>
        <Button
          color='primary'
          variant='contained'
          disabled={!loop.ready}
          onClick={loop.captureSegmentationAsDataURI}
        >
          Capture and Save Segmentation
        </Button>
      </div>
      <Webcam />
      { loop.looping && (
        <Typography variant="h4">
          Polygon Score: {loop.score}
        </Typography>
      )}
      <Typography variant="h4">
        Scores: {loop.scores.join(', ')} = {loop.scores.reduce((a,b) => a+b,0)}
      </Typography>
    </div>
  );
};

export default Main;
