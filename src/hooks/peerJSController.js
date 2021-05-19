import Peer from 'peerjs';
import { useState } from 'react';

export const usePeerJSController = () => {
  const [peer, setPeer] = useState();
  const [connection, setConnection] = useState(false);

  const init = () => {
    const _peer = new Peer();
    setPeer(peer);

    _peer.on('open', (id) => {
      console.log('Peer id is:', id);
    })

    _peer.on('connection', (conn) => {
      setConnection(conn);

      conn.on('open', () => {
        conn.on('data', data => {
          console.log('Received:', data);
        });

        conn.send('Hey there, bub!');
      });
    });
  }

  const connect = (id) => {
    peer.conenct(id);
  }

  const send = (message) => {
    connection.send(message)
  }

  return { init, connect, send, peer, connection };
};
