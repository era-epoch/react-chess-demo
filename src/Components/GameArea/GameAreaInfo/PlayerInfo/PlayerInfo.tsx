import { faBolt, faChessPawn } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../state/rootReducer';
import { UserInfo, Graveyard, PlayerColour } from '../../../../types';
import GraveyardYard from '../GraveyardYard/GraveyardYard';
import './PlayerInfo.css';

interface Props {
  user: UserInfo;
}

const PlayerInfo = (props: Props): JSX.Element => {
  const graveyards = useSelector((state: RootState) => state.game.graveyards);
  const graveyard = graveyards.filter((g: Graveyard) => g.player === props.user.colour)[0];
  const lightRunes = useSelector((state: RootState) => state.game.lightRunes);
  const darkRunes = useSelector((state: RootState) => state.game.darkRunes);
  return (
    <div className="player-info">
      <div style={{ color: props.user.colour === PlayerColour.light ? 'white' : 'black' }}>
        <FontAwesomeIcon icon={faChessPawn} />
      </div>
      <div className="player-name">{props.user.name}</div>
      <div className="player-runes">
        <FontAwesomeIcon icon={faBolt} className="rune" />
        {props.user.colour === PlayerColour.light ? lightRunes : darkRunes}
      </div>
      <GraveyardYard graveyard={graveyard} />
    </div>
  );
};

export default PlayerInfo;
