import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import React, { memo, createContext, useContext } from 'react';

import Webcam from './Webcam';
import GlobalHeader from './GlobalHeader';
import ScreenHeader from './GameScreens/ScreenHeader';
import ScreenFooter from './GameScreens/ScreenFooter';
import ScreenContent from './GameScreens/ScreenContent';

import { useGameController } from '../hooks/game';

const useStyles = makeStyles((theme) => ({
  header: {
    marginTop: theme.spacing(2),
  },
}));

const gameContext = createContext();

export const useGame = () => {
  const state = useContext(gameContext);

  if (!state) {
    throw new Error('useGame must be called from inside the <Game> component.');
  }

  return state;
};

const Game = ({ webcam }) => {
  const classes = useStyles();

  const game = useGameController();

  return (
    <gameContext.Provider value={game}>
      <GlobalHeader
        mode={game.screen.state.mode}
        screen={game.screen.state.screen}
        goHome={game.screen.handlers.resetState}
        goBack={game.screen.handlers.reverseState}
      />
      <div className={classes.header}>
        <ScreenHeader screenState={game.screen.state} />
      </div>
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
