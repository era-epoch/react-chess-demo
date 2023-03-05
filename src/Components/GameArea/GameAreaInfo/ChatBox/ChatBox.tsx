import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { uid } from 'react-uid';
import { wsCreateGameInExistingRoom } from '../../../../socketMiddleware';
import { RootState } from '../../../../state/rootReducer';
import { fullGameStateUpdate } from '../../../../state/slices/game/slice';
import { addChatItemToLog, ChatItem, ChatItemType } from '../../../../state/slices/ui/slice';
import './ChatBox.css';

const ChatBox = (): JSX.Element => {
  const dispatch = useDispatch();
  const chatlog = useSelector((state: RootState) => state.ui.chatlog);
  const moveHistory = useSelector((state: RootState) => state.game.moveHistory);
  const winner = useSelector((state: RootState) => state.game.winner);
  const gameStartState = useSelector((state: RootState) => state.ui.gameStartState);
  const chatOpen = useSelector((state: RootState) => state.ui.chatOpen);
  const [chatMessage, setChatMessage] = useState('');

  const handleSubmit = () => {};

  const allChat: ChatItem[] = [];
  allChat.push(...chatlog);
  allChat.push(...moveHistory);
  allChat.sort((a, b) => (a.time < b.time ? -1 : b.time < a.time ? 1 : 0));

  const handlePlayAgain = () => {
    if (gameStartState) {
      dispatch(wsCreateGameInExistingRoom(gameStartState));
      dispatch(fullGameStateUpdate(gameStartState));
      dispatch(
        addChatItemToLog({
          content: `You've started a new game.`,
          time: new Date(),
          origin: '',
          type: ChatItemType.GAME,
        }),
      );
    }
  };

  return (
    <div className={`chat-box${chatOpen ? ' chat-box-shown' : ' chat-box-hidden'}`}>
      {allChat.map((item: ChatItem) => {
        // TODO: Why is the deserialization necessary?
        const time = new Date(item.time);
        return (
          <div key={uid(item)} className="chat-item">
            <div className="chat-time">{`${('0' + time.getHours()).slice(-2)}:${('0' + time.getMinutes()).slice(-2)}:${(
              '0' + time.getSeconds()
            ).slice(-2)}`}</div>
            <div className="chat-origin">{item.origin}</div>
            <div className="chat-content">{item.content}</div>
          </div>
        );
      })}
      {winner !== null ? (
        <div className="chat-prompt">
          <div className="chat-prompt-content">
            <div className="chat-button play-again" onClick={handlePlayAgain}>
              Play Again
            </div>
            <div className="chat-button swap-sides">Swap Sides</div>
            {/* <div className="chat-button change-game-settings">Change Game Settings</div> */}
          </div>
        </div>
      ) : null}
      {/* <div className="chat-box-input">
        <input type="text" value={chatMessage} onChange={(event) => setChatMessage(event.target.value)}></input>
      </div> */}
    </div>
  );
};

export default ChatBox;
