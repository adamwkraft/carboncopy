import PropTypes from 'prop-types';
import React, { memo } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/styles';

import IconButton from '@material-ui/core/IconButton';
import { maxWidth } from '../lib/constants';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import HeaderButtonGroup from './HeaderButtonGroup';
import HelpDialog from './HelpDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    width: '100%',
    maxWidth,
    display: 'flex',
    margin: '0 auto',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  ever: {
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
}));

const GlobalHeader = (props) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.root}>
        <div className={classes.left}></div>
        <HeaderButtonGroup controller={props.controller} />
      </div>
      <HelpDialog open={props.controller.helpOpen} handleClose={props.controller.closeHelp} />
    </>
  );
};

GlobalHeader.propTypes = {
  controller: PropTypes.object.isRequired,
};

export default memo(GlobalHeader);
