import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  masks: {
    padding: theme.spacing(2),
    background: 'rgba(255,255,255,0.5)',
  },
  masksHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  masksList: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-around',
  },
  maskContainer: {
    marginTop: theme.spacing(2),
  },
  imgContainer: {
    width: 200,
    position: 'relative',
    border: '1px solid grey',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(1),
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
  actions: {
    '& > button': {
      marginRight: theme.spacing(1),
      '& :last-of-type': {
        marginRight: 0,
      },
    },
  },
}));

const MasksGrid = (props) => {
  const classes = useStyles();

  const {
    masks,
    onClose,
    title,
    actions,
    actionButtons,
    getDataUri,
    getImageChild,
    getPaperProps,
    PaperProps = {},
  } = props;

  return (
    !!masks?.length && (
      <Paper className={classes.masks} elevation={4}>
        <div className={classes.masksHeader}>
          {typeof title === 'string' ? (
            <Typography variant="h6" component="h3">
              {title}
            </Typography>
          ) : (
            title || null
          )}
          {actions || actionButtons ? (
            <div className={classes.actions}>
              {actionButtons.map(({ Icon, onClick, key }) => (
                <IconButton key={key || onClick} size="small" onClick={onClick}>
                  <Icon />
                </IconButton>
              ))}
            </div>
          ) : (
            onClose && (
              <div className={classes.actions}>
                <IconButton size="small" onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              </div>
            )
          )}
        </div>
        <ul className={classes.masksList}>
          {masks.map((maskItem, i) => {
            const dataUri = getDataUri ? getDataUri(maskItem) : maskItem;
            const paperProps = getPaperProps ? getPaperProps(maskItem, i) : {};

            return (
              <li key={dataUri} className={classes.maskContainer}>
                <Paper
                  elevation={4}
                  className={classes.imgContainer}
                  {...PaperProps}
                  {...paperProps}
                >
                  {getImageChild && getImageChild(maskItem)}
                  <img src={dataUri} className={classes.img} alt={`mask #${i}`} />
                </Paper>
              </li>
            );
          })}
        </ul>
      </Paper>
    )
  );
};

MasksGrid.propTypes = {
  title: PropTypes.node,
  masks: PropTypes.array,
  actions: PropTypes.node,
  onClose: PropTypes.func,
  getDataUri: PropTypes.func,
  PaperProps: PropTypes.object,
  getPaperProps: PropTypes.func,
  getImageChild: PropTypes.func,
  actionButtons: PropTypes.array,
};

export default MasksGrid;
