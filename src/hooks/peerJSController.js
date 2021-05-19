import Peer from 'peerjs';
import { useState } from 'react';

export const usePeerJSController = () => {
  const [peer, setPeer] = useState(null);
  const [myId, setId] = useState(null);
  const [connection, setConnection] = useState(null);

  const init = () => {
    const _peer = new Peer();
    setPeer(_peer);

    _peer.on('open', (id) => {
      console.log('Peer id is:', id);
      setId(id);
    })

    _peer.on('connection', (conn) => {
      console.log('Connection request:', conn)
      setConnection(conn);

      conn.on('open', () => {
        conn.on('data', data => {
          console.log('Received:', data);
        });

        conn.send('Hey there, bub!');
      });
    });

    _peer.on('error', err => {
      console.log(err);
    })
  }

  const connect = (id) => {
    console.log('Connecting to peer:', id);
    peer.connect(id);
  }

  const send = (message) => {
    connection.send(message)
  }

  return { init, connect, send, peer, connection, peerId: myId };
};
