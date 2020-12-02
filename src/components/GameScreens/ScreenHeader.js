import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

import DefaultHeader from '../DefaultHeader';
import { screenStates } from '../../lib/screenConstants';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
}));

const Headers = {
  [screenStates.screen.DEFAULT]: {
    [screenStates.players.DEFAULT]: null,
  },
  [screenStates.screen.PLAY]: {
    [screenStates.players.SINGLE_PLAYER]: null,
    [screenStates.players.MULTIPLAYER]: null,
  },
};

const ScreenHeader = (props) => {
  const classes = useStyles();

  const { screen, players } = props.screenState;

  const HeaderContent = Headers[screen]?.[players] || DefaultHeader;

  return (
    <header className={classes.root}>
      <HeaderContent />
    </header>
  );
};

ScreenHeader.propTypes = {
  screenState: PropTypes.object.isRequired,
};

export default ScreenHeader;
