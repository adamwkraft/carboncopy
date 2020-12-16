import React from 'react';
import PropTypes from 'prop-types';

import DefaultHeader from '../DefaultHeader';
import { screenStates } from '../../lib/screenConstants';

const Headers = {
  [screenStates.screen.DEFAULT]: {
    [screenStates.players.DEFAULT]: null,
  },
  [screenStates.screen.PLAY]: {
    [screenStates.players.SINGLE_PLAYER]: null,
    [screenStates.players.MULTIPLAYER]: null,
  },
};

const ScreenHeader = (props) => {
  const { screen, players } = props.screenState;

  const HeaderContent = Headers[screen]?.[players] || DefaultHeader;

  return (
    <header>
      <HeaderContent />
    </header>
  );
};

ScreenHeader.propTypes = {
  screenState: PropTypes.object.isRequired,
};

export default ScreenHeader;
