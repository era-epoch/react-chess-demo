import Board from '../../Board/Board';
import PromoDialogue from '../PromoDialogue/PromoDialogue';
import './GameAreaMain.css';

const GameAreaMain = (): JSX.Element => {
  return (
    <div className="game-area-main">
      <Board />
      <PromoDialogue />
    </div>
  );
};

export default GameAreaMain;
