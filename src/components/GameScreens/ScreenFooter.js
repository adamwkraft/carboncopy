import React from 'react';
import PropTypes from 'prop-types';

import { gameStates } from '../../lib/constants';

import Null from '../Null';
import ChoosePlayers from '../ChoosePlayers';

const Footers = {
  [gameStates.screen.PLAY]: {
    [gameStates.players.SINGLE_PLAYER]: {
      [gameStates.mode[gameStates.players.SINGLE_PLAYER].PRACTICE]: () => 'PRACTICE',
      [gameStates.mode[gameStates.players.SINGLE_PLAYER].SURVIVAL]: () => 'SURVIVAL',
      [gameStates.mode[gameStates.players.SINGLE_PLAYER].TIME_ATTACK]: () => 'TIME_ATTACK',
    },
    [gameStates.players.MULTIPLAYER]: {
      [gameStates.mode[gameStates.players.MULTIPLAYER].LOCAL]: () => 'LOCAL',
      [gameStates.mode[gameStates.players.MULTIPLAYER].REMOTE]: () => 'REMOTE',
    },
  },
};

const ScreenFooter = (props) => {
  const { gameState } = props;

  if (gameState.screen === gameStates.screen.DEFAULT) return <ChoosePlayers {...props} />;

  const Footer = Footers[gameState.screen]?.[gameState.players]?.[gameState.mode] || Null;

  return <Footer {...props} />;
};

ScreenFooter.propTypes = {
  handlers: PropTypes.object.isRequired,
  gameState: PropTypes.object.isRequired,
};

export default ScreenFooter;
