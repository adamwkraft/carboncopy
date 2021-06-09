import Peer from 'peerjs';
import { useState } from 'react';
import {
  getRandomId,
  makeNameOk,
  makePeerId,
  cleanPeerId
} from '../lib/peerUtils';

export const usePeerJSController = () => {
  const [myName, setMyName] = useState(makeNameOk(getRandomId()));
  const [peer, setPeer] = useState(null);
  const [myId, setId] = useState(null);
  const [connection, setConnection] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = (conn, initiated=false) => {
    setConnection(conn);
    setIsConnecting(true);

    conn.on('open', (dunno) => {
      console.log('CONN: open', dunno);
      setIsConnected(true);
      setIsConnecting(false);
    });

    conn.on('data', data => {
      console.log('CONN: data:', data);
    });

    conn.on('disconnected', (id) => {
      console.log('CONN: Got disconnected', id)
    })

    conn.on('close', (id) => {
      console.log('CONN: close', id)
    })

    conn.on('connection', _connection => {
      console.log("CONN connection:", _connection);
    });

    conn.on('error', err => {
      console.log('CONN: error', err);
    })
  }

  const init = () => {
    const _peer = new Peer(makePeerId(myName));
    setPeer(_peer);

    _peer.on('disconnected', (id) => {
      console.log('PEER: disconnected', id)
    })

    _peer.on('close', (id) => {
      console.log('PEER: close', id)
    })

    _peer.on('open', (id) => {
      console.log('PEER: open', id);
      setId(id);
    })

    _peer.on('connection', _connection => {
      console.log("PEER: connection", _connection);
      handleConnect(_connection);
    });

    _peer.on('error', err => {
      console.log('PEER: error', err);

      // If error is that we couldn't connect, then unset the connection object
      if (err.message.includes("Could not connect to peer")) {
        setConnection(null);
        setIsConnecting(false);
      }
    })
  }

  const connect = (id) => {
    console.log('Connecting to peer:', id);
    const conn = peer.connect(makePeerId(id));

    handleConnect(conn);
  }

  const send = (message) => {
    connection.send(message)
  }

  return {
    init,
    connect,
    send,
    peer,
    connection,
    peerId: cleanPeerId(myId),
    isConnecting,
    isConnected };
};
