import React from 'react';
import classnames from 'classnames';
import Button from '@material-ui/core/Button';
import ProgressBar from '../../ProgressBar';
import { makeStyles, Typography } from '@material-ui/core';

import { useGame, useGameMode } from '../../Game';

import { useLocal } from '../../../hooks/screenHooks/local';

const useStyles = makeStyles((theme) => ({
  root: {
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
  options: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
    '& > *': {
      marginTop: theme.spacing(2),
      minWidth: 150,
    },
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

  return (
    <div className={classes.root}>
      <div
        className={classnames(classes.scrollContainer, {
          [classes.overlay]: true,
          [classes.rootTop]: false,
          [classes.rootApart]: !!false,
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
              {buttonText[local.setupProgress]}
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
    </div>
  );
};

Local.propTypes = {};

export default Local;
