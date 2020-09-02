import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';

import FileUpload from '../../FileUpload';
import GameSelect from '../../GameSelect';
import CapturedMasks from '../../CapturedMasks';
import ProgressBar from '../../ProgressBar';
import ScoreResults from '../../ScoreResults';

const useStyles = makeStyles((theme) => ({
  root: {
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
  options: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
    '& > *': {
      marginTop: theme.spacing(2),
      minWidth: 150,
    },
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
}));

const Practice = (props) => {
  const classes = useStyles();

  const {
    loop,
    simpleGame,
    captureMasks,
    handleClickGame,
    handleClickCaptureMasks,
  } = props.game.mode.practice;

  return (
    <div
      className={classnames(classes.root, {
        [classes.overlay]: !loop.looping,
        [classes.rootTop]: !!loop.looping,
        [classes.rootApart]:
          !!(simpleGame.scores?.length || captureMasks.masks?.length) && props.webcam.isFullScreen,
      })}
    >
      <div
        className={classnames(classes.options, {
          [classes.optionsTop]: !!loop.looping,
        })}
      >
        <Button
          color="primary"
          variant="contained"
          onClick={handleClickGame}
          disabled={!loop.ready || (!loop.looping && !simpleGame.ready)}
        >
          {loop.looping ? 'Stop' : 'Play'}
        </Button>
        {!loop.looping ? (
          <>
            <GameSelect
              value={simpleGame.selectedMasks}
              disabled={!loop.ready || loop.looping}
              handleClick={simpleGame.handleLoadShippedMasks}
            />
            <FileUpload
              variant="contained"
              onChange={simpleGame.handleLoadUserMasks}
              disabled={!loop.ready || loop.looping || simpleGame.loading}
            >
              {simpleGame.loading ? 'Loading...' : 'Load Masks'}
            </FileUpload>
            <Button
              variant="contained"
              onClick={handleClickCaptureMasks}
              disabled={!loop.ready || loop.looping}
            >
              Capture Masks
            </Button>
          </>
        ) : (
          <div>
            <ProgressBar bgcolor="#00695c" completed={100 - simpleGame.progressPercent} />
          </div>
        )}
      </div>
      {props.webcam.isFullScreen && !loop.looping && (
        <div className={classes.captures}>
          <ScoreResults results={simpleGame.scores} handleClose={simpleGame.clearScores} />
          <CapturedMasks captureMasks={captureMasks} />
        </div>
      )}
    </div>
  );
};

Practice.propTypes = {
  game: PropTypes.object.isRequired,
  webcam: PropTypes.object.isRequired,
};

export default Practice;
