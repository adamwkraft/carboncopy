import PropTypes from 'prop-types';
import React from 'react';
import { makeStyles } from '@material-ui/styles';
import classnames from 'classnames';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
  btn: {
    border: `2px solid ${theme.palette.secondary.main}`,
    background: theme.palette.primary.main,
    color: theme.palette.secondary.main,
    transition: '300ms all',
    '&:hover': {
      border: `2px solid ${theme.palette.primary.main}`,
      background: theme.palette.secondary.main,
      color: theme.palette.primary.main,
    },
  },
}));

const HeaderButton = ({ Icon, className, ...props }) => {
  const classes = useStyles();

  return (
    <IconButton
      size="small"
      className={classnames(classes.btn, { [className]: className })}
      {...props}
    >
      <Icon />
    </IconButton>
  );
};

HeaderButton.propTypes = {
  Icon: PropTypes.object.isRequired,
};

export default HeaderButton;
