import classnames from 'classnames';
import React, { useRef, useMemo } from 'react';
import { makeStyles } from '@material-ui/core';

import Options from '../../Options';
import FileUpload from '../../FileUpload';
import GameSelect from '../../GameSelect';
import ProgressBar from '../../ProgressBar';
import ScoreResults from '../../ScoreResults';
import CapturedMasks from '../../CapturedMasks';

import { useGame, useGameMode } from '../../Game';
import { useWebcam } from '../../../context/webcam';
import { usePractice } from '../../../hooks/screenHooks/practice';

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
  captures: {
    width: '100%',
    '& > div': {
      marginTop: theme.spacing(1),
    },
  },
  progress: {
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(8),
    right: theme.spacing(8),
  },
}));

const Practice = (props) => {
  const classes = useStyles();

  const game = useGame();
  const webcam = useWebcam();
  const containerRef = useRef();
  const practice = useGameMode(usePractice);

  const {
    loopType,
    lapTimeInfo,
    simpleGame,
    captureMasks,
    handleClickGame,
    handleStartRandomGame,
    handlePlayCapturedMasks,
    handleClickCaptureMasks,
  } = practice;

  const { loop } = game;

  const timerColor = lapTimeInfo.color;

  const buttons = useMemo(
    () => [
      {
        props: {
          key: 'play/stop',
          onClick: handleClickGame,
          disabled: !loop.ready || (!loop.looping && !simpleGame.ready),
          children: loop.looping ? 'Stop' : 'Play',
        },
      },
      {
        props: {
          key: 'playRandom',
          color: 'secondary',
          onClick: handleStartRandomGame,
          disabled: !loop.ready || loop.looping,
          children: 'Play Random',
        },
      },
      {
        props: {
          containerRef,
          key: 'chooseMasks',
          disabled: !loop.ready || loop.looping,
          handleClick: simpleGame.zip.handleLoadPreparedMasks,
        },
        Component: GameSelect,
        visible: !loop.looping,
      },
      {
        props: {
          key: 'loadMasks',
          variant: 'contained',
          onChange: simpleGame.zip.handleZipInputChange,
          disabled: !loop.ready || loop.looping || simpleGame.zip.loading,
          children: simpleGame.loading ? 'Loading...' : 'Load Masks',
        },
        Component: FileUpload,
        visible: !loop.looping,
      },
      {
        props: {
          key: 'captureMasks',
          onClick: handleClickCaptureMasks,
          disabled: !loop.ready || loop.looping,
          children: 'Capture Masks',
          color: 'default',
        },
        visible: !loop.looping,
      },
    ],
    [
      loop.ready,
      loop.looping,
      handleClickGame,
      simpleGame.ready,
      simpleGame.loading,
      handleStartRandomGame,
      simpleGame.zip.loading,
      handleClickCaptureMasks,
      simpleGame.zip.handleZipInputChange,
      simpleGame.zip.handleLoadPreparedMasks,
    ],
  );

  return (
    <div className={classes.root}>
      <div
        className={classnames(classes.scrollContainer, {
          [classes.overlay]: !loop.looping,
          [classes.rootTop]: !!loop.looping,
          [classes.rootApart]:
            !!(simpleGame.scores?.length || captureMasks.masks?.length) && webcam.isFullScreen,
        })}
      >
        <div
          className={classnames({
            [classes.optionsTop]: !!loop.looping,
          })}
          ref={containerRef}
        >
          {loop.looping ? (
            <Options
              offset={70}
              buttons={[
                {
                  props: {
                    key: 'stop',
                    onClick: handleClickGame,
                    children: 'Stop',
                  },
                },
              ]}
            />
          ) : (
            <Options buttons={buttons} />
          )}
          {loop.looping && loopType === 'play' && (
            <div className={classes.progress}>
              <ProgressBar color={timerColor} completed={lapTimeInfo.percentRemaining} />
            </div>
          )}
        </div>
        {webcam.isFullScreen && !loop.looping && (
          <div className={classes.captures}>
            <ScoreResults results={simpleGame.scores} handleClose={simpleGame.clearScores} />
            <CapturedMasks captureMasks={captureMasks} handlePlay={handlePlayCapturedMasks} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice;
