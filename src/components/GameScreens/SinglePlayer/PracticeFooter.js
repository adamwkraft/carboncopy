import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core';

import CapturedMasks from '../../CapturedMasks';
import ScoreResults from '../../ScoreResults';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > div': {
      marginTop: theme.spacing(2),
    },
  },
}));

const PracticeFooter = (props) => {
  const classes = useStyles();

  if (!props.game.mode) return null;

  const { captureMasks, simpleGame, setCapturedMasks } = props.game.mode;

  return (
    <div className={classes.root}>
      <ScoreResults results={simpleGame.scores} handleClose={simpleGame.clearScores} />
      <CapturedMasks captureMasks={captureMasks} setMasks={setCapturedMasks} />
    </div>
  );
};

PracticeFooter.propTypes = {
  game: PropTypes.object.isRequired,
  webcam: PropTypes.object.isRequired,
};

export default PracticeFooter;
