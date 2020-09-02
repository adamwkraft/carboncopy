import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
  masks: {
    padding: theme.spacing(1),
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
  imgContainer: {
    width: 200,
    padding: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
    textAlign: 'right',
  },
  img: {
    width: '100%',
  },
}));

const ScoreResults = (props) => {
  const classes = useStyles();

  const { results } = props;

  const rawScoreToTenBinScore = (score) => {
    // Takes in score from [0-100] and returns score [1-10]
    const lowThresh = 25;
    const highThresh = 88;
    const p = (score - lowThresh) / (highThresh - lowThresh);
    return Math.max(1, Math.min(10, Math.round(p * 10)));
  };

  const tenBinScoreToPercent = (score) => {
    return (score / 10) * 100;
  };

  const scoreToColor = (score) => {
    // Returns a hex color value from reg to green based on score from 0-100
    // Using from: https://gist.github.com/mlocati/7210513
    var r,
      g,
      b = 0;
    if (score < 50) {
      r = 255;
      g = Math.round(5.1 * score);
    } else {
      g = 255;
      r = Math.round(510 - 5.1 * score);
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
  };

  const rawScoreToBinScoreFn = rawScoreToTenBinScore;
  const rawScoreToColor = (score) => {
    return scoreToColor(tenBinScoreToPercent(rawScoreToTenBinScore(score)));
  };

  let gameScoreAverage =
    results.reduce((acc, { score }) => acc + rawScoreToBinScoreFn(score), 0) / results.length;
  let binPercentScore = tenBinScoreToPercent(gameScoreAverage);

  return (
    !!results.length && (
      <>
        <Paper className={classes.masks} elevation={2}>
          <div className={classes.masksHeader}>
            <div>
              <Typography variant="h6" component="h3">
                Results
              </Typography>
              Game Score:
              <Typography
                component="p"
                style={{
                  backgroundColor: scoreToColor(binPercentScore),
                  display: 'inline-block',
                }}
              >
                {gameScoreAverage.toFixed(1)}
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
              <li className={classes.imgContainer} key={dataUri}>
                <Typography
                  style={{
                    backgroundColor: rawScoreToColor(score),
                    display: 'inline-block',
                  }}
                >
                  {rawScoreToTenBinScore(score)}
                </Typography>
                <img src={dataUri} className={classes.img} alt={`mask #${i}`} />
              </li>
            ))}
          </ul>
        </Paper>
      </>
    )
  );
};

ScoreResults.propTypes = {
  results: PropTypes.array.isRequired,
  handleClose: PropTypes.func,
};

export default ScoreResults;
