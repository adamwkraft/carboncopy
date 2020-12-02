import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';

import { CircularProgress, makeStyles } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import HelpIcon from '@material-ui/icons/Help';
import ReplayIcon from '@material-ui/icons/Replay';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'relative',
    padding: theme.spacing(1),
    paddingRight: theme.spacing(5),
    paddingLeft: theme.spacing(5),
    background: 'rgba(255,255,255,0.95)',
    marginTop: theme.spacing(2),
    '& h2': {
      marginBottom: theme.spacing(4),
    },
    '& h3': {
      marginBottom: theme.spacing(1),
    },
  },
  help: {
    maxHeight: 200,
    marginTop: theme.spacing(2),
    '& > div > p': {
      marginBottom: theme.spacing(1),
      fontSize: 16,
    },
  },
  helpBtn: {
    position: 'absolute',
    bottom: theme.spacing(1),
    right: theme.spacing(1),
  },
  icon: {
    fontSize: 50,
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
}));

const GameInfoBox = ({
  headerContent,
  middleContent,
  footerContent,
  primaryText,
  secondaryText,
  helpContent,
  iconProps: { loading: isLoading, ...iconProps } = {},
  Icon,
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const toggleHelp = useCallback(() => {
    setShowHelp((a) => !a);
  }, []);

  const classes = useStyles();

  const IconComponent = useMemo(
    () => (isLoading ? CircularProgress : { play: PlayIcon, replay: ReplayIcon }[Icon] || Icon),
    [Icon, isLoading],
  );

  return (
    <Paper className={classes.paper}>
      {headerContent}
      {primaryText && (
        <Typography component="h3" variant="h5">
          {primaryText}
        </Typography>
      )}
      {middleContent}
      {secondaryText && (
        <Typography
          component="h4"
          variant="h6"
          className={classNames(classes.subtext, {
            [classes.marginTop]: middleContent,
          })}
        >
          {secondaryText}
        </Typography>
      )}
      {IconComponent && (
        <IconButton className={classes.play} size="medium" disabled={isLoading} {...iconProps}>
          <IconComponent className={classes.icon} color={iconProps.color || 'primary'} />
        </IconButton>
      )}
      {footerContent}
      {helpContent && (
        <div className={classes.help}>
          {showHelp && <div className={classes.helpContent}>{helpContent}</div>}
          <IconButton size="small" className={classes.helpBtn} onClick={toggleHelp}>
            <HelpIcon />
          </IconButton>
        </div>
      )}
    </Paper>
  );
};

GameInfoBox.propTypes = {
  headerContent: PropTypes.node,
  primaryText: PropTypes.string,
  secondaryText: PropTypes.string,
  children: PropTypes.node,
  helpContent: PropTypes.node,
  footerContent: PropTypes.node,
  iconProps: PropTypes.object,
  Icon: PropTypes.node,
};

export default GameInfoBox;
