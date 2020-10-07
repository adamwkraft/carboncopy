import React, { useMemo } from 'react';

import { makeStyles } from '@material-ui/core';

import ScoreResults from '../../ScoreResults';
import CapturedMasks from '../../CapturedMasks';
import { useGame } from '../../Game';
import { getSurvivalPaperProps } from './Survival';

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

  const styleProps = useMemo(
    () =>
      game.mode?.name === 'survival'
        ? {
            getPaperProps: getSurvivalPaperProps,
            getImageChild: () => null,
          }
        : {},
    [game],
  );

  if (!game.mode) return null;

  const { simpleGame, captureMasks, handlePlayCapturedMasks, resultsText, name } = game.mode;

  const showResults = name === 'survival' || name === 'time attack' ? !game.loop.looping : true;

  return (
    <div className={classes.root}>
      {showResults && (
        <ScoreResults
          results={simpleGame.scores}
          hideItemText={name === 'survival'}
          hideItemColor={name === 'survival'}
          handleClose={simpleGame.clearScores}
          label={resultsText}
          {...styleProps}
        />
      )}
      {captureMasks && (
        <CapturedMasks captureMasks={captureMasks} handlePlay={handlePlayCapturedMasks} />
      )}
    </div>
  );
};

export default PracticeFooter;
