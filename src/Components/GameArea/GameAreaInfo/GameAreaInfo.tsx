import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { uid } from 'react-uid';
import { RootState } from '../../../state/rootReducer';
import { updateChatOpen } from '../../../state/slices/ui/slice';
import { UserInfo } from '../../../types';
import ChatBox from './ChatBox/ChatBox';
import './GameAreaInfo.css';
import Inspector from './Inspector/Inspector';
import PlayerInfo from './PlayerInfo/PlayerInfo';
import TurnCounter from './TurnCounter/TurnCounter';

const GameAreaInfo = (): JSX.Element => {
  const player = useSelector((state: RootState) => state.ui.player);
  const otherPlayers = useSelector((state: RootState) => state.ui.otherPlayers);
  const chatOpen = useSelector((state: RootState) => state.ui.chatOpen);
  const dispatch = useDispatch();

  const allPlayers = otherPlayers.slice(0);
  allPlayers.push(player);
  allPlayers.sort((a, b) => a.colour - b.colour);

  const toggleChat = () => {
    dispatch(updateChatOpen(!chatOpen));
  };
  return (
    <div className="game-area-info">
      <TurnCounter />
      <div className="player-infos">
        {allPlayers.map((p: UserInfo) => {
          return <PlayerInfo user={p} key={uid(p)} />;
        })}
      </div>
      <Inspector />
      <div className="chat-container">
        <ChatBox />
        <div className="chat-toggle" onClick={toggleChat}>
          {chatOpen ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronUp} />}
          {chatOpen ? 'Close ' : 'Open '}
          Log
        </div>
      </div>
    </div>
  );
};

export default GameAreaInfo;
