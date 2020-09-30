import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

import Typography from '@material-ui/core/Typography';

import {
  tenBinScoreToPercent,
  rawScoreToColor,
  rawScoreToTenBinScore,
  scoreToColor,
} from '../lib/score';
import { useMemo } from 'react';
import MasksGrid from './MasksGrid';
import { useCallback } from 'react';

const useStyles = makeStyles((theme) => ({
  score: {
    textAlign: 'right',
    paddingRight: theme.spacing(1),
  },
}));

const ScoreResults = (props) => {
  const classes = useStyles();
  const { results, handleClose } = props;

  const title = useMemo(() => {
    const gameScoreAverage =
      results.reduce((acc, { score }) => acc + rawScoreToTenBinScore(score), 0) / results.length;
    const binPercentScore = tenBinScoreToPercent(gameScoreAverage);
    const scoreColor = scoreToColor(binPercentScore);
    const fixedGameScore = gameScoreAverage.toFixed(1);
    const title = (
      <Typography variant="h6" component="h3">
        {props.label ? (
          props.label
        ) : (
          <>
            Round Score: <span style={{ color: scoreColor }}>{fixedGameScore}</span>
          </>
        )}
      </Typography>
    );

    return title;
  }, [results, props]);

  const getDataUri = useCallback(({ dataUri }) => dataUri, []);
  const getPaperProps = useCallback(
    ({ score }) => ({ style: { background: rawScoreToColor(score, 0.4) } }),
    [],
  );
  const getImageChild = useCallback(
    ({ score }) => (
      <Typography className={classes.score}>{rawScoreToTenBinScore(score)}</Typography>
    ),
    [classes.score],
  );

  return (
    <MasksGrid
      title={title}
      masks={results}
      onClose={handleClose}
      getDataUri={getDataUri}
      getPaperProps={getPaperProps}
      getImageChild={getImageChild}
    />
  );
};

ScoreResults.propTypes = {
  label: PropTypes.string,
  handleClose: PropTypes.func,
  results: PropTypes.array.isRequired,
};

export default ScoreResults;
