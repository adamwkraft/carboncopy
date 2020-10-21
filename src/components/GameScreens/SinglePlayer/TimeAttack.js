import React from 'react';
import classnames from 'classnames';
import { Button, makeStyles, Typography } from '@material-ui/core';

import BasicFooter from './BasicFooter';

import { useGame, useGameMode } from '../../Game';
import { useWebcam } from '../../../context/webcam';
import { useTimeAttack } from '../../../hooks/screenHooks/timeAttack';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
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
  slap: {
    background: 'rgba(255,255,255,0.95)',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(0.5),
  },
  screen: {
    textAlign: 'center',
    '& > button': {
      marginTop: theme.spacing(2),
      minWidth: 150,
    },
  },
}));

const TimeAttack = (props) => {
  const classes = useStyles();

  const game = useGame();
  const webcam = useWebcam();
  const timeAttack = useGameMode(useTimeAttack);

  const { simpleGame, handleClickGame } = timeAttack;

  const { loop } = game;
  // TODO: add an animation for the screen content on page transition
  return (
    <div className={classes.root}>
      <div
        className={classnames(classes.scrollContainer, {
          [classes.overlay]: !loop.looping,
          [classes.rootTop]: !!loop.looping,
          [classes.rootApart]: !!simpleGame.scores?.length && webcam.isFullScreen,
        })}
      >
        <div
          className={classnames(classes.screen, {
            [classes.optionsTop]: !!loop.looping,
          })}
        >
          {!loop.looping && (
            <Typography variant="h6" component="h3" className={classes.slap}>
              Match the poses as quickly as you can.
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickGame}
            disabled={!loop.ready}
          >
            {loop.looping ? 'Stop' : 'Play'}
          </Button>
        </div>
        {webcam.isFullScreen && <BasicFooter />}
      </div>
    </div>
  );
};

export default TimeAttack;
