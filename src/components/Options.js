import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
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
      minWidth: 150,
    },
  },
}));

const Options = (props) => {
  const classes = useStyles();
  const trail = useTrail(props.buttons.length, {
    transform: 'translate3d(0,0px,0)',
    from: { transform: 'translate3d(0,-100px,0)' },
    config: config.stiff,
  });

  return (
    <div className={classes.root}>
      {trail.map((styleProps, idx) => {
        const { Component, visible = true, props: componentProps = {} } = props.buttons[idx];

        return visible ? (
          <animated.div key={componentProps.key} style={styleProps}>
            {Component ? (
              <Component {...componentProps} />
            ) : (
              <Button color="primary" variant="contained" {...componentProps} />
            )}
          </animated.div>
        ) : null;
      })}
    </div>
  );
};

export default Options;
