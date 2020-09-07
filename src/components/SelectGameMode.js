import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import React, { useCallback, useMemo } from 'react';

import { screenStatesArrays, wipScreens } from '../lib/screenConstants';

import Options from './Options';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    '& button': {
      minWidth: 150,
      marginTop: theme.spacing(2),
    },
  },
  gameMode: {
    textAlign: 'center',
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
      props.screen.handlers.setGameMode(name);
    },
    [props.screen.handlers],
  );

  const buttons = useMemo(
    () =>
      screenStatesArrays.mode[props.screen.state.players]?.map((gameMode) => ({
        props: {
          key: gameMode,
          name: gameMode,
          children: gameMode,
          onClick: handleSetGameMode,
          disabled: !!wipScreens[gameMode],
        },
      })),
    [props.screen.state.players, handleSetGameMode],
  );

  return (
    <div className={classes.root}>
      <div className={classes.gameMode}>
        <Options buttons={buttons} />
      </div>
    </div>
  );
};

SelectGameMode.propTypes = {
  screen: PropTypes.object.isRequired,
};

export default SelectGameMode;
