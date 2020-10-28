import React from 'react';
import classnames from 'classnames';
import Button from '@material-ui/core/Button';
import ProgressBar from '../../ProgressBar';
import { makeStyles, Paper, Typography } from '@material-ui/core';

import { useGame, useGameMode } from '../../Game';

import { useLocal } from '../../../hooks/screenHooks/local';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    '& h2': {
      marginBottom: theme.spacing(4),
    },
    '& h3': {
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
  paper: {
    padding: theme.spacing(1),
    paddingRight: theme.spacing(5),
    paddingLeft: theme.spacing(5),
    background: 'rgba(255,255,255,0.95)',
    marginBottom: theme.spacing(2),
  },
}));

const text = [
  'Player One, get ready to capture your poses.',
  'Player Two, get ready to capture your poses.',
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
  "Capture Player One's Poses",
  "Capture Player Two's Poses",
  'Player One Play',
  'Player Two Play',
];

const Local = (props) => {
  const classes = useStyles();
  const game = useGame();
  const local = useGameMode(useLocal);

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
              {local.setupProgress < 4 && (
                <Paper className={classes.paper}>
                  <Typography component="h2" variant="h5">
                    Take turns capturing poses and attempting to match your opponents.
                  </Typography>
                  <Typography component="h3" variant="h5">
                    {text[local.setupProgress]}
                  </Typography>
                  <Typography component="h4" variant="h6">
                    {subtext[local.setupProgress]}
                  </Typography>
                </Paper>
              )}
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
