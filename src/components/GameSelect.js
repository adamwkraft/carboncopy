import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import React, { useRef, useCallback, useEffect, useState } from 'react';

import { numShippedMasks } from '../lib/constants';

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
          fullWidth={true}
          variant="contained"
          aria-haspopup="true"
          onClick={handleOpen}
          aria-controls="mask-menu"
          disabled={props.disabled}
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
        open={Boolean(anchorEl)}
        container={props.containerRef.current || null}
      >
        {Array.from({ length: numShippedMasks }).map((_, idx) => (
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
  containerRef: PropTypes.object,
  disabled: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default GameSelect;
