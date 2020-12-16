import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { useGame } from '../components/Game';
import { useWebcam } from '../context/webcam';
import { animated, config, useSpring } from 'react-spring';

const useStyles = makeStyles((theme) => ({
  heading: {
    marginLeft: theme.spacing(2),
  },
}));

const DefaultHeader = (props) => {
  const classes = useStyles();
  const webcam = useWebcam();

  const game = useGame();

  const styleProps = useSpring({ to: { opacity: !webcam.hidden ? 1 : 0 }, config: config.stiff });

  const text = webcam.hidden
    ? ''
    : game?.screen?.state?.mode ||
      (game?.screen?.state?.screen === 'play' ? 'Choose Mode' : 'Select Players');

  return (
    <Typography component="h1" variant="h6" className={classes.heading}>
      <animated.div style={styleProps}>{text}</animated.div>
    </Typography>
  );
};

DefaultHeader.propTypes = {};

export default DefaultHeader;
