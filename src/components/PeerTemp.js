import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { usePeerJS } from '../context/peer';

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
  const [message, setMessage] = useState('');
  console.log(peerJs);

  return (
    <div className={classes.root}>
      <Button disabled={!!peerJs.peer} variant="outlined" onClick={peerJs.init}>Initialize</Button>
      <TextField className={classes.text} disabled={!peerJs.peer || !!peerJs.connection} onChange={e => setPeerId(e.target.value)} />
      <Button disabled={!peerJs.peer || !peerId || !!peerJs.connection} variant="outlined" onClick={() => peerJs.connect(peerId)}>Connect</Button>
      <TextField value={message} className={classes.text} disabled={!peerJs.connection} onChange={e => setMessage(e.target.value)} />
      <Button variant="outlined" disabled={!peerJs.connection} onClick={() => {
        peerJs.send(message);
        setMessage('');
      }}>Send Message</Button>
    </div>
  );
};

PeerTemp.propTypes = {};

export default PeerTemp;
