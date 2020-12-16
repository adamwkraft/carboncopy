import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';

import { maxWidth } from '../lib/constants';
import HeaderButtonGroup from './HeaderButtonGroup';
import HelpDialog from './HelpDialog';
import carbonCopy from '../images/logo512.png';

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
  title: {
    display: 'flex',
    alignItems: 'center',
    '& > img': {
      width: 34,
      marginRight: theme.spacing(1),
    },
    '& > h1': {},
  },
}));

const GlobalHeader = (props) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.root}>
        <div className={classes.title}>
          <img src={carbonCopy} alt="Carbon Copy Logo" />
          <Typography variant="h4" component="h1">
            Carbon Copy
          </Typography>
        </div>
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
