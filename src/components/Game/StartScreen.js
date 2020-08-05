import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Typography, Button } from '@material-ui/core';
import { gameStates } from '../../lib/constants';

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const StartScreen = (props) => {
  const classes = useStyles();

  const handleSetScreen = useCallback(
    ({ currentTarget: { name } }) => {
      props.handlers.setScreen(name);
    },
    [props.handlers],
  );

  return (
    <div className={classes.root}>
      <Typography component="h1">Select a game mode!</Typography>
      <Button onClick={handleSetScreen} name={gameStates.screen.SINGLE_PLAYER}>
        Single Player
      </Button>
    </div>
  );
};

StartScreen.propTypes = {
  handlers: PropTypes.object.isRequired,
  gameState: PropTypes.object.isRequired,
};

export default StartScreen;
