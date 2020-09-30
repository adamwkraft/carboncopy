import React from 'react';
import classnames from 'classnames';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';

import ProgressBar from '../../ProgressBar';
import ScoreResults from '../../ScoreResults';
import { useGameMode } from '../../Game';
import { useSurvival } from '../../../hooks/screenHooks/survival';
import { useWebcam } from '../../../context/webcam';

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

const Survival = (props) => {
  const classes = useStyles();
  const survival = useGameMode(useSurvival);
  const webcam = useWebcam();
  const { loop, lapTimeInfo, simpleGame, captureMasks, handleClickGame, resultsText } = survival;

  return (
    <div
      className={classnames(classes.root, {
        [classes.overlay]: !loop.looping,
        [classes.rootTop]: !!loop.looping,
        [classes.rootApart]:
          !!(simpleGame.scores?.length || captureMasks.masks?.length) && webcam.isFullScreen,
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
          <Button
            color="primary"
            variant="contained"
            onClick={handleClickGame}
            disabled={!loop.ready}
          >
            Play
          </Button>
        )}
      </div>
      {webcam.isFullScreen && !loop.looping && (
        <div className={classes.captures}>
          <ScoreResults
            label={resultsText}
            results={simpleGame.scores}
            handleClose={simpleGame.clearScores}
          />
        </div>
      )}
    </div>
  );
};

export default Survival;
