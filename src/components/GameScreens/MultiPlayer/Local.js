import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from '@material-ui/core/Button';
import { makeStyles, Typography } from '@material-ui/core';

import CapturedMasks from '../../CapturedMasks';
import ProgressBar from '../../ProgressBar';
import ScoreResults from '../../ScoreResults';
import { useGame, useGameMode } from '../../Game';
import { useSurvival } from '../../../hooks/screenHooks/survival';
import { scoreToColor } from '../../../lib/score';
import { useWebcam } from '../../../context/webcam';
import { useCaptureMasks } from '../../../hooks/loopHandlers/captureMasks';
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

const Survival = (props) => {
  const classes = useStyles();
  // const survival = useGameMode(useSurvival);
  const webcam = useWebcam();
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
        <Typography component="h2" variant="h5">
          sad
        </Typography>
        <Typography component="h2" variant="h6">
          sad
        </Typography>
        <Button color="primary" variant="contained" onClick={local.handleCapturePlayerOne}>
          sad
        </Button>
      </div>
    </div>
  );
};

Survival.propTypes = {
  game: PropTypes.object.isRequired,
  webcam: PropTypes.object.isRequired,
};

export default Survival;
