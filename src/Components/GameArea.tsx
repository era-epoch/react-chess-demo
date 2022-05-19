import CenterGameArea from './CenterGameArea';
import './GameArea.css';
import RightGameArea from './RightGameArea';

const GameArea = (): JSX.Element => {
  return (
    <div className="game-area">
      <CenterGameArea />
      <RightGameArea />
    </div>
  );
};

export default GameArea;
