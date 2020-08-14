import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'rgba(255,0,255,0.5)',
    height: '100%',
  },
}));

const SinglePlayerContent = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography component="h1" variant="h5">
        Select Game Mode
      </Typography>
    </div>
  );
};

SinglePlayerContent.propTypes = {
  handlers: PropTypes.object.isRequired,
  gameState: PropTypes.object.isRequired,
};

export default SinglePlayerContent;
