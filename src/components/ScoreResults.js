import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import {
  tenBinScoreToPercent,
  rawScoreToColor,
  rawScoreToTenBinScore,
  scoreToColor,
} from '../lib/score';

const useStyles = makeStyles((theme) => ({
  masks: {
    padding: theme.spacing(2),
    background: 'rgba(255,255,255,0.5)',
  },
  masksHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  masksList: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-around',
  },
  maskContainer: { marginTop: theme.spacing(2) },
  imgContainer: {
    width: 200,
    textAlign: 'right',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(1),
  },
  img: {
    width: '100%',
  },
}));

const ScoreResults = (props) => {
  const { results } = props;
  const classes = useStyles();

  const gameScoreAverage =
    results.reduce((acc, { score }) => acc + rawScoreToTenBinScore(score), 0) / results.length;
  const binPercentScore = tenBinScoreToPercent(gameScoreAverage);

  return (
    !!results.length && (
      <Paper className={classes.masks} elevation={4}>
        <div className={classes.masksHeader}>
          <div>
            <Typography variant="h6" component="h3">
              Round Score:{' '}
              <span style={{ color: scoreToColor(binPercentScore) }}>
                {gameScoreAverage.toFixed(1)}
              </span>
            </Typography>
          </div>
          {props.handleClose && (
            <div>
              <IconButton size="small" onClick={props.handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
          )}
        </div>
        <ul className={classes.masksList}>
          {results.map(({ score, dataUri }, i) => (
            <li key={dataUri} className={classes.maskContainer}>
              <Paper
                elevation={4}
                className={classes.imgContainer}
                style={{ background: rawScoreToColor(score, 0.4) }}
              >
                <Typography>{rawScoreToTenBinScore(score)}</Typography>
                <img src={dataUri} className={classes.img} alt={`mask #${i}`} />
              </Paper>
            </li>
          ))}
        </ul>
      </Paper>
    )
  );
};

ScoreResults.propTypes = {
  results: PropTypes.array.isRequired,
  handleClose: PropTypes.func,
};

export default ScoreResults;
