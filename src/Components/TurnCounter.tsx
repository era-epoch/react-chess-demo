import { useSelector } from 'react-redux';
import { RootState } from '../state/rootReducer';
import './TurnCounter.css';

const TurnCounter = (): JSX.Element => {
  const turn = useSelector((state: RootState) => state.game.turn);
  const finished = useSelector((state: RootState) => state.game.completed);
  const winner = useSelector((state: RootState) => state.game.winner);
  const playAgain = () => {
    // TODO: Refresh board without page reload
    window.location.reload();
  };

  return (
    <div className="turn-counter">
      <div className="turn-number-label">Turn {turn}</div>
      {finished ? (
        <>
          <div className="turn-player-label">
            {winner === 0 ? 'White Wins!' : winner === 1 ? 'Black Wins!' : 'Draw'}
          </div>
          <div className="play-again" onClick={playAgain}>
            Play Again?
          </div>
        </>
      ) : (
        <div className="turn-player-label">{turn % 2 === 0 ? 'White to move.' : 'Black to move.'}</div>
      )}
    </div>
  );
};

export default TurnCounter;
