import React from 'react';
import PropTypes from 'prop-types';

import { screenStates } from '../../lib/screenConstants';

import Null from '../Null';
import SelectGameMode from '../SelectGameMode';
import Practice from '../GameScreens/SinglePlayer/Practice';

const Screens = {
  [screenStates.screen.PLAY]: {
    [screenStates.players.SINGLE_PLAYER]: {
      [screenStates.mode[screenStates.players.SINGLE_PLAYER].PRACTICE]: Practice,
      [screenStates.mode[screenStates.players.SINGLE_PLAYER].SURVIVAL]: () => 'SURVIVAL Content',
      [screenStates.mode[screenStates.players.SINGLE_PLAYER].TIME_ATTACK]: () =>
        'TIME_ATTACK Content',
    },
    [screenStates.players.MULTIPLAYER]: {
      [screenStates.mode[screenStates.players.MULTIPLAYER].LOCAL]: () => 'LOCAL Content',
      [screenStates.mode[screenStates.players.MULTIPLAYER].REMOTE]: () => 'REMOTE Content',
    },
  },
};

const ScreenContent = (props) => {
  const { screen, mode, players } = props.screen.state;
  // early return if we haven't chosen a number of players yet
  if (screen === screenStates.screen.DEFAULT) return null;
  if (mode === screenStates.mode.DEFAULT) return <SelectGameMode screen={props.screen} />;

  const Content = Screens[screen]?.[players]?.[mode] || Null;

  return <Content />;
};

ScreenContent.propTypes = {
  screen: PropTypes.object.isRequired,
};

export default ScreenContent;
