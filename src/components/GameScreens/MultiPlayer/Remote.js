import React, { useMemo } from 'react';
import classnames from 'classnames';
import ProgressBar from '../../ProgressBar';
import { makeStyles } from '@material-ui/core';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepConnector from '@material-ui/core/StepConnector';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';

import { useGame, useGameMode } from '../../Game';

import { useLocal } from '../../../hooks/screenHooks/local';
import { useWebcam } from '../../../context/webcam';
import MultiplayerFooter from './MultiplayerFooter';
import GameInfoBox from '../../GameInfoBox';
import { useSocketHandler } from '../../../context/socketHandler';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  scrollContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: -17,
    overflowY: 'scroll',
    padding: theme.spacing(1),
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  overlay: {
    background: 'rgba(255,255,255,0.5)',
  },
  rootTop: {
    justifyContent: 'flex-start',
  },
  rootApart: {
    justifyContent: 'space-between',
  },
  optionsTop: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(10),
  },
  progress: {
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(8),
    right: theme.spacing(8),
  },
  container: {
    textAlign: 'center',
  },
  stepper: {
    background: 'transparent',
    marginBottom: theme.spacing(2),
  },
}));

const useColorlibStepIconStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundImage: `linear-gradient( 136deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.secondary.dark} 100%)`,
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundImage: `linear-gradient( 136deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.secondary.dark} 100%)`,
  },
}));

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <CameraAltIcon />,
    2: <CameraAltIcon />,
    3: <EmojiPeopleIcon />,
    4: <EmojiPeopleIcon />,
  };

  return (
    <div
      className={classnames(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

const stepperLabels = [
  'Player One Capture',
  'Player Two Capture',
  'Player One Play',
  'Player Two Play',
];

const Local = (props) => {
  const game = useGame();
  const local = useGameMode(useLocal);
  const webcam = useWebcam();

  const [primary, secondary] = [
    ['One', 'Two'],
    ['Two', 'One'],
  ][local.setupProgress % 2];

  const text =
    local.setupProgress < 2
      ? `Player ${primary}, get ready to capture ${local.NUM_MASKS} poses.`
      : `Player ${primary}, get ready to play!`;

  const subtext =
    local.setupProgress < 2 ? `Player ${secondary}, please leave the room.` : `Good luck!`;

  const replayPhase = local.setupProgress >= 4;

  const winnerText = useMemo(() => {
    if (!replayPhase) return '';
    if (local.multiplayerScoreSums[0] > local.multiplayerScoreSums[1]) return 'Player One wins!';
    if (local.multiplayerScoreSums[0] < local.multiplayerScoreSums[1]) return 'Player Two wins!';
    return "It's a tie!";
  }, [local.multiplayerScoreSums, replayPhase]);

  const classes = useStyles(replayPhase);

  const socketHandler = useSocketHandler();

  return (
    <div className={classes.root}>
      <div
        className={classnames(classes.scrollContainer, {
          [classes.overlay]: !game.loop.looping,
          [classes.rootTop]: false,
          [classes.rootApart]: !!false,
        })}
      >
        <div
          className={classnames(classes.container, {
            [classes.optionsTop]: !!game.loop.looping,
          })}
        >
          {!game.loop.looping ? (
            <GameInfoBox
              headerContent={
                !replayPhase && (
                  <Stepper
                    className={classes.stepper}
                    alternativeLabel
                    activeStep={local.setupProgress}
                    connector={<StepConnector />}
                  >
                    {stepperLabels.map((label) => (
                      <Step key={label}>
                        <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                )
              }
              primaryText={replayPhase ? winnerText : text}
              middleContent={
                local.setupProgress >= 3 &&
                webcam.isFullScreen &&
                !game.loop.looping && <MultiplayerFooter isFullScreen={webcam.isFullScreen} />
              }
              secondaryText={replayPhase ? 'Play again?' : subtext}
              iconProps={{
                color: 'secondary',
                loading: !game.loop.ready,
                onClick: local.handleClick,
              }}
              Icon={replayPhase ? 'replay' : 'play'}
              helpContent={
                !replayPhase && [
                  'In this game mode two players will compete head to head.',
                  'Each player will take turns capturing funky poses for their opponent to try and match.',
                  "The player who does the best job matching their opponent's poses will win.",
                ]
              }
            />
          ) : (
            <div className={classes.progress}>
              <ProgressBar
                color={local.lapTimeInfo.color}
                completed={local.lapTimeInfo.percentRemaining}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Local.propTypes = {};

export default Local;
