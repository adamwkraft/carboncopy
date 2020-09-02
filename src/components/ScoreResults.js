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
    background: 'black',
    width: '100%',
  },
}));

const ScoreResults = (props) => {
  const classes = useStyles();

  const { results } = props;

  return (
    !!results.length && (
      <>
        <Paper className={classes.masks} elevation={2}>
          <div className={classes.masksHeader}>
            <div>
              <Typography variant="h6" component="h3">
                Results
              </Typography>
              <Typography component="p">
                Average: {results.reduce((acc, { score }) => acc + score, 0) / results.length}
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
                <Typography>{score}</Typography>
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
