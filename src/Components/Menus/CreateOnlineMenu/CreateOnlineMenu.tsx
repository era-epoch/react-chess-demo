// import produce from 'immer';
// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { CreateGameEvent } from '../../../../../ws/events';
// import classicBoard from '../../../GameObjects/boards/classicBoard';
// import mirroredTestBoard from '../../../GameObjects/boards/mirroredTestBoard';
// import testBoard from '../../../GameObjects/boards/testBoard';
// import { wsCreateGame } from '../../../socketMiddleware';
// import { toggleCreateGameMenu } from '../../../state/slices/ui/slice';
// import { Board, PlayerColour } from '../../../types';
// import { ws_url } from '../../LeftBar/LeftBar';
// import BoardPreview from '../BoardPreview/BoardPreview';
import './CreateOnlineMenu.css';

const CreateOnlineMenu = (): JSX.Element => {
  // const [creatorColour, setCreatorColour] = useState<PlayerColour>(PlayerColour.random);
  // const [timedGame, setTimedGame] = useState(false);
  // const [gameTime, setGameTime] = useState(10);
  // const [board, setBoard] = useState<Board>(classicBoard);
  // const [gameType, setGameType] = useState('');
  // const [runeSpawns, setRuneSpawns] = useState(0); // TEMPORARY
  // const [playerName, setPlayerName] = useState('Player' + Math.random().toString().slice(-4, -1));
  // const dispatch = useDispatch();

  // const createOnlineGame = () => {
  //   dispatch(
  //     wsCreateGame(ws_url, {
  //       game: {
  //         board: produce(board, () => {}),
  //         turn: 0,
  //         selectedRow: null,
  //         selectedCol: null,
  //         graveyards: [
  //           { player: PlayerColour.light, contents: [] },
  //           { player: PlayerColour.dark, contents: [] },
  //         ],
  //         lightRunes: 0,
  //         darkRunes: 2,
  //         winner: null,
  //         creatorColour: creatorColour,
  //         timedGame: timedGame,
  //         gameTime: gameTime,
  //         turnTimeBack: 1,
  //         moveHistory: [],
  //         lightRuneSpawns: runeSpawns,
  //         darkRuneSpawns: runeSpawns,
  //         runeDuration: 0,
  //         runeSpawnTurn: 0,
  //         activeAbility: '',
  //         abilityActivatedFlag: false,
  //         postTurnResolutionQueue: [],
  //       },
  //       playerName: playerName,
  //     } as CreateGameEvent),
  //   );
  //   dispatch(toggleCreateGameMenu());
  // };

  // const handleCreatorColourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   switch (event.target.value) {
  //     case 'light':
  //       setCreatorColour(PlayerColour.light);
  //       break;
  //     case 'dark':
  //       setCreatorColour(PlayerColour.dark);
  //       break;
  //     default:
  //       setCreatorColour(PlayerColour.random);
  //   }
  // };

  // const handlePlayerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setPlayerName(event.target.value);
  // };

  return (
    <div className="menu-wrapper">
      <p>Online Play Unavailable in Static Demo</p>
      {/* <div className="menu-section player-name-select">
        <div className="menu-section-title">Your Name</div>
        <div className="menu-row">
          <input type="text" value={playerName} onChange={handlePlayerNameChange} />
        </div>
      </div>
      <div className="menu-section creator-player-select" onChange={handleCreatorColourChange}>
        <div className="menu-section-title">Your Colour</div>
        <div className="menu-row">
          <div>
            <input type="radio" name="creator-player" value="light" id="creator-player-light" />
            <label htmlFor="creator-player-light">Light</label>
          </div>
          <div>
            <input type="radio" name="creator-player" value="dark" id="creator-player-dark" />
            <label htmlFor="creator-player-dark">Dark</label>
          </div>
          <div>
            <input type="radio" name="creator-player" value="random" id="creator-player-random" defaultChecked />
            <label htmlFor="creator-player-random">Random</label>
          </div>
        </div>
      </div>
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
        </div> */}
      {/* </div>
      <div className="ui-button major-button create-game-button" onClick={createOnlineGame}>
        Create Game
      </div> */}
    </div>
  );
};

export default CreateOnlineMenu;
