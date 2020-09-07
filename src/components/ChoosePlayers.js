import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import React, { useCallback, useMemo } from 'react';

import Options from './Options';
import { screenStatesArrays, wipScreens } from '../lib/screenConstants';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    '& button': {
      minWidth: 150,
      marginTop: theme.spacing(2),
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
      props.setPlayerMode(name);
    },
    [props],
  );

  const buttons = useMemo(
    () =>
      screenStatesArrays.players.map((playerMode) => ({
        props: {
          key: playerMode,
          name: playerMode,
          children: playerMode,
          onClick: handleSetPlayerMode,
          disabled: !!wipScreens[playerMode],
        },
      })),
    [handleSetPlayerMode],
  );

  return (
    <div className={classes.root}>
      <Options buttons={buttons} />
    </div>
  );
};

ChoosePlayers.propTypes = {
  setPlayerMode: PropTypes.func.isRequired,
};

export default ChoosePlayers;
