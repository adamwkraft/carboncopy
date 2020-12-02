import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core';

import BasicFooter from './BasicFooter';

import { useGame, useGameMode } from '../../Game';
import { useWebcam } from '../../../context/webcam';
import { useTimeAttack } from '../../../hooks/screenHooks/timeAttack';
import GameInfoBox from '../../GameInfoBox';

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
  optionsTop: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(10),
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
        })}
      >
        <div
          className={classnames(classes.screen, {
            [classes.optionsTop]: !!loop.looping,
          })}
        >
          {!loop.looping && (
            <GameInfoBox
              primaryText="Time Attack"
              secondaryText={
                simpleGame.scores?.length ? 'Play Again?' : 'Match the poses as quickly as you can.'
              }
              Icon={simpleGame.scores?.length ? 'replay' : 'play'}
              iconProps={{
                color: 'secondary',
                loading: !loop.ready,
                onClick: handleClickGame,
              }}
              middleContent={webcam.isFullScreen && <BasicFooter hideClose={true} />}
              helpContent={[
                'Match each pose as quickly as possible',
                'Your score is based on your total time, and the average time per pose.',
                'Hop to it!',
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeAttack;
