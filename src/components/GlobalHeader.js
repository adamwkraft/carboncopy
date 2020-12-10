import PropTypes from 'prop-types';
import classnames from 'classnames';
import React, { memo, useState, useCallback } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/styles';
import BackIcon from '@material-ui/icons/ArrowLeft';
import IconButton from '@material-ui/core/IconButton';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';

import WebcamSelect from './WebcamSelect';
import { useAudio } from '../context/audio';
import { screenStates } from '../lib/screenConstants';
import { maxWidth } from '../lib/constants';
import { useSpring, config, animated } from 'react-spring';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';

const useStyles = makeStyles((theme) => ({
  btn: {
    border: '2px solid grey',
    marginLeft: theme.spacing(1),
  },
  back: {
    marginRight: theme.spacing(1),
  },
  options: {
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    width: '100%',
    maxWidth,
    display: 'flex',
    margin: '0 auto',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  ever: {
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
}));

const GlobalHeader = (props) => {
  const classes = useStyles();
  const audio = useAudio();
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
    props.tutorial.markTutorialCompleted();
  }, [props.tutorial]);

  const onHomeScreen = props.screen === screenStates.screen.DEFAULT;
  const styleProps = useSpring({ to: { opacity: !onHomeScreen ? 1 : 0 }, config: config.stiff });

  return (
    <>
      <div className={classes.options}>
        <div className={classes.left}></div>
        <div className={classes.right}>
          {!onHomeScreen && (
            <animated.div style={styleProps}>
              <IconButton
                size="small"
                className={classnames(classes.btn, classes.back)}
                onClick={
                  props.players === screenStates.players.MULTIPLAYER ? props.goHome : props.goBack
                }
              >
                <BackIcon />
              </IconButton>
            </animated.div>
          )}
          <WebcamSelect />
          <IconButton
            className={classnames(classes.btn, classes.volume)}
            size="small"
            onClick={audio.handlers.toggle}
          >
            {audio.state ? <VolumeUpIcon /> : <VolumeOffIcon />}
          </IconButton>
          <IconButton
            size="small"
            className={classnames(classes.btn)}
            onClick={() => {
              setOpen(true);
            }}
          >
            <ContactSupportIcon />
          </IconButton>
        </div>
      </div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="information"
        open={open || !props.tutorial.completed}
        className={classes.dialogRoot}
      >
        <MuiDialogTitle disableTypography id="information">
          <Typography variant="h5">Carbon Copy Fun!</Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </MuiDialogTitle>
        <MuiDialogContent dividers className={classes.dialogContent}>
          <Typography component="h2" variant="h6">
            Setup
          </Typography>
          <Typography gutterBottom>
            Place your webcam so that your entire body fits within the frame, and ensure there is
            enough space around you to move safely.
          </Typography>
          <Typography gutterBottom>
            Be prepared to run side to side, forward and back, and even to jump and crouch.
          </Typography>
          <Typography component="h2" variant="h6">
            Performance
          </Typography>
          <Typography gutterBottom>
            This game relies on state-of-the-art computer vision algorithms in order to detect the
            location of your body. This requires significant compute power. Don't be afraid if you
            hear your computer fan turn on. Trust that it's trying its hardest to deliver you the
            best game possible.
          </Typography>
          <Typography component="h2" variant="h6">
            Privacy
          </Typography>
          <Typography gutterBottom>
            Although this game requires your webcam to function, no personal images or data are
            collected by this application. <span className={classes.ever}>Ever!</span>
          </Typography>
        </MuiDialogContent>
      </Dialog>
    </>
  );
};

GlobalHeader.propTypes = {
  mode: PropTypes.string,
  screen: PropTypes.string,
  goHome: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  tutorial: PropTypes.object.isRequired,
};

export default memo(GlobalHeader);
