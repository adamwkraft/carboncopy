import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import React, { useMemo, useCallback, useState } from 'react';

import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const noop = () => {};

const useStyles = makeStyles((theme) => ({
  root: (props) => ({
    position: 'relative',
  }),
  arrowIcon: (props) => ({
    marginLeft: theme.spacing(1),
  }),
  tooltip: (props) => ({
    position: 'relative',
    margin: 0,
  }),
  arrow: (props) => ({
    position: 'absolute',
    fontSize: 6,
    '&::before': {
      content: '""',
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    },
  }),
  paper: {
    border: '1px solid #d3d4d5',
  },
  popper: (props) => ({
    '&[x-placement*="bottom"] $arrow': {
      top: 0,
      left: 0,
      marginTop: '-0.95em',
      width: '2em',
      height: '1em',
      '&::before': {
        borderWidth: '0 1em 1em 1em',
        borderColor: `transparent transparent ${theme.palette.grey[700]} transparent`,
      },
    },
    '&[x-placement*="top"] $arrow': {
      bottom: 0,
      left: 0,
      marginBottom: '-0.95em',
      width: '2em',
      height: '1em',
      '&::before': {
        borderWidth: '1em 1em 0 1em',
        borderColor: `${theme.palette.grey[700]} transparent transparent transparent`,
      },
    },
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: '-0.95em',
      height: '2em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 1em 1em 0',
        borderColor: `transparent ${theme.palette.grey[700]} transparent transparent`,
      },
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: '-0.95em',
      height: '2em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 0 1em 1em',
        borderColor: `transparent transparent transparent ${theme.palette.grey[700]}`,
      },
    },
  }),
}))

const SelectAndCheck = (props) => {
  const classes = useStyles(props);
  const id = useMemo(Math.random, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const [arrowRef, setArrowRef] = useState(null);

  const handleClickSelect = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const closeSelect = useCallback(() => { setAnchorEl(null) }, []);

  const handleCloseSelect = useCallback(async () => {
    const keepOpen = await ((props.onClose || noop)());
    
    if (keepOpen !== true) {
      closeSelect();
    }
  }, [closeSelect, props.onClose]);

  const handleClickCheckbox = useCallback((event) => {
    (props.onClickCheckbox || noop)(event.target.value, handleCloseSelect);
  }, [props.onClickCheckbox, handleCloseSelect]);

  const handleClickSelectItem = useCallback((value) => async (event) => {
    if (event.target.type === 'checkbox') {
      return;
    }

    const keepOpen = await ((props.onSelect || noop)(value));

    if (keepOpen !== true) {
      handleCloseSelect();
    }
  }, [handleCloseSelect, props.onSelect]);

  const open = (!!anchorEl);

  return (
    <div className={classes.root}>
      <Button
        disableRipple
        variant="outlined"
        aria-haspopup="true"
        className={classes.button}
        onClick={handleClickSelect}
        aria-controls={`select-and-check-${id}`}
        { ...props.SelectProps }
      >
        { open ? (props.activeTitle || props.title) : props.title }
        { open
          ? <ArrowDropUpIcon className={classes.arrowIcon} /> 
          : <ArrowDropDownIcon className={classes.arrowIcon} />
        }
      </Button>
      <Menu
        keepMounted
        open={open}
        elevation={0}
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        onClose={handleCloseSelect}
        id={`select-and-check-${id}`}
        classes={{ paper: classes.paper }}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        transformOrigin={{vertical: 'top', horizontal: 'center'}}
        { ...props.MenuProps }    
      >
        {props.options?.map(({ key, value, text, selected, tooltipTitle, checked, checkboxValue }, i) => {
          let TooltipAndCheckbox = null;

          if (typeof checked === 'boolean') {
            const _Checkbox = <Checkbox checked={checked} onClick={handleClickCheckbox} value={checkboxValue === undefined ? value : checkboxValue} />
            const tooltipText = (tooltipTitle || props.tooltipTitle);

            TooltipAndCheckbox = tooltipText ? (
              <Tooltip
                classes={{ tooltip: classes.tooltip, popper: classes.popper }}
                PopperProps={{
                  popperOptions: {
                    modifiers: {
                      arrow: {
                        enabled: !!arrowRef,
                        element: arrowRef,
                      },
                    },
                  },
                }}
                title={
                  <React.Fragment>
                    {tooltipText}
                    <span className={classes.arrow} ref={setArrowRef} />
                  </React.Fragment>
                }
                enterDelay={props.tooltipEnterDelay === undefined ? 750 : props.tooltipEnterDelay}
                leaveDelay={props.tooltipLeaveDelay || 0}
                aria-label="checkbox"
                placement={props.tooltipPlacement || "top"}
              >
                {_Checkbox}
              </Tooltip>
            ) : _Checkbox
          }

          return (
            <MenuItem 
              key={key || i}
              onClick={handleClickSelectItem(value)}
              selected={selected}
              {...props.MenuItemProps}
            >
              {TooltipAndCheckbox}
              <ListItemText primary={text || value?.toString()} />
            </MenuItem>
          )}
        )}
      </Menu>
    </div>
  )
}

SelectAndCheck.propTypes = {
  styles: PropTypes.object,
  onClose: PropTypes.func,
  title: PropTypes.string,
  onSelect: PropTypes.func,
  MenuProps: PropTypes.object,
  SelectProps: PropTypes.object,
  activeTitle: PropTypes.string,
  tooltipTitle: PropTypes.string,
  MenuItemProps: PropTypes.object,
  onClickCheckbox: PropTypes.func,
  tooltipEnterDelay: PropTypes.number,
  tooltipLeaveDelay: PropTypes.number,
  tooltipPlacement: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default SelectAndCheck
