import React from 'react';
import PropTypes from 'prop-types';

import { gameStates } from '../../lib/constants';

import Null from '../Null';
import SelectGameMode from '../SelectGameMode';

const Screens = {
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

const ScreenContent = (props) => {
  const { gameState } = props;

  // early return if we haven't chosen a number of players yet
  if (gameState.screen === gameStates.screen.DEFAULT) return null;
  if (gameState.mode === gameStates.mode.DEFAULT) return <SelectGameMode {...props} />;

  const Content = Screens[gameState.screen]?.[gameState.players]?.[gameState.mode] || Null;

  return <Content {...props} />;
};

ScreenContent.propTypes = {
  handlers: PropTypes.object.isRequired,
  gameState: PropTypes.object.isRequired,
};

export default ScreenContent;
