import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { makeStyles } from '@material-ui/styles';
import BackIcon from '@material-ui/icons/ArrowLeft';
import HomeIcon from '@material-ui/icons/Home';
import MuteVolumeIcon from '@material-ui/icons/VolumeMute';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import classnames from 'classnames';

import WebcamSelect from './WebcamSelect';
import IconButton from '@material-ui/core/IconButton';
import { screenStates } from '../lib/screenConstants';
import { useAudio } from '../context/audio';

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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 1600,
    margin: '0 auto',
  },
  right: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  volume: {
    marginLeft: theme.spacing(1),
  },
}));

const GlobalHeader = (props) => {
  const classes = useStyles();
  const audio = useAudio();

  if (props.screen === screenStates.screen.DEFAULT) return null;

  return (
    <div className={classes.options}>
      <div>
        <IconButton className={classes.btn} size="small" onClick={props.goHome}>
          <HomeIcon />
        </IconButton>
        {props.mode && (
          <IconButton
            className={classnames(classes.btn, classes.back)}
            size="small"
            onClick={props.goBack}
          >
            <BackIcon />
          </IconButton>
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
