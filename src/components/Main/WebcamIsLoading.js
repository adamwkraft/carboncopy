import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
    background: 'red',
  },
}));

const WebcamIsLoading = () => {
  const classes = useStyles();

  return <div className={classes.root}>Loading webcam...</div>;
};

export default WebcamIsLoading;
