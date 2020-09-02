import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

import Null from '../Null';
import DefaultHeader from '../DefaultHeader';
import { screenStates } from '../../lib/screenConstants';

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const Headers = {
  [screenStates.screen.DEFAULT]: {
    [screenStates.players.DEFAULT]: Null,
  },
  [screenStates.screen.PLAY]: {
    [screenStates.players.SINGLE_PLAYER]: Null,
    [screenStates.players.MULTIPLAYER]: Null,
  },
};

const ScreenHeader = (props) => {
  const classes = useStyles();
  const {
    game: {
      screen: { state },
    },
  } = props;

  const HeaderContent = Headers[state.screen]?.[state.players] || DefaultHeader;

  return (
    <header className={classes.root}>
      <HeaderContent {...props} />
    </header>
  );
};

ScreenHeader.propTypes = {
  game: PropTypes.object.isRequired,
  webcam: PropTypes.object.isRequired,
};

export default ScreenHeader;
