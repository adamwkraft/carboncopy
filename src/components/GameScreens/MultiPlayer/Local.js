import React from 'react';
import classnames from 'classnames';
import Button from '@material-ui/core/Button';
import ProgressBar from '../../ProgressBar';
import { makeStyles, Typography } from '@material-ui/core';

import { useGame, useGameMode } from '../../Game';

import { useLocal } from '../../../hooks/screenHooks/local';
import { useWebcam } from '../../../context/webcam';
import BasicFooter from '../SinglePlayer/BasicFooter';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    '& h2': {
      marginBottom: theme.spacing(1),
    },
  },
  scrollContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: -17,
    overflowY: 'scroll',
    padding: theme.spacing(1),
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  overlay: {
    background: 'rgba(255,255,255,0.5)',
  },
  rootTop: {
    justifyContent: 'flex-start',
  },
  rootApart: {
    justifyContent: 'space-between',
  },
  optionsTop: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(10),
  },
  captures: {
    width: '100%',
    '& > div': {
      marginTop: theme.spacing(1),
    },
  },
  progress: {
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(8),
    right: theme.spacing(8),
  },
  container: {
    textAlign: 'center',
  },
}));

const text = [
  'Player One, get ready to capture your masks.',
  'Player Two, get ready to capture your masks.',
  'Player One, get ready to play!',
  'Player Two, get ready to play!',
];

const subtext = [
  'Player Two, please leave the room.',
  'Player One, please leave the room.',
  'Good luck!',
  'Good luck!',
];

const buttonText = [
  "Capture Player One's Masks",
  "Capture Player Two's Masks",
  'Player One Play',
  'Player Two Play',
];

const Local = (props) => {
  const classes = useStyles();
  const game = useGame();
  const local = useGameMode(useLocal);
  const webcam = useWebcam();

  return (
    <div className={classes.root}>
      <div
        className={classnames(classes.scrollContainer, {
          [classes.overlay]: !game.loop.looping,
          [classes.rootTop]: false,
          [classes.rootApart]: !!false,
        })}
      >
        <div
          className={classnames(classes.container, {
            [classes.optionsTop]: !!game.loop.looping,
          })}
        >
          {!game.loop.looping ? (
            <>
              <Typography component="h2" variant="h5">
                {text[local.setupProgress]}
              </Typography>
              <Typography component="h2" variant="h6">
                {subtext[local.setupProgress]}
              </Typography>
              <Button
                color="primary"
                variant="contained"
                disabled={!game.loop.ready}
                onClick={local.handleClick}
              >
                {buttonText[local.setupProgress] || 'Play Again'}
              </Button>
            </>
          ) : (
            <div className={classes.progress}>
              <ProgressBar
                color={local.lapTimeInfo.color}
                completed={local.lapTimeInfo.percentRemaining}
              />
            </div>
          )}
        </div>
        {/* {webcam.isFullScreen && !game.loop.looping && <BasicFooter />} */}
      </div>
    </div>
  );
};

Local.propTypes = {};

export default Local;
