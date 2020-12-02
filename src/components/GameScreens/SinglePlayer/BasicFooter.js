import React, { useMemo } from 'react';
import { useGame } from '../../Game';
import ScoreResults from '../../ScoreResults';
import CapturedMasks from '../../CapturedMasks';
import { tenBinScoreToColor } from '../../../lib/score';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  score: {
    textAlign: 'right',
    paddingRight: theme.spacing(1),
  },
}));

const BasicFooter = (props) => {
  const game = useGame();
  const classes = useStyles();

  const showTimeAttackResults = useMemo(
    () =>
      game?.mode?.name === 'time attack'
        ? {
            getPaperProps: ({ score }) => ({
              style: { background: tenBinScoreToColor(Math.max(10.5 - score, 0), 0.4) },
            }),
            getImageChild: ({ score }) => (
              <Typography className={classes.score}>{score}s</Typography>
            ),
          }
        : {},
    [game, classes.score],
  );

  if (!game.mode) return null;

  const { simpleGame, captureMasks, handlePlayCapturedMasks, resultsText, name } = game.mode;

  const showResults = name === 'time attack' ? !game.loop.looping : true;

  return (
    <>
      {showResults && (
        <ScoreResults
          label={resultsText}
          results={simpleGame.scores}
          handleClose={props.hideClose ? null : simpleGame.clearScores}
          {...showTimeAttackResults}
        />
      )}
      {captureMasks && (
        <CapturedMasks captureMasks={captureMasks} handlePlay={handlePlayCapturedMasks} />
      )}
    </>
  );
};

export default BasicFooter;
