import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  root: ({ flip, height = 10, background = 'rgba(255,255,255,0)' }) => ({
    height,
    background,
    width: '100%',
    borderRadius: 50,
    transform: `scaleX(${flip ? -1 : 1})`,
    pWebkitTransform: `scaleX(${flip ? -1 : 1})`,
  }),
  filler: ({ completed, color }) => ({
    height: '100%',
    textAlign: 'left',
    background: color,
    width: `${completed}%`,
    borderRadius: 'inherit',
  }),
}));

const ProgressBar = (props) => {
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <div className={classes.filler} />
    </div>
  );
};

ProgressBar.propTypes = {
  flip: PropTypes.bool,
  color: PropTypes.string.isRequired,
  completed: PropTypes.number.isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ProgressBar;
