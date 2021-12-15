import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { usePeerJS } from '../context/peer';
import { makeNameOk } from '../lib/peerUtils';
import { MIN_NAME_LENGTH } from '../lib/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  text: {
    flexGrow: 1
  }
}));

const PeerTemp = (props) => {
  const classes = useStyles();
  const peerJs = usePeerJS();
  const [peerId, setPeerId] = useState('');

  return (
    <div className={classes.root}>
      <TextField
        value={peerId}
        className={classes.text}
        disabled={!peerJs.peer || !!peerJs.connection}
        onChange={e => setPeerId(makeNameOk(e.target.value))}
        placeholder="Enter your friend's Peer ID"
      />
      <Button
        disabled={(
          props.disableConnect
            || !peerJs.peer
            || peerId.length < MIN_NAME_LENGTH
            || !!peerJs.connection
        )}
        variant="outlined"
        onClick={() => peerJs.connect(peerId)}
      >
        Connect
      </Button>
    </div>
  );
};

PeerTemp.propTypes = {};

export default PeerTemp;
