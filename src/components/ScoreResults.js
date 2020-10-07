import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

import Typography from '@material-ui/core/Typography';

import { tenBinScoreToColor } from '../lib/score';
import { useMemo } from 'react';
import MasksGrid from './MasksGrid';
import { useCallback } from 'react';

const useStyles = makeStyles((theme) => ({
  score: {
    textAlign: 'right',
    paddingRight: theme.spacing(1),
  },
}));

const ScoreResults = ({ results, handleClose, label, ...props }) => {
  const classes = useStyles();

  const title = useMemo(() => {
    const gameScoreAverage = results.reduce((acc, { score }) => acc + score, 0) / results.length;
    const fixedGameScore = gameScoreAverage.toFixed(1);
    const title = (
      <Typography variant="h6" component="h3">
        {label ? label : <>Round Score: {fixedGameScore}</>}
      </Typography>
    );

    return title;
  }, [results, label]);

  const getDataUri = useCallback(({ dataUri }) => dataUri, []);
  const getPaperProps = useCallback(
    ({ score }) => ({ style: { background: tenBinScoreToColor(score, 0.4) } }),
    [],
  );
  const getImageChild = useCallback(
    ({ score }) => <Typography className={classes.score}>{score}</Typography>,
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
      {...props}
    />
  );
};

ScoreResults.propTypes = {
  label: PropTypes.string,
  handleClose: PropTypes.func,
  results: PropTypes.array.isRequired,
};

export default ScoreResults;
