import React from 'react';

import { makeStyles } from '@material-ui/core';

import ScoreResults from '../../ScoreResults';
import CapturedMasks from '../../CapturedMasks';
import { useGame } from '../../Game';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > div': {
      marginTop: theme.spacing(2),
    },
  },
}));

const PracticeFooter = (props) => {
  const classes = useStyles();

  const game = useGame();

  if (!game.mode) return null;

  const { simpleGame, captureMasks, handlePlayCapturedMasks, resultsText } = game.mode;

  return (
    <div className={classes.root}>
      <ScoreResults
        results={simpleGame.scores}
        handleClose={simpleGame.clearScores}
        label={resultsText}
      />
      {captureMasks && (
        <CapturedMasks captureMasks={captureMasks} handlePlay={handlePlayCapturedMasks} />
      )}
    </div>
  );
};

export default PracticeFooter;
