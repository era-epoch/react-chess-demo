import { faChessBishop, faChessKnight, faChessQueen, faChessRook } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { wsEmitMove } from '../../../socketMiddleware';
import { RootState } from '../../../state/rootReducer';
import { endTurnDirect, promotePiece } from '../../../state/slices/game/slice';
import { OnlineGameStatus, swapLocalPlayer } from '../../../state/slices/ui/slice';
import { store } from '../../../state/store';
import { PieceIdentifier, ResolutionEventType } from '../../../types';

const PromoDialogue = (): JSX.Element => {
  const resolution = useSelector((state: RootState) => state.game.postTurnResolutionQueue);
  const onlineGame = useSelector((state: RootState) => state.ui.onlineGameStatus);
  const dispatch = useDispatch();

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

  const active = (): boolean => {
    if (resolution.length === 0) {
      return false;
    } else if (resolution[0].type === ResolutionEventType.PawnPromotion) {
      return true;
    } else {
      return false;
    }
  };

  const promote = (target: PieceIdentifier) => {
    dispatch(promotePiece({ res: resolution[0], new: target }));
    console.log(store.getState().game.postTurnResolutionQueue);
    dispatch(endTurnDirect());
    if (store.getState().game.postTurnResolutionQueue.length === 0) {
      handleTurnEnd();
    }
  };

  return (
    <div className="game-dialogue-wrapper" style={active() ? { display: 'flex' } : { display: 'none' }}>
      <div className="game-dialogue-content">
        <div className="game-dialogue-title">Pawn Promotion</div>
        <div className="pawn-promo-options">
          <div className="promo-op" onClick={() => promote(PieceIdentifier.basicQueen)}>
            <FontAwesomeIcon icon={faChessQueen} />
          </div>
          <div className="promo-op" onClick={() => promote(PieceIdentifier.basicRook)}>
            <FontAwesomeIcon icon={faChessRook} />
          </div>
          <div className="promo-op" onClick={() => promote(PieceIdentifier.basicBishop)}>
            <FontAwesomeIcon icon={faChessBishop} />
          </div>
          <div className="promo-op" onClick={() => promote(PieceIdentifier.basicKnight)}>
            <FontAwesomeIcon icon={faChessKnight} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoDialogue;
