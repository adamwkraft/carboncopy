import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { useSpring, animated, config } from 'react-spring';
import React, { useEffect, memo, createContext, useContext } from 'react';

import Webcam from './Webcam';
import GlobalHeader from './GlobalHeader';
import ScreenHeader from './GameScreens/ScreenHeader';
import ScreenFooter from './GameScreens/ScreenFooter';
import ScreenContent from './GameScreens/ScreenContent';

import { useGameController } from '../hooks/game';
import { screenStates } from '../lib/screenConstants';

const useStyles = makeStyles((theme) => ({
  header: {
    marginTop: theme.spacing(2),
  },
  overlay: {
    background: 'rgba(255,255,255,0.5)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: theme.spacing(2),
    right: theme.spacing(2),
    borderRadius: theme.spacing(1),
    zIndex: -1,
  },
  fsOverlay: {
    left: 0,
    right: 0,
    borderRadius: 0,
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

  useEffect(() => {
    if (game.screen.state.screen !== screenStates.screen.DEFAULT && webcam.hidden) {
      webcam.setVisible();
    } else if (game.screen.state.screen === screenStates.screen.DEFAULT && !webcam.hidden) {
      webcam.setHidden();
    }
  }, [webcam, game.screen.state.screen]);

  const styleProps = useSpring({ to: { opacity: !webcam.hidden ? 1 : 0 }, config: config.gentle });

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
      <animated.div style={styleProps}>
        <Webcam>
          <>
            {!game.screen.state.mode && (
              <div
                className={classnames({
                  [classes.overlay]: !game.screen.state.mode,
                  [classes.fsOverlay]: webcam.isFullScreen,
                })}
              />
            )}
            <ScreenContent screen={game.screen} />
          </>
        </Webcam>
      </animated.div>
      <ScreenFooter screen={game.screen} />
    </gameContext.Provider>
  );
};

Game.propTypes = {
  webcam: PropTypes.object.isRequired,
};

export default memo(Game);
