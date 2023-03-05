import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { uid } from 'react-uid';
import { wsEmitMove } from '../../socketMiddleware';
import { RootState } from '../../state/rootReducer';
import {
  endTurnDirect,
  makeMove,
  selectSquare,
  tryActivateAbility,
  updateActiveAbility,
} from '../../state/slices/game/slice';
import { OnlineGameStatus, swapLocalPlayer } from '../../state/slices/ui/slice';
import { store } from '../../state/store';
import { ResolutionEventType, SquareStatus } from '../../types';
import { isPlayersTurn } from '../../util';
import Square from '../Square/Square';
import './Board.css';
import '../Details/details.css';
import { isAbilityQuick } from '../../GameObjects/ability';

const Board = (): JSX.Element => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: RootState) => state.game);
  const boardInversion = useSelector((state: RootState) => state.ui.boardInversion);
  const onlineGame = useSelector((state: RootState) => state.ui.onlineGameStatus);
  const player = useSelector((state: RootState) => state.ui.player);
  const board = gameState.board.slice(0);

  const handleTurnEnd = () => {
    // If online game, emit the new game state
    if (onlineGame === OnlineGameStatus.SUCCESS) {
      const newGameState = store.getState().game;
      dispatch(wsEmitMove(newGameState));
    }
    // If local hotseat game, switch players
    if (onlineGame === OnlineGameStatus.NONE) {
      dispatch(swapLocalPlayer());
      // dispatch(toggleBoardInversion());
    }
  };

  const resolve = () => {
    console.log('resolving');
    const next = store.getState().game.postTurnResolutionQueue[0];
    switch (next.type) {
      case ResolutionEventType.BloodSacrifice:
        dispatch(updateActiveAbility('blood_sacrifice'));
        break;
      case ResolutionEventType.AlacrityChain:
        dispatch(updateActiveAbility('alacrity_chain'));
        break;
    }

    if (store.getState().game.abilityActivatedFlag) {
      dispatch(endTurnDirect());
      if (store.getState().game.postTurnResolutionQueue.length === 0) {
        handleTurnEnd();
      } else {
        resolve();
      }
    }
  };

  const handleMove = (row: number, col: number) => {
    if (gameState.selectedRow !== null && gameState.selectedCol !== null) {
      if (gameState.board[gameState.selectedRow][gameState.selectedCol].piece.owner === player.colour) {
        dispatch(makeMove({ row: row, col: col }));
        if (store.getState().game.postTurnResolutionQueue.length === 0) {
          handleTurnEnd();
        } else {
          resolve();
        }
      } else {
        dispatch(selectSquare({ row: row, col: col, player: player }));
      }
    }
  };

  const handleSelect = (row: number, col: number) => {
    if (gameState.activeAbility === '') {
      dispatch(selectSquare({ row: row, col: col, player: player }));
    } else if (isPlayersTurn(gameState.turn, player)) {
      dispatch(tryActivateAbility({ row: row, col: col }));
      const newGameState = store.getState().game;
      // If the ability activated and ends the turn, end the turn
      if (newGameState.abilityActivatedFlag && !isAbilityQuick(gameState.activeAbility)) {
        dispatch(endTurnDirect());
        if (store.getState().game.postTurnResolutionQueue.length === 0) {
          handleTurnEnd();
        } else {
          resolve();
        }
      }
    }
  };

  const handleSquareClick = (row: number, col: number) => {
    const madeMove =
      gameState.board[row][col].squareStatuses.includes(SquareStatus.HL) ||
      gameState.board[row][col].squareStatuses.includes(SquareStatus.HLC) ||
      gameState.board[row][col].squareStatuses.includes(SquareStatus.HLK);
    if (madeMove && isPlayersTurn(gameState.turn, player)) {
      handleMove(row, col);
    } else {
      handleSelect(row, col);
    }
  };

  if (boardInversion) board.reverse();
  return (
    <div className="Board">
      {board.map((row, rowN) => {
        const Row = row.slice(0);
        if (boardInversion) Row.reverse();
        return (
          <div key={uid(rowN)} className="row">
            {Row.map((val, colN) => {
              return <Square key={uid(val)} content={val} clickHandler={handleSquareClick} />;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
