import React from 'react';
import PropTypes from 'prop-types';

import { screenStates } from '../../lib/screenConstants';

import Null from '../Null';
import SelectGameMode from '../SelectGameMode';
import Practice from '../GameScreens/SinglePlayer/Practice';
import Survival from '../GameScreens/SinglePlayer/Survival';

const Screens = {
  [screenStates.screen.PLAY]: {
    [screenStates.players.SINGLE_PLAYER]: {
      [screenStates.mode[screenStates.players.SINGLE_PLAYER].PRACTICE]: Practice,
      [screenStates.mode[screenStates.players.SINGLE_PLAYER].SURVIVAL]: Survival,
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
  const {
    game: {
      screen: { state },
    },
  } = props;
  // early return if we haven't chosen a number of players yet
  if (state.screen === screenStates.screen.DEFAULT) return null;
  if (state.mode === screenStates.mode.DEFAULT) return <SelectGameMode {...props} />;

  const Content = Screens[state.screen]?.[state.players]?.[state.mode] || Null;

  return <Content {...props} />;
};

ScreenContent.propTypes = {
  game: PropTypes.object.isRequired,
  webcam: PropTypes.object.isRequired,
};

export default ScreenContent;
