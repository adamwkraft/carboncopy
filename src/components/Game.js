import PropTypes from 'prop-types';
import React, { memo, createContext, useContext, useEffect } from 'react';

import Webcam from './Webcam';
import GlobalHeader from './GlobalHeader';
import ScreenHeader from './GameScreens/ScreenHeader';
import ScreenFooter from './GameScreens/ScreenFooter';
import ScreenContent from './GameScreens/ScreenContent';

import { useGameController } from '../hooks/game';
import Warning from './Warning';
import PeerTemp from './PeerTemp';

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
      <PeerTemp />
      <Warning open={!game.warning.completed} handleClose={game.warning.handleCloseWarning} />
      <GlobalHeader controller={game.headerController} />
      <ScreenHeader screenState={game.screen.state} />
      <Webcam overlay={!game.screen.state.mode} headerController={game.headerController}>
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
