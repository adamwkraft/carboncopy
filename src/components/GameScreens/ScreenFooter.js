import React from 'react';
import PropTypes from 'prop-types';

import { screenStates } from '../../lib/screenConstants';

import Null from '../Null';
import { maxWidth } from '../../lib/constants';
import { makeStyles } from '@material-ui/styles';
import PracticeFooter from './SinglePlayer/PracticeFooter';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth,
    margin: '0 auto',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const Footers = {
  [screenStates.screen.PLAY]: {
    [screenStates.players.SINGLE_PLAYER]: {
      [screenStates.mode[screenStates.players.SINGLE_PLAYER].PRACTICE]: PracticeFooter,
      [screenStates.mode[screenStates.players.SINGLE_PLAYER].SURVIVAL]: () => 'SURVIVAL footer',
      [screenStates.mode[screenStates.players.SINGLE_PLAYER].TIME_ATTACK]: () =>
        'TIME_ATTACK footer',
    },
    [screenStates.players.MULTIPLAYER]: {
      [screenStates.mode[screenStates.players.MULTIPLAYER].LOCAL]: () => 'LOCAL footer',
      [screenStates.mode[screenStates.players.MULTIPLAYER].REMOTE]: () => 'REMOTE footer',
    },
  },
};

const ScreenFooter = (props) => {
  const classes = useStyles();

  const { screen, players, mode } = props.screen.state;

  const Footer = Footers[screen]?.[players]?.[mode] || Null;

  return (
    <div className={classes.root}>
      <Footer />
    </div>
  );
};

ScreenFooter.propTypes = {
  screen: PropTypes.object.isRequired,
};

export default ScreenFooter;
