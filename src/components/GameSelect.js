import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120,
  },
  select: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

const GameSelect = ({ value, ...props }) => {
  const classes = useStyles();

  return (
    <FormControl className={classes.formControl}>
      <Select
        classes={{ root: classes.select }}
        {...props}
        placeholder="Select Game"
        value={value || ''}
        displayEmpty={true}
        variant="outlined"
      >
        <MenuItem value="">Select Masks</MenuItem>
        {Array.from({ length: 3 }).map((_, idx) => (
          <MenuItem key={idx} value={`set${idx + 1}.zip`}>
            Game {idx + 1}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

GameSelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default GameSelect;
