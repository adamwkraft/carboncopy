export const types = {
  SET_SCREEN: 'set_screen',
  SET_PLAYER_MODE: 'set_player_mode',
  SET_GAME_MODE: 'set_game_mode',
  RESET: 'reset_state',
};

const SINGLE_PLAYER = 'Single Player';
const MULTIPLAYER = 'Multi Player';

export const gameStates = {
  screen: {
    DEFAULT: 'start',
    PLAY: 'play',
  },
  players: {
    SINGLE_PLAYER,
    MULTIPLAYER,
    DEFAULT: null,
  },
  mode: {
    [SINGLE_PLAYER]: {
      PRACTICE: 'Practice',
      SURVIVAL: 'Survival',
      TIME_ATTACK: 'Time Attack',
    },
    [MULTIPLAYER]: {
      LOCAL: 'Local Multiplayer',
      REMOTE: 'Remote Multiplayer',
    },
    DEFAULT: null,
  },
};

// identifies these values as works in progress, ie disabled buttons
export const wip = [
  gameStates.players.MULTIPLAYER,
  gameStates.mode[SINGLE_PLAYER].SURVIVAL,
  gameStates.mode[SINGLE_PLAYER].TIME_ATTACK,
  gameStates.mode[MULTIPLAYER].LOCAL,
  gameStates.mode[MULTIPLAYER].REMOTE,
].reduce((acc, item) => ({ ...acc, [item]: !!1 }), {});

export const gameStatesArrays = Object.entries(gameStates).reduce(
  (acc, [stateKey, statesObj]) => ({
    ...acc,
    [stateKey]:
      stateKey !== 'mode'
        ? Object.values(statesObj).filter((_) => _)
        : Object.entries(statesObj).reduce(
            (modeAcc, [playerModeKey, playerModesObj]) => ({
              ...modeAcc,
              [playerModeKey]: playerModesObj === null ? null : Object.values(playerModesObj), // check for the default: null thing and get rid of it
            }),
            {},
          ),
  }),
  {},
);

export const initialState = {
  screen: gameStates.screen.DEFAULT,
  mode: gameStates.mode.DEFAULT,
  players: gameStates.players.DEFAULT,
};
