import PropTypes from 'prop-types';
import classnames from 'classnames';
import React, { memo } from 'react';
import { makeStyles } from '@material-ui/styles';

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
}));

const GlobalHeader = (props) => {
  const classes = useStyles();
  const audio = useAudio();

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
