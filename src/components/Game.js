import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useSpring, animated, config } from 'react-spring';

import Webcam from './Webcam';
import StartScreenHeader from './Start/Header';
import SinglePlayerContent from './SinglePlayer/Content';

import { useGameState } from '../hooks/game';
import { gameStates } from '../lib/constants';
import DefaultHeader from './DefaultHeader';

const Null = () => null;

const screens = {
  [gameStates.screen.START]: [StartScreenHeader],
  [gameStates.screen.SINGLE_PLAYER]: [, SinglePlayerContent], // eslint-disable-line no-sparse-arrays
};

const Game = ({ webcam }) => {
  const [gameState, handlers] = useGameState();

  useEffect(() => {
    if (gameState.screen !== gameStates.screen.START && webcam.hidden) {
      webcam.setVisible();
    }
  }, [webcam, gameState.screen]);

  const props = useSpring({ to: { opacity: !webcam.hidden ? 1 : 0 }, config: config.gentle });

  const [ScreenHeader = DefaultHeader, ScreenContent = Null, ScreenFooter = Null] = screens[
    gameState.screen
  ];

  return (
    <>
      <ScreenHeader handlers={handlers} gameState={gameState} />
      <animated.div style={props}>
        <Webcam>
          <ScreenContent handlers={handlers} gameState={gameState} />
        </Webcam>
      </animated.div>
      <ScreenFooter handlers={handlers} gameState={gameState} />
    </>
  );
};

Game.propTypes = {
  webcam: PropTypes.object.isRequired,
};

export default Game;
