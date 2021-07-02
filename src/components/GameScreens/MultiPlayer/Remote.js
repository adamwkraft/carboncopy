import React, { useEffect, useMemo } from 'react';
import classnames from 'classnames';
import ProgressBar from '../../ProgressBar';
import { makeStyles } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import IconButton from '@material-ui/core/IconButton';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepConnector from '@material-ui/core/StepConnector';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';

import { useGame, useGameMode } from '../../Game';

import { NUM_MASKS, useRemote } from '../../../hooks/screenHooks/remote';
import { useWebcam } from '../../../context/webcam';
import MultiplayerFooter from './MultiplayerFooter';
import GameInfoBox from '../../GameInfoBox';
import PeerTemp from '../../PeerTemp';
import { useMultiplayerScores } from '../../Main';


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
  idContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bold: {
    fontWeight: 'bold',
    fontSize:18
  }
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
    2: <EmojiPeopleIcon />,
    3: <EmojiPeopleIcon />,
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

const Remote = (props) => {
  const game = useGame();
  const webcam = useWebcam();
  const remote = useGameMode(useRemote);
  const [multiplayerScores] = useMultiplayerScores();

  const stepperLabels = [
    'Capture',
    remote.peerJs.isPlayerOne() ? "You Play" : "They Play",
    remote.peerJs.isPlayerOne() ? "They Play" : "You Play" 
  ];

  const opponentMaskIdx = remote.peerJs.isPlayerOne() ? 1 : 0;
  const hasOpponentMasks = remote.peerJs.masks[opponentMaskIdx].length === NUM_MASKS;
  const isYourTurn = (remote.setupProgress === 1 && remote.peerJs.isPlayerOne()) || (remote.setupProgress === 2 && !remote.peerJs.isPlayerOne())

  useEffect(() => {
    if (!isYourTurn && multiplayerScores[opponentMaskIdx].length === NUM_MASKS && remote.setupProgress < 3) {
      remote.incrementProgress();
    }
  }, [isYourTurn, multiplayerScores, opponentMaskIdx, remote]);

  const text = [
    `${remote.peerJs.myName}, click play to capture ${remote.NUM_MASKS} poses.`,
    remote.peerJs.isPlayerOne()
      ? (hasOpponentMasks
        ? "It's your turn. Press play to start!"
        : "Waiting for opponent's masks"
      ) : `${remote.peerJs.opponentName}'s turn to play.`,
    remote.peerJs.isPlayerOne()
      ? `${remote.peerJs.opponentName}'s turn to play.`
      : (hasOpponentMasks
        ? "It's your turn. Press play to start!"
        : "Waiting for opponent's masks"
      ),
  ][remote.setupProgress];

  const isPlayButtonDisabled = () => {
    if (remote.setupProgress === 0 || remote.setupProgress === 3) return false;

    return !(isYourTurn && hasOpponentMasks);
  };

  // Removing subtext for now. It seems redundant.
  const subtext = '';
  // const subtext = [
  //   'Press the play button to begin.',
  //   remote.peerJs.isPlayerOne() ? 'Press the play button to begin.' : 'You are up next.',
  //   remote.peerJs.isPlayerOne() ? 'Something!!' : 'Press the play button to begin.',
  // ][remote.setupProgress];

  const replayPhase = remote.setupProgress >= 3;

  const winnerText = useMemo(() => {
    if (!replayPhase) return '';
    if (remote.multiplayerScoreSums[0] > remote.multiplayerScoreSums[1]) return 'Player One wins!';
    if (remote.multiplayerScoreSums[0] < remote.multiplayerScoreSums[1]) return 'Player Two wins!';
    return "It's a tie!";
  }, [remote.multiplayerScoreSums, replayPhase]);

  const classes = useStyles(replayPhase);

  const ConnectedGameBox = (
    <GameInfoBox
      headerContent={
        !replayPhase && (
          <Stepper
            className={classes.stepper}
            alternativeLabel
            activeStep={remote.setupProgress}
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
        remote.setupProgress >= 2 &&
        webcam.isFullScreen &&
        !game.loop.looping && <MultiplayerFooter isFullScreen={webcam.isFullScreen} />
      }
      secondaryText={replayPhase ? 'Play again?' : subtext}
      iconProps={{
        color: 'secondary',
        loading: !game.loop.ready,
        onClick: remote.handleClick,
      }}
      Icon={isPlayButtonDisabled() ? null : replayPhase ? 'replay' : 'play'}
      helpContent={
        !replayPhase && [
          'In this game mode two players will compete head to head.',
          'Each player will take turns capturing funky poses for their opponent to try and match.',
          "The player who does the best job matching their opponent's poses will win.",
        ]
      }
    />
  );

  const UnconnectedGameBox = (
    <GameInfoBox
      headerContent={null}
      primaryText={"Connect to a friend to play remotely"}
      middleContent={(
        <div className={classes.idContainer}>
          <span>Your name is: <span className={classes.bold}>{remote.peerJs.peerId}</span></span>
          <CopyToClipboard text={remote.peerJs.peerId}>
            <IconButton aria-label="copy" color="secondary">
              <FileCopyIcon />
            </IconButton>
          </CopyToClipboard>
        </div>
      )}
      secondaryText={<PeerTemp />}
      iconProps={{
        color: 'secondary',
        disabled: true,
        onClick: remote.handleClick,
      }}
      // Icon={'play'}
      // helpContent={[
      //     'Your peer id is: lkjsdlfkjsdlkfjsdlfkj',
      //     'Send this to a friend and have them type it into the box',
      //   ]
      // }
    />
  );

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
            remote.peerJs.isConnected
              ? ConnectedGameBox
              : UnconnectedGameBox
          ) : (
            <div className={classes.progress}>
              <ProgressBar
                color={remote.lapTimeInfo.color}
                completed={remote.lapTimeInfo.percentRemaining}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Remote.propTypes = {};

export default Remote;
