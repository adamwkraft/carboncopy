import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const GameSelect = (props) => {
  const classes = useStyles();

  return (
    <FormControl className={classes.formControl}>
      <Select {...props} value="" placeholder="Select Game" variant="outlined">
        {Array.from({ length: 3 }).map((_, idx) => (
          <MenuItem key={idx} value={`set${idx + 1}.zip`}>Game {idx + 1}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

GameSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
}

export default GameSelect;
