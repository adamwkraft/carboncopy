import PropTypes from 'prop-types';
import classnames from 'classnames';
import React, { memo, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/styles';
import { withStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import BackIcon from '@material-ui/icons/ArrowLeft';
import IconButton from '@material-ui/core/IconButton';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import MuteVolumeIcon from '@material-ui/icons/VolumeMute';

import WebcamSelect from './WebcamSelect';
import { useAudio } from '../context/audio';
import { screenStates } from '../lib/screenConstants';
import { maxWidth } from '../lib/constants';
import { useSpring, config, animated } from 'react-spring';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import stickImage from '../images/stick_figure_in_box.png';

const useStyles = makeStyles((theme) => ({
  btn: {
    border: '2px solid grey',
  },
  back: {
    marginLeft: theme.spacing(2),
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
  volume: {
    marginLeft: theme.spacing(1),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  info: {
    marginLeft: theme.spacing(2),
    width: '34px',
    height: '34px',
  },
  stickImage: {
    width: '100%',
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
}))(MuiDialogContent);

const GlobalHeader = (props) => {
  const classes = useStyles();
  const audio = useAudio();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const onHomeScreen = props.screen === screenStates.screen.DEFAULT;
  const styleProps = useSpring({ to: { opacity: !onHomeScreen ? 1 : 0 }, config: config.stiff });

  return (
    <div className={classes.options}>
      <div>
        {!onHomeScreen && (
          <animated.div style={styleProps}>
            <IconButton className={classes.btn} size="small" onClick={props.goHome}>
              <HomeIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={props.goBack}
              className={classnames(classes.btn, classes.back)}
            >
              <BackIcon />
            </IconButton>
            <IconButton
              size="small"
              className={classnames(classes.btn, classes.info)}
              onClick={() => {
                setOpen(true);
              }}
            >
              <b>i</b>
            </IconButton>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
              <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                Set Up
              </DialogTitle>
              <DialogContent dividers>
                <Typography gutterBottom>
                  Place your webcam at a distance and ensure there is enough space around you to
                  move safely.
                </Typography>
                <img src={stickImage} className={classes.stickImage} alt="Stick Figure" />
              </DialogContent>
            </Dialog>
          </animated.div>
        )}
      </div>
      <div className={classes.right}>
        <WebcamSelect />
        <IconButton className={classes.volume} size="small" onClick={audio.handlers.toggle}>
          {audio.state ? <MuteVolumeIcon /> : <VolumeOffIcon />}
        </IconButton>
      </div>
    </div>
  );
};

GlobalHeader.propTypes = {
  mode: PropTypes.string,
  screen: PropTypes.string,
  goHome: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
};

export default memo(GlobalHeader);
