import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { useWebcam } from '../../context/webcam';
import { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const SinglePlayer = (props) => {
  const classes = useStyles();
  const webcam = useWebcam();

  useEffect(() => {
    if (webcam.hidden) {
      webcam.setVisible();
    }
  }, [webcam]);

  return (
    <div className={classes.root}>
      <Typography component="h1">Single Player Mode</Typography>
    </div>
  );
};

SinglePlayer.propTypes = {
  handlers: PropTypes.object.isRequired,
  gameState: PropTypes.object.isRequired,
};

export default SinglePlayer;
