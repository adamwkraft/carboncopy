import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CloseIcon from '@material-ui/icons/Close';
import PublishIcon from '@material-ui/icons/Publish';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import MasksGrid from './MasksGrid';
import { useMemo } from 'react';
import { useCallback } from 'react';

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

const CandidateMasks = (props) => {
  const classes = useStyles();

  const { captureMasks, setMasks } = props;

  const actionButtons = useMemo(
    () => [
      {
        onClick: setMasks,
        Icon: PublishIcon,
      },
      {
        onClick: captureMasks.downloadMasks,
        Icon: DownloadIcon,
      },
      {
        onClick: captureMasks.removeAllMasks,
        Icon: CloseIcon,
      },
    ],
    [captureMasks.downloadMasks, captureMasks.removeAllMasks, setMasks],
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
      masks={captureMasks.masks}
      title="Candidate Masks"
      actionButtons={actionButtons}
      getDataUri={getDataUri}
      getImageChild={getImageChild}
    />
  );
};

CandidateMasks.propTypes = {
  setMasks: PropTypes.func.isRequired,
  captureMasks: PropTypes.object.isRequired,
};

export default CandidateMasks;
