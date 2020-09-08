import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';

import WebcamSelect from './WebcamSelect';

import { Paper } from '@material-ui/core';
import { useSpring, config, animated } from 'react-spring';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    '& h1': {
      marginBottom: theme.spacing(2),
    },
    '& p': {
      marginBottom: theme.spacing(1),
    },
  },
}));

const PermissionNeeded = (props) => {
  const classes = useStyles(props);

  const slideProps = useSpring({
    transform: 'translate3d(0,0px,0)',
    from: { transform: 'translate3d(0,-500px,0)' },
    config: config.slow,
  });

  const fadeProps = useSpring({
    to: { opacity: props.permissionDenied ? 1 : 0 },
    config: config.wobbly,
  });

  return (
    <div className={classes.root}>
      <animated.div style={slideProps}>
        <Paper elevation={4} className={classes.paper}>
          <div className={classes.container}>
            {!props.permissionDenied ? (
              <>
                <Typography component="h1" variant="h6">
                  In order to play the game, you must grant permission to access your webcam.
                </Typography>
                <Typography component="p">Please select a camera.</Typography>
                <WebcamSelect />
              </>
            ) : (
              <animated.div style={fadeProps}>
                <Typography component="h1" variant="h6">
                  It looks like you have denied webcam access.
                </Typography>
                <Typography component="p">
                  Please take a look at{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://support.google.com/chrome/answer/2693767"
                  >
                    this article
                  </a>{' '}
                  in order to enable access.
                </Typography>
                <Typography component="p">
                  Once your webcam has been enabled, return here to play the game!
                </Typography>
              </animated.div>
            )}
          </div>
        </Paper>
      </animated.div>
    </div>
  );
};

PermissionNeeded.propTypes = {};

export default PermissionNeeded;
