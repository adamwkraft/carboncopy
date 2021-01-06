import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import React, { useCallback, useMemo } from 'react';

import PersonIcon from '@material-ui/icons/Person';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';

import Options from './Options';
import { screenStates, screenStatesArrays, wipScreens } from '../lib/screenConstants';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  transition: {
    textAlign: 'center',
  },
  header: {
    marginBottom: theme.spacing(2),
  },
}));

const Icons = {
  [screenStates.players.SINGLE_PLAYER]: PersonIcon,
  [screenStates.players.MULTIPLAYER]: PeopleAltIcon,
};

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
          Icon: Icons[playerMode],
          hover: true,
        },
      })),
    [handleSetPlayerMode],
  );

  return (
    <div className={classes.root}>
      <Options label="Select Players" buttons={buttons} layout="h" />
    </div>
  );
};

ChoosePlayers.propTypes = {
  setPlayerMode: PropTypes.func.isRequired,
};

export default ChoosePlayers;
