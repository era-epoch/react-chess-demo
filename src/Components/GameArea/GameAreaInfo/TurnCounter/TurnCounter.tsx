import { useSelector } from 'react-redux';
import { RootState } from '../../../../state/rootReducer';
import './TurnCounter.css';

const TurnCounter = (): JSX.Element => {
  const turn = useSelector((state: RootState) => state.game.turn);
  const winner = useSelector((state: RootState) => state.game.winner);

  return (
    <div className="turn-counter">
      <div className="turn-number-label">Turn {turn}</div>
      {winner !== null ? (
        <>
          <div className="turn-player-label">{winner === 0 ? 'Light Wins!' : winner === 1 ? 'Dark Wins!' : 'Draw'}</div>
        </>
      ) : (
        <div className="turn-player-label">{turn % 2 === 0 ? 'Light to move' : 'Dark to move'}</div>
      )}
    </div>
  );
};

export default TurnCounter;
