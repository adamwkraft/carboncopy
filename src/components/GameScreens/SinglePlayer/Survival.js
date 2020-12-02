import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core';

import ProgressBar from '../../ProgressBar';
import SurvivalFooter from './SurvivalFooter';
import { useGameMode } from '../../Game';
import { useSurvival } from '../../../hooks/screenHooks/survival';
import { useWebcam } from '../../../context/webcam';
import GameInfoBox from '../../GameInfoBox';

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
  progress: {
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(8),
    right: theme.spacing(8),
  },
}));

export const getSurvivalPaperProps = (_, ind, masks) =>
  ind === masks.length - 1
    ? {
        style: { background: 'rgba(255, 0, 0, 0.4)' },
      }
    : {};

const Survival = (props) => {
  const classes = useStyles();
  const survival = useGameMode(useSurvival);
  const webcam = useWebcam();
  const { loop, lapTimeInfo, handleClickGame } = survival;

  // TODO: add an animation for the screen content on page transition

  return (
    <div
      className={classnames(classes.root, {
        [classes.overlay]: !loop.looping,
      })}
    >
      <div
        className={classnames(classes.options, {
          [classes.optionsTop]: !!loop.looping,
        })}
      >
        {loop.looping ? (
          <div className={classes.progress}>
            <ProgressBar color={lapTimeInfo.color} completed={lapTimeInfo.percentRemaining} />
          </div>
        ) : (
          <GameInfoBox
            primaryText="Survival"
            secondaryText="Match the poses and survive as long as you can."
            middleContent={webcam.isFullScreen && <SurvivalFooter />}
            Icon="play"
            iconProps={{
              onClick: handleClickGame,
              loading: !loop.ready,
              color: 'secondary',
            }}
            helpContent={[
              'You will have a limited number of time to match each pose.',
              'Successfully match a pose by being within its lines when the timer runs out.',
              'If your score is high enough, you will move on to the next round.',
              'You will have less time each round.',
              'How long can you survive?',
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default Survival;
