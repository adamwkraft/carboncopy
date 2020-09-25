import PropTypes from 'prop-types';
import React, { memo, createContext, useContext, useEffect } from 'react';

import Webcam from './Webcam';
import GlobalHeader from './GlobalHeader';
import ScreenHeader from './GameScreens/ScreenHeader';
import ScreenFooter from './GameScreens/ScreenFooter';
import ScreenContent from './GameScreens/ScreenContent';

import { useGameController } from '../hooks/game';

const gameContext = createContext();

export const useGame = () => {
  const state = useContext(gameContext);

  if (!state) {
    throw new Error('useGame must be called from inside the <Game> component.');
  }

  return state;
};

export const useGameMode = (useGameModeHook) => {
  const { loop, setMode } = useGame();
  const gameMode = useGameModeHook(loop);

  useEffect(() => {
    setMode(gameMode);
  }, [gameMode, setMode]);

  return gameMode;
};

const Game = ({ webcam }) => {
  const game = useGameController();

  return (
    <gameContext.Provider value={game}>
      <GlobalHeader
        mode={game.screen.state.mode}
        screen={game.screen.state.screen}
        players={game.screen.state.players}
        goHome={game.screen.handlers.resetState}
        goBack={game.screen.handlers.reverseState}
      />
      <ScreenHeader screenState={game.screen.state} />
      <Webcam overlay={!game.screen.state.mode}>
        <ScreenContent screen={game.screen} />
      </Webcam>
      <ScreenFooter screen={game.screen} />
    </gameContext.Provider>
  );
};

Game.propTypes = {
  webcam: PropTypes.object.isRequired,
};

export default memo(Game);
