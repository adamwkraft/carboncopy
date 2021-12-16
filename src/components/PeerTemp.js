import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { usePeerJS } from '../context/peer';
import { makeNameOk } from '../lib/peerUtils';
import { MIN_NAME_LENGTH } from '../lib/constants';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    width: 136,
    fontWeight: 'bold',
    marginRight: theme.spacing(1),
  }
}));

const PeerTemp = (props) => {
  const classes = useStyles();
  const peerJs = usePeerJS();
  const cacheRef = useRef();
  const [peerId, setPeerId] = useState('');

  useEffect(() => {
    if (!cacheRef.current && peerJs.cachedOpponentName) {
      cacheRef.current = true;
      setPeerId(peerJs.cachedOpponentName);
    }
  }, [peerJs]);

  return (
    <div className={classes.root}>
      <Typography className={classes.start}>Opponent name is:</Typography>
      <TextField
        inputProps={{
          spellCheck: 'false',
          style: {
            textAlign: 'center',
          }
        }}
        value={peerJs.opponentName || peerId}
        className={classes.text}
        disabled={!peerJs.peer || !!peerJs.connection}
        onChange={e => setPeerId(makeNameOk(e.target.value))}
        placeholder="Enter your friend's Peer ID"
      />
      <Button
        className={classes.button}
        disabled={(
          peerJs.disableConnect
            || !peerJs.peer
            || peerId.length < MIN_NAME_LENGTH
            || !!peerJs.connection
        )}
        variant="outlined"
        onClick={() => peerJs.connect(peerId)}
      >
        {peerJs.isConnecting
          ? (
            <CircularProgress
              color="secondary"
              size={20}
            />
          ) : 'Connect'
        }
      </Button>
    </div>
  );
};

PeerTemp.propTypes = {};

export default PeerTemp;
