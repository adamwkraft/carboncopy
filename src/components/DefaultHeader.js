import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
  },
  heading: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const DefaultHeader = (props) => {
  const classes = useStyles();

  return (
    <header className={classes.root}>
      <Typography component="h1" variant="h5" className={classes.heading}>
        {props.gameState.screen}
      </Typography>
    </header>
  );
};

DefaultHeader.propTypes = {
  handlers: PropTypes.object.isRequired,
  gameState: PropTypes.object.isRequired,
};

export default DefaultHeader;
