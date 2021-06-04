import Peer from 'peerjs';
import { useState } from 'react';

export const usePeerJSController = () => {
  const [peer, setPeer] = useState(null);
  const [myId, setId] = useState(null);
  const [connection, setConnection] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = (conn, initiated=false) => {
    setConnection(conn);
    setIsConnecting(true);

    conn.on('open', () => {
      console.log('conn Connection established');
      setIsConnected(true);
      setIsConnecting(false);
    });

    conn.on('data', data => {
      console.log('Received:', data);
    });

    conn.on('disconnected', (id) => {
      console.log('conn Got disconnected')
    })

    conn.on('close', (id) => {
      console.log('conn Got close')
    })

    conn.on('connection', _connection => {
      console.log("conn I am calling this");
    });

    conn.on('error', err => {
      console.log('conn Got error')
      console.log(err);
    })
  }

  const init = () => {
    const _peer = new Peer();
    setPeer(_peer);

    _peer.on('disconnected', (id) => {
      console.log('Got disconnected')
    })

    _peer.on('close', (id) => {
      console.log('Got close')
    })

    _peer.on('open', (id) => {
      console.log('Got open')
      console.log('Peer id is:', id);
      setId(id);
    })

    _peer.on('connection', _connection => {
      console.log("I am calling this");
      handleConnect(_connection);
    });

    _peer.on('error', err => {
      console.log('peer Got error')
      console.log(err);
      // If error is that we couldn't connect, then unset the connection object
      if (err.message.includes("Could not connect to peer")) {
        setConnection(null);
        setIsConnecting(false);
      }
    })
  }

  const connect = (id) => {
    console.log('Connecting to peer:', id);
    const conn = peer.connect(id);
    // Don't call handleConnect if the connection is bad.
    handleConnect(conn);
  }

  const send = (message) => {
    connection.send(message)
  }

  return { init, connect, send, peer, connection, peerId: myId, isConnecting, isConnected };
};
