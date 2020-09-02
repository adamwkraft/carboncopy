import PropTypes from 'prop-types';
import React, { useEffect, memo } from 'react';
import { useSpring, animated, config } from 'react-spring';

import Webcam from './Webcam';

import { screenStates } from '../lib/screenConstants';
import { makeStyles } from '@material-ui/styles';

import classnames from 'classnames';

import ScreenHeader from './GameScreens/ScreenHeader';
import ScreenContent from './GameScreens/ScreenContent';
import ScreenFooter from './GameScreens/ScreenFooter';

import { useGame } from '../hooks/game';
import GlobalHeader from './GlobalHeader';
import { useMemo } from 'react';

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

const Game = ({ webcam }) => {
  const classes = useStyles();

  const game = useGame();

  console.log(game);

  useEffect(() => {
    if (game.screen.state.screen !== screenStates.screen.DEFAULT && webcam.hidden) {
      webcam.setVisible();
    } else if (game.screen.state.screen === screenStates.screen.DEFAULT && !webcam.hidden) {
      webcam.setHidden();
    }
  }, [webcam, game.screen.state.screen]);

  const styleProps = useSpring({ to: { opacity: !webcam.hidden ? 1 : 0 }, config: config.gentle });

  const screenProps = useMemo(
    () => ({
      game,
      webcam,
    }),
    [game, webcam],
  );

  return (
    <>
      <GlobalHeader {...screenProps} />
      <div className={classes.header}>
        <ScreenHeader {...screenProps} />
      </div>
      <animated.div style={styleProps}>
        <Webcam>
          {/* TODO: need to check if webcam is loading here */}
          <>
            {!game.screen.state.mode && (
              <div
                className={classnames({
                  [classes.overlay]: !game.screen.state.mode,
                  [classes.fsOverlay]: webcam.isFullScreen,
                })}
              />
            )}
            <ScreenContent {...screenProps} />
          </>
        </Webcam>
      </animated.div>
      <ScreenFooter {...screenProps} />
    </>
  );
};

Game.propTypes = {
  webcam: PropTypes.object.isRequired,
};

export default memo(Game);
