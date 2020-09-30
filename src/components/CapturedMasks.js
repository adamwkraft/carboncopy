import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import React, { useMemo, useCallback } from 'react';

import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import MasksGrid from './MasksGrid';

const useStyles = makeStyles((theme) => ({
  removeMask: {
    top: 0,
    left: 0,
    bottom: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    transition: 'all 100ms',
    justifyContent: 'center',
    '&:hover': {
      '& > button': {
        display: 'inherit',
      },
    },
  },
  iconBtn: {
    display: 'none',
    color: 'black',
    backgroundColor: 'rgba(255,255,255,0.5)',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.75)',
    },
    '&:active, &:focused': {
      backgroundColor: 'rgba(255,255,255,0.9)',
    },
  },
}));

const CapturedMasks = (props) => {
  const classes = useStyles();

  const { captureMasks, handlePlay } = props;

  const actionButtons = useMemo(
    () => [
      {
        key: 'play',
        Icon: PlayIcon,
        onClick: handlePlay,
      },
      {
        key: 'download',
        Icon: DownloadIcon,
        onClick: captureMasks.downloadMasks,
      },
      {
        key: 'clear',
        Icon: CloseIcon,
        onClick: captureMasks.removeAllMasks,
      },
    ],
    [captureMasks.downloadMasks, captureMasks.removeAllMasks, handlePlay],
  );

  const getDataUri = useCallback(({ binary: dataUri }) => dataUri, []);

  const getImageChild = useCallback(
    (maskItem, i) => (
      <div className={classes.removeMask}>
        <IconButton name={i} className={classes.iconBtn} onClick={captureMasks.removeMask}>
          <DeleteForeverIcon fontSize="large" />
        </IconButton>
      </div>
    ),
    [captureMasks.removeMask, classes.removeMask, classes.iconBtn],
  );

  return (
    <MasksGrid
      title="Candidate Masks"
      getDataUri={getDataUri}
      masks={captureMasks.masks}
      actionButtons={actionButtons}
      getImageChild={getImageChild}
    />
  );
};

CapturedMasks.propTypes = {
  handlePlay: PropTypes.func,
  captureMasks: PropTypes.object.isRequired,
};

export default CapturedMasks;
