import React from 'react';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { useRef } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  item: (width) => ({
    minWidth: width - theme.spacing(4),
    textAlign: 'center',
  }),
}));

const GameSelect = (props) => {
  const [width, setWidth] = useState(0);
  const classes = useStyles(width);

  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.clientWidth);
    }
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleClick = useCallback(
    (name) => () => {
      props.handleClick(name);
      handleClose();
    },
    [props, handleClose],
  );

  return (
    <>
      <div ref={ref}>
        <Button
          aria-controls="mask-menu"
          aria-haspopup="true"
          onClick={handleOpen}
          variant="contained"
          disabled={props.disabled}
          fullWidth={true}
        >
          Select Masks
        </Button>
      </div>
      <Menu
        id="mask-menu"
        keepMounted={true}
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={handleClose}
        container={ref.current}
        open={Boolean(anchorEl)}
      >
        {Array.from({ length: 3 }).map((_, idx) => (
          <MenuItem key={idx} button={true} onClick={handleClick(`set${idx + 1}.zip`)}>
            <span className={classes.item}>Game {idx + 1}</span>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

GameSelect.propTypes = {
  value: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default GameSelect;
