import classnames from 'classnames';
import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core';

import Options from '../../Options';
import ScoreResults from '../../ScoreResults';

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
}));

const TimeAttack = (props) => {
  const classes = useStyles();

  const game = useGame();
  const webcam = useWebcam();
  const timeAttack = useGameMode(useTimeAttack);

  const { simpleGame, handleClickGame } = timeAttack;

  const { loop } = game;

  const buttons = useMemo(
    () => [
      {
        props: {
          key: 'play/stop',
          onClick: handleClickGame,
          disabled: !loop.ready || (!loop.looping && !simpleGame.ready),
          children: loop.looping ? 'Stop' : 'Play',
        },
      },
    ],
    [loop.ready, loop.looping, handleClickGame, simpleGame.ready],
  );

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
          className={classnames({
            [classes.optionsTop]: !!loop.looping,
          })}
        >
          {loop.looping ? (
            <Options
              offset={70}
              buttons={[
                {
                  props: {
                    key: 'stop',
                    onClick: handleClickGame,
                    children: 'Stop',
                  },
                },
              ]}
            />
          ) : (
            <Options buttons={buttons} />
          )}
        </div>
        {webcam.isFullScreen && !loop.looping && (
          <div className={classes.captures}>
            <ScoreResults results={simpleGame.scores} handleClose={simpleGame.clearScores} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeAttack;
