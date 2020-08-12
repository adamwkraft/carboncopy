import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSpring, animated, config } from 'react-spring';

import Webcam from '../Webcam';
import StartScreen from './StartScreen';
import SinglePlayer from './SinglePlayer';

import { useGameState } from '../../hooks/game';
import { gameStates } from '../../lib/constants';

const Game = ({ webcam }) => {
  const [gameState, handlers] = useGameState();
  const [transition, setTransition] = useState(false);

  let Screen = React.Fragment;

  switch (gameState.screen) {
    case gameStates.screen.START:
      Screen = StartScreen;
      break;
    case gameStates.screen.SINGLE_PLAYER:
      Screen = SinglePlayer;
      if (!transition) setTransition(true);
      break;
    default:
      break;
  }

  const props = useSpring({ to: { opacity: transition ? 1 : 0 }, config: config.gentle });

  return (
    <>
      <Screen handlers={handlers} gameState={gameState} />
      <animated.div style={props}>
        <Webcam />
      </animated.div>
    </>
  );
};

Game.propTypes = {
  webcam: PropTypes.object.isRequired,
};

export default Game;
