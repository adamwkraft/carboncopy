import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import IconButton from '@material-ui/core/IconButton';

import Webcam from './Webcam';
import WebcamSelect from './WebcamSelect';

import { useLoop } from '../hooks/loop';
import { useCaptureMasks } from '../hooks/loopHandlers/captureMasks';
// import { useSimpleGame } from '../hooks/loopHandlers/simpleGame';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: theme.spacing(1),
  },
  options: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
  masks: {
    padding: theme.spacing(1),
  },
  masksList: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-around',
  },
  imgContainer: {
    width: 200,
    background: 'black',
    padding: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
    position: 'relative',
    '&:hover': {
      '& > div': {
        background: 'rgba(255,0,0,0.65)',
      }
    }
  },
  img: {
    width: '100%',
  },
  removeMask: {
    display: 'flex',
    transition: 'all 100ms',
    background: 'rgba(0,0,0,0)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      '& > button': {
        display: 'inherit',
      }
    }
  },
  iconBtn: {
    display: 'none',
    color: 'black',
    backgroundColor: 'rgba(255,255,255,0.5)',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.75)',
    },
    '&:active, &:focused': {
      backgroundColor: 'rgba(255,255,255,0.9)',
    },
  },
  masksHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  }
}));

const Main = (props) => {
  const classes = useStyles();
  
  const loop = useLoop();
  const captureMasks = useCaptureMasks();
  // const captureMasks = useSimpleGame();
  
  const handleClickStartStop = useCallback(async () => (loop.looping
    ? loop.stop()
    : loop.start(captureMasks.handleLoop)
  ), [loop, captureMasks.handleLoop]);

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
      {!!captureMasks.masks.length && (
        <Paper className={classes.masks}>
          <div className={classes.masksHeader}>
            <Typography variant="h6" component="h3">
              Candidate Masks
            </Typography>
            <div>
              <Button onClick={captureMasks.downloadMasks}>
                Download
              </Button>
              <Button onClick={captureMasks.removeAllMasks}>
                Clear All
              </Button>
            </div>
          </div>
          <ul className={classes.masksList}>
            {captureMasks.masks.map((dataUri, i) => (
              <li className={classes.imgContainer} key={dataUri}>
                <div className={classes.removeMask}>
                  <IconButton
                    name={i}
                    className={classes.iconBtn}
                    onClick={captureMasks.removeMask}
                  >
                    <DeleteForeverIcon fontSize="large" />
                  </IconButton>
                </div>
                <img src={dataUri} className={classes.img} alt={`mask #${i}`} />
              </li>
            ))}
          </ul>
        </Paper>
      )}
    </div>
  );
};

export default Main;
