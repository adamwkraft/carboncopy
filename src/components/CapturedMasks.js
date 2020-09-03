import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CloseIcon from '@material-ui/icons/Close';
import PublishIcon from '@material-ui/icons/Publish';
import DownloadIcon from '@material-ui/icons/CloudDownload';

const useStyles = makeStyles((theme) => ({
  masks: {
    padding: theme.spacing(1),
    background: 'rgba(255,255,255,0.5)',
  },
  masksHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
  masksList: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-around',
  },
  imgContainer: {
    width: 200,
    background: 'black',
    padding: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
    position: 'relative',
    '&:hover': {
      '& > div': {
        background: 'rgba(255,0,0,0.65)',
      },
    },
  },
  img: {
    width: '100%',
    background: 'rgba(0,0,0,0)',
  },
  removeMask: {
    display: 'flex',
    transition: 'all 100ms',
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
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
  icons: {
    '& > button': {
      marginRight: theme.spacing(1),
      '& :last-of-type': {
        marginRight: 0,
      },
    },
  },
}));

const CapturedMasks = (props) => {
  const classes = useStyles();

  const { captureMasks, setMasks } = props;

  return (
    !!captureMasks.masks.length && (
      <>
        <Paper className={classes.masks} elevation={2}>
          <div className={classes.masksHeader}>
            <Typography variant="h6" component="h3">
              Candidate Masks
            </Typography>
            <div className={classes.icons}>
              <IconButton size="small" onClick={setMasks}>
                <PublishIcon />
              </IconButton>
              <IconButton size="small" onClick={captureMasks.downloadMasks}>
                <DownloadIcon />
              </IconButton>
              <IconButton size="small" onClick={captureMasks.removeAllMasks}>
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          <ul className={classes.masksList}>
            {captureMasks.masks.map(({ binary: dataUri }, i) => (
              <li className={classes.imgContainer} key={dataUri}>
                <div className={classes.removeMask}>
                  <IconButton
                    name={i}
                    className={classes.iconBtn}
                    onClick={captureMasks.removeMask}
                  >
                    <DeleteForeverIcon fontSize="large" />
                  </IconButton>
                </div>
                <img src={dataUri} className={classes.img} alt={`mask #${i}`} />
              </li>
            ))}
          </ul>
        </Paper>
      </>
    )
  );
};

CapturedMasks.propTypes = {
  setMasks: PropTypes.func.isRequired,
  captureMasks: PropTypes.object.isRequired,
};

export default CapturedMasks;
