import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/styles';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import IconButton from '@material-ui/core/IconButton';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { useEffect } from 'react';
import { makeNameOk } from '../lib/peerUtils';
import { MIN_NAME_LENGTH } from '../lib/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    'flexGrow': 1,
  },
  button: {
    marginLeft: theme.spacing(1),
    width: 112,
  },
  text: {
    flexGrow: 1,
    maxWidth: 300,
  },
  start: {
    fontWeight: 'bold',
    marginRight: theme.spacing(1),
    width: 136,
  }
}));

const Name = (props) => {
  const classes = useStyles(props);
  const nameSetRef = useRef();
  const [name, setName] = useState('');
  const textFieldRef = useRef();
  const timeout = useRef();

  useEffect(() => {
    if (props.myName && props.myName !== nameSetRef.current) {
      nameSetRef.current = props.myName;
      setName(props.myName);
    }
  }, [props.myName])

  const handleBlur = (newName) => () => {
    const resolvedName = (newName || name);
    clearTimeout(timeout.current);
    if (resolvedName === props.name) {

      return;
    }
    
    if (name.length > MIN_NAME_LENGTH) {
      props.updateName(resolvedName);
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
      <Typography className={classes.start}>Your name is:</Typography>
      <TextField
        className={classes.text}
        ref={textFieldRef}
        inputProps={{ spellCheck: 'false', style: {textAlign: 'center'} }}
        value={name}
        onBlur={handleBlur()}
        onChange={handleChange}
      />
      <div className={classes.button}>
        <IconButton
          aria-label="random-name"
          color="secondary"
          onClick={props.generateRandomName}
        >
          <AutorenewIcon />
        </IconButton>
        <CopyToClipboard text={props.myName}>
          <IconButton aria-label="copy" color="secondary">
            <FileCopyIcon />
          </IconButton>
        </CopyToClipboard>
      </div>
    </div>
  );
};

Name.propTypes = {};

export default Name;
