import produce from 'immer';
import { useDispatch } from 'react-redux';
import classicBoard from '../../../GameObjects/boards/classicBoard';
import testBoard from '../../../GameObjects/boards/testBoard';
import { fullGameStateUpdate, GameState, setUpGame } from '../../../state/slices/game/slice';
import {
  addChatItemToLog,
  addPlayer,
  ChatItem,
  ChatItemType,
  clearPlayers,
  toggleActiveGame,
  toggleCreateLocalGameMenu,
  updatePlayer,
} from '../../../state/slices/ui/slice';
import { Board, PlayerColour } from '../../../types';
import './CreateLocalMenu.css';
import { useCallback, useState } from 'react';
import BoardPreview from '../BoardPreview/BoardPreview';
import mirroredTestBoard from '../../../GameObjects/boards/mirroredTestBoard';

const CreateLocalMenu = (): JSX.Element => {
  const [board, setBoard] = useState<Board>(classicBoard);
  const [gameType, setGameType] = useState('');
  const [runeSpawns, setRuneSpawns] = useState(0); // TEMPORARY
  // const [menuBoardInversion, setMenuBoardInversion] = useState(false);
  const dispatch = useDispatch();

  const startGame = useCallback(() => {
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
        board: produce(board, () => {}),
        turn: 0,
        selectedRow: null,
        selectedCol: null,
        graveyards: [
          { player: PlayerColour.light, contents: [] },
          { player: PlayerColour.dark, contents: [] },
        ],
        lightRunes: 0,
        darkRunes: 2, // Dark starts with 2 rune to balance going 2nd
        winner: null,
        creatorColour: null,
        timedGame: false,
        gameTime: 0,
        turnTimeBack: 0,
        moveHistory: [],
        lightRuneSpawns: runeSpawns,
        darkRuneSpawns: runeSpawns,
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
    dispatch(toggleCreateLocalGameMenu());
  }, [dispatch, board, runeSpawns]);

  return (
    <div className="menu-wrapper">
      <p>Local Hot Seat Game</p>
      <div className="menu-section">
        <div className="menu-section-title">Game Type</div>
        <div className="menu-row">
          <div
            className={`board-preview-wrapper ${gameType === 'classic' ? 'board-preview-selected' : ''}`}
            onClick={() => {
              setBoard(classicBoard);
              setGameType('classic');
              setRuneSpawns(0);
            }}
          >
            <div className="board-preview-title">Classic</div>
            <BoardPreview board={classicBoard} />
          </div>
          <div
            className={`board-preview-wrapper ${gameType === 'test' ? 'board-preview-selected' : ''}`}
            onClick={() => {
              setBoard(testBoard);
              setGameType('test');
              setRuneSpawns(1);
            }}
          >
            <div className="board-preview-title">Scourge vs. Crimson</div>
            <BoardPreview board={testBoard} />
          </div>
          <div
            className={`board-preview-wrapper ${gameType === 'test-mirror' ? 'board-preview-selected' : ''}`}
            onClick={() => {
              setBoard(mirroredTestBoard);
              setGameType('test-mirror');
              setRuneSpawns(1);
            }}
          >
            <div className="board-preview-title">Scourge vs. Crimson (Mirrored)</div>
            <BoardPreview board={mirroredTestBoard} />
          </div>
        </div>
      </div>
      <div className="menu-section"></div>
      <div className="ui-button major-button create-game-button" onClick={startGame}>
        Play
      </div>
    </div>
  );
};

export default CreateLocalMenu;
