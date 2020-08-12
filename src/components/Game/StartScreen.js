import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Typography, Button } from '@material-ui/core';
import { useTransition, animated } from 'react-spring';

import { gameStates } from '../../lib/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: theme.spacing(10),
    '& button': {
      marginTop: theme.spacing(2),
    },
  },
  transition: {
    textAlign: 'center',
  },
}));

const StartScreen = (props) => {
  const classes = useStyles();

  const handleSetScreen = useCallback(
    ({ currentTarget: { name } }) => {
      props.handlers.setScreen(name);
    },
    [props.handlers],
  );

  const transitions = useTransition(true, null, {
    from: { transform: 'translate3d(0,-80px,0)', opacity: 0 },
    enter: { transform: 'translate3d(0,0px,0)', opacity: 1 },
    leave: { transform: 'translate3d(0,-80px,0)', opacity: 0 },
  });

  return (
    <div className={classes.root}>
      {transitions.map(({ item, props, key }) => (
        <animated.div key={key} style={props} className={classes.transition}>
          <Typography component="h1" variant="h4">
            Select a game mode!
          </Typography>
          <Button
            variant="outlined"
            onClick={handleSetScreen}
            name={gameStates.screen.SINGLE_PLAYER}
          >
            Single Player
          </Button>
        </animated.div>
      ))}
    </div>
  );
};

StartScreen.propTypes = {
  handlers: PropTypes.object.isRequired,
  gameState: PropTypes.object.isRequired,
};

export default StartScreen;
