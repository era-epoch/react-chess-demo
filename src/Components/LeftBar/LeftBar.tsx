import './LeftBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUp,
  faBucket,
  faComputer,
  faHome,
  faLocationDot,
  faNetworkWired,
  faPlay,
  faPlusCircle,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import {
  addChatItemToLog,
  addPlayer,
  ChatItem,
  ChatItemType,
  clearPlayers,
  closeAllMenus,
  toggleActiveGame,
  toggleCreateGameMenu,
  toggleCreateLocalGameMenu,
  toggleJoinGameMenu,
  updatePlayer,
} from '../../state/slices/ui/slice';
import { fullGameStateUpdate, GameState, setUpGame } from '../../state/slices/game/slice';
import testBoard from '../../GameObjects/boards/testBoard';
import { wsDisconnect } from '../../socketMiddleware';
import { PlayerColour } from '../../types';
import produce from 'immer';
import { useCallback, useEffect } from 'react';
import classicBoard from '../../GameObjects/boards/classicBoard';

export const ws_url = `http://${window.location.hostname}:5000`;

const LeftBar = (): JSX.Element => {
  const dispatch = useDispatch();
  const startLocalGame = useCallback(() => {
    dispatch(toggleActiveGame(true));
    dispatch(clearPlayers());
    dispatch(
      updatePlayer({
        colour: PlayerColour.light,
        id: 'light',
        name: 'Light',
      }),
    );
    dispatch(
      addPlayer({
        colour: PlayerColour.dark,
        id: 'dark',
        name: 'Dark',
      }),
    );
    dispatch(
      fullGameStateUpdate({
        board: produce(testBoard, () => {}),
        turn: 0,
        selectedRow: null,
        selectedCol: null,
        graveyards: [
          { player: PlayerColour.light, contents: [] },
          { player: PlayerColour.dark, contents: [] },
        ],
        lightRunes: 100,
        darkRunes: 100, // Dark starts with 2 rune to balance going 2nd
        winner: null,
        creatorColour: null,
        timedGame: false,
        gameTime: 0,
        turnTimeBack: 0,
        moveHistory: [],
        lightRuneSpawns: 1,
        darkRuneSpawns: 1,
        runeDuration: Infinity,
        runeSpawnTurn: 0,
        activeAbility: '',
        abilityActivatedFlag: false,
        postTurnResolutionQueue: [],
      } as GameState),
    );
    dispatch(
      addChatItemToLog({
        content: "You've started a new local game!",
        time: new Date(),
        origin: '',
        type: ChatItemType.GAME,
      } as ChatItem),
    );
    dispatch(setUpGame());
  }, [dispatch]);

  const handleCreateOnlineClicked = () => {
    dispatch(toggleCreateGameMenu());
  };

  const handleJoinOnlineClicked = () => {
    dispatch(toggleJoinGameMenu());
  };

  const handleCreateLocalClicked = () => {
    dispatch(toggleCreateLocalGameMenu());
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header"></div>
      <div className="sidebar-body">
        <div className="sidebar-menu-option" onClick={handleCreateOnlineClicked}>
          <div className="sidebar-icon">
            <FontAwesomeIcon icon={faPlusCircle} />
          </div>
          <div className="sidebar-title">Create Online Game</div>
        </div>
        <div className="sidebar-menu-option" onClick={handleJoinOnlineClicked}>
          <div className="sidebar-icon">
            <FontAwesomeIcon icon={faUserGroup} />
          </div>
          <div className="sidebar-title">Join Online Game</div>
        </div>
        <div className="sidebar-menu-option" onClick={handleCreateLocalClicked}>
          <div className="sidebar-icon">
            <FontAwesomeIcon icon={faPlay} />
          </div>
          <div className="sidebar-title">Play Local Hot Seat Game</div>
        </div>
      </div>
      <div className="sidebar-footer"></div>
    </div>
  );
};

export default LeftBar;
