import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';

import { gameStatesArrays, wip } from '../lib/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    '& button': {
      marginTop: theme.spacing(2),
    },
    '& ul': {
      textAlign: 'center',
    },
  },
  header: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
}));

const SelectGameMode = (props) => {
  const classes = useStyles();

  const handleSetGameMode = useCallback(
    ({ currentTarget: { name } }) => {
      props.handlers.setGameMode(name);
    },
    [props.handlers],
  );

  return (
    <div className={classes.root}>
      <Typography component="h1" variant="h4" className={classes.header}>
        Select Game Mode
      </Typography>
      <ul className={classes.gameMode}>
        {gameStatesArrays.mode[props.gameState.players]?.map((gameMode) => (
          <li className={classes.gameModeItem} key={gameMode}>
            <Button
              color="primary"
              disabled={!!wip[gameMode]}
              variant="contained"
              onClick={handleSetGameMode}
              name={gameMode}
            >
              {gameMode}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

SelectGameMode.propTypes = {
  handlers: PropTypes.object.isRequired,
  gameState: PropTypes.object.isRequired,
};

export default SelectGameMode;
