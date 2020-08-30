import PropTypes from 'prop-types';
import React, { useEffect, memo } from 'react';
import { useSpring, animated, config } from 'react-spring';

import BackIcon from '@material-ui/icons/ArrowLeft';
import IconButton from '@material-ui/core/IconButton';

import Webcam from './Webcam';

import { gameStates } from '../lib/constants';
import { makeStyles } from '@material-ui/styles';

import WebcamSelect from './WebcamSelect';
import classnames from 'classnames';

import ScreenHeader from './GameScreens/ScreenHeader';
import ScreenContent from './GameScreens/ScreenContent';
import ScreenFooter from './GameScreens/ScreenFooter';

const useStyles = makeStyles((theme) => ({
  back: {
    border: '2px solid grey',
  },
  header: {
    marginTop: theme.spacing(2),
  },
  options: {
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 1600,
    margin: '0 auto',
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

const Game = ({ webcam, gameState, gameHandlers }) => {
  const classes = useStyles();

  console.log(gameState);

  useEffect(() => {
    if (gameState.screen !== gameStates.screen.DEFAULT && webcam.hidden) {
      webcam.setVisible();
    } else if (gameState.screen === gameStates.screen.DEFAULT && !webcam.hidden) {
      webcam.setHidden();
    }
  }, [webcam, gameState.screen]);

  const styleProps = useSpring({ to: { opacity: !webcam.hidden ? 1 : 0 }, config: config.gentle });

  return (
    <>
      {gameState.screen !== gameStates.screen.DEFAULT && (
        <div className={classes.options}>
          <IconButton className={classes.back} size="small" onClick={gameHandlers.resetState}>
            <BackIcon />
          </IconButton>
          <WebcamSelect />
        </div>
      )}
      <div className={classes.header}>
        <ScreenHeader handlers={gameHandlers} gameState={gameState} />
      </div>
      <animated.div style={styleProps}>
        <Webcam>
          {/* TODO: need to check if webcam is loading here */}
          <>
            {!gameState.mode && (
              <div
                className={classnames({
                  [classes.overlay]: !gameState.mode,
                  [classes.fsOverlay]: webcam.isFullScreen,
                })}
              />
            )}
            <ScreenContent handlers={gameHandlers} gameState={gameState} />
          </>
        </Webcam>
      </animated.div>
      <ScreenFooter handlers={gameHandlers} gameState={gameState} />
    </>
  );
};

Game.propTypes = {
  webcam: PropTypes.object.isRequired,
};

export default memo(Game);
