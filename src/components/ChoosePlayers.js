import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import { useTransition, animated } from 'react-spring';

import { screenStatesArrays, wipScreens } from '../lib/screenConstants';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: theme.spacing(10),
    '& button': {
      marginTop: theme.spacing(2),
      minWidth: 150,
    },
  },
  transition: {
    textAlign: 'center',
  },
  header: {
    marginBottom: theme.spacing(2),
  },
}));

const ChoosePlayers = (props) => {
  const classes = useStyles();

  const handleSetPlayerMode = useCallback(
    ({ currentTarget: { name } }) => {
      props.game.screen.handlers.setPlayerMode(name);
    },
    [props.game.screen.handlers],
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
          <Typography component="h1" variant="h4" className={classes.header}>
            Please Choose One
          </Typography>
          <ul className={classes.playerMode}>
            {screenStatesArrays.players.map((playerMode) => (
              <li className={classes.playerModeItem} key={playerMode}>
                <Button
                  disabled={!!wipScreens[playerMode]}
                  variant="outlined"
                  onClick={handleSetPlayerMode}
                  name={playerMode}
                >
                  {playerMode}
                </Button>
              </li>
            ))}
          </ul>
        </animated.div>
      ))}
    </div>
  );
};

ChoosePlayers.propTypes = {
  game: PropTypes.object.isRequired,
};

export default ChoosePlayers;
