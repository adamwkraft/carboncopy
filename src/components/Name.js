import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/styles';

import TextField from '@material-ui/core/TextField';
import { useEffect } from 'react';
import { makeNameOk } from '../lib/peerUtils';
import { MIN_NAME_LENGTH } from '../lib/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  span: {
    fontWeight: 'bold',
    marginRight: theme.spacing(1),
  }
}));

const Name = (props) => {
  const classes = useStyles(props);
  const nameSetRef = useRef();
  const [name, setName] = useState('');
  const textFieldRef = useRef();
  const timeout = useRef();

  useEffect(() => {
    if (props.name && !nameSetRef.current) {
      nameSetRef.current = props.name;
      setName(props.name);
    }
  }, [props.name])

  const handleBlur = (newName) => () => {
    const resolvedName = (newName || name);
    clearTimeout(timeout.current);
    if (resolvedName === props.name) {

      return;
    }
    
    if (name.length > MIN_NAME_LENGTH) {
      props.updateName(resolvedName, () => props.setDisableConnect(false));
    } else {
      setName(props.name);
      props.setDisableConnect(false);
    }
  }

  const handleChange = ({target: {value}}) => {
    const newName = makeNameOk(value);
    setName(newName);
    clearTimeout(timeout.current);
    props.setDisableConnect(true);

    timeout.current = setTimeout(() => {
      handleBlur(newName)();
    }, 1500);
  }

  return (
    <div className={classes.root}>
      <span className={classes.span}>Your name is:</span>
      <TextField
        ref={textFieldRef}
        inputProps={{ spellCheck: 'false' }}
        value={name}
        onBlur={handleBlur()}
        onChange={handleChange}
      />
    </div>
  );
};

Name.propTypes = {};

export default Name;
