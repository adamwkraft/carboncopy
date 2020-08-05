import React from 'react';
import PropTypes from 'prop-types';

import Webcam from '../Webcam';
import StartScreen from './StartScreen';
import SinglePlayer from './SinglePlayer';

import { useGameState } from '../../hooks/game';
import { gameStates } from '../../lib/constants';

const Game = ({ webcam }) => {
  const [gameState, handlers] = useGameState();

  let Screen = React.Fragment;

  switch (gameState.screen) {
    case gameStates.screen.START:
      Screen = StartScreen;
      break;
    case gameStates.screen.SINGLE_PLAYER:
      Screen = SinglePlayer;
      break;
    default:
      break;
  }

  return (
    <>
      <Screen handlers={handlers} gameState={gameState} />
      <Webcam />
    </>
  );
};

Game.propTypes = {
  webcam: PropTypes.object.isRequired,
};

export default Game;
