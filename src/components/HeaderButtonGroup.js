import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import BackIcon from '@material-ui/icons/ArrowLeft';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';

import WebcamSelect from './WebcamSelect';
import { useSpring, config, animated } from 'react-spring';

import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import HeaderButton from './HeaderButton';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& > *': {
      marginLeft: theme.spacing(1),
    },
  },
}));

const HeaderButtonGroup = (props) => {
  const classes = useStyles();

  const {
    controller: { onHomeScreen, handleBack, toggleAudio, audioState, openHelp },
  } = props;
  const styleProps = useSpring({ to: { opacity: !onHomeScreen ? 1 : 0 }, config: config.stiff });

  console.log({ fs: props.isFullScreen });

  return (
    <div className={classes.root}>
      {!onHomeScreen && (
        <animated.div style={styleProps}>
          <HeaderButton onClick={handleBack} Icon={BackIcon} />
        </animated.div>
      )}
      {!props.isFullScreen && <WebcamSelect />}
      <HeaderButton onClick={toggleAudio} Icon={audioState ? VolumeUpIcon : VolumeOffIcon} />
      {!props.isFullScreen && <HeaderButton onClick={openHelp} Icon={ContactSupportIcon} />}
    </div>
  );
};

HeaderButtonGroup.propTypes = {
  controller: PropTypes.object.isRequired,
};

export default HeaderButtonGroup;
