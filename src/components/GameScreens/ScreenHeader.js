import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

import Null from '../Null';
import DefaultHeader from '../DefaultHeader';
import { gameStates } from '../../lib/constants';

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const Headers = {
  [gameStates.screen.DEFAULT]: {
    [gameStates.players.DEFAULT]: Null,
  },
  [gameStates.screen.PLAY]: {
    [gameStates.players.SINGLE_PLAYER]: Null,
    [gameStates.players.MULTIPLAYER]: Null,
  },
};

const ScreenHeader = (props) => {
  const classes = useStyles();
  const { gameState } = props;

  const HeaderContent = Headers[gameState.screen]?.[gameState.players] || DefaultHeader;

  return (
    <header className={classes.root}>
      <HeaderContent {...props} />
    </header>
  );
};

ScreenHeader.propTypes = {
  handlers: PropTypes.object.isRequired,
  gameState: PropTypes.object.isRequired,
};

export default ScreenHeader;
