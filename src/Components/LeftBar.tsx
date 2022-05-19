import { useEffect, useState } from 'react';
import './LeftBar.css';
import { IMessageEvent, w3cwebsocket } from 'websocket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const client = new w3cwebsocket('ws://localhost:5000/websockets?userId=123');

const LeftBar = (): JSX.Element => {
  const [websocketConnected, setWebsocketConnected] = useState(false);
  const navigate = useNavigate();

  const onHomeClicked = () => {
    navigate('/');
  };

  useEffect(() => {
    client.onopen = () => {
      console.log('Websocket Connection Open');
      setWebsocketConnected(true);
    };
    client.onmessage = (message: IMessageEvent) => {
      console.log(JSON.parse(message.data.toString()).message);
    };
  }, []);

  useEffect(() => {
    if (websocketConnected) client.send(JSON.stringify({ msg: 'hi' }));
  }, [websocketConnected]);

  return (
    <div className="left-sidebar">
      <div className="home-button" onClick={onHomeClicked}>
        <FontAwesomeIcon icon={faHome} />
      </div>
    </div>
  );
};

export default LeftBar;
