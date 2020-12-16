import React from 'react';
import classnames from 'classnames';
import Button from '@material-ui/core/Button';
import { IconButton, makeStyles, Typography } from '@material-ui/core';
import { animated, useTrail, config } from 'react-spring';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
    '& > div > *': {
      marginTop: theme.spacing(2),
    },
  },
  buttons: {
    display: 'flex',
  },
  h: {
    flexDirection: 'row',
  },
  v: {
    flexDirection: 'column',
  },
  minWidth: {
    minWidth: 150,
  },
  label: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    background: theme.palette.secondary.main,
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    border: `${theme.spacing(0.4)}px solid ${theme.palette.primary.main}`,
  },
  icon: {
    fontSize: 100,
    border: `${theme.spacing(0.4)}px solid ${theme.palette.secondary.main}`,
    borderRadius: '50%',
    padding: theme.spacing(1),
    background: theme.palette.primary.main,
    color: 'black',
    transition: '300ms all',
    '&:hover': {
      border: `${theme.spacing(0.4)}px solid ${theme.palette.primary.main}`,
      background: theme.palette.secondary.main,
      color: theme.palette.primary.main,
    },
  },
}));

const getConfig = (offset) => ({
  transform: 'translate3d(0,0px,0)',
  from: { transform: `translate3d(0,-${offset}px,0)` },
  config: config.wobbly,
});

const Options = (props) => {
  const classes = useStyles();
  const trail = useTrail(props.buttons.length, getConfig(props.offset || 100));
  const labelTrail = useTrail(1, getConfig((props.offset || 100) + 200));

  return (
    <div className={classes.root}>
      {props.label &&
        labelTrail.map((styleProps, idx) => (
          <animated.div style={styleProps}>
            <Typography component="h2" variant="h5" className={classes.label}>
              {props.label}
            </Typography>
          </animated.div>
        ))}
      <div
        className={classnames(classes.buttons, {
          [classes.h]: props.layout === 'h',
          [classes.v]: props.layout !== 'h',
        })}
      >
        {trail.map((styleProps, idx) => {
          const {
            Component,
            visible = true,
            props: { Icon, ...componentProps } = {},
          } = props.buttons[idx];

          return visible ? (
            <animated.div key={componentProps.key} style={styleProps}>
              {Component ? (
                <Component {...componentProps} />
              ) : Icon ? (
                <IconButton
                  size="large"
                  variant="contained"
                  className={classes.iconButton}
                  {...componentProps}
                >
                  <Icon className={classes.icon} />
                </IconButton>
              ) : (
                <Button
                  color="secondary"
                  variant="contained"
                  {...componentProps}
                  className={classes.minWidth}
                />
              )}
            </animated.div>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default Options;
