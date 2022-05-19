import Board from './Board';
import './CenterGameArea.css';

const CenterGameArea = (): JSX.Element => {
  return (
    <div className="center-game-area">
      <Board />
    </div>
  );
};

export default CenterGameArea;
