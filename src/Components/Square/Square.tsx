import {
  faBolt,
  faChessPawn,
  faCircle,
  faCrown,
  faDroplet,
  faHeart,
  faSkull,
  faSkullCrossbones,
  faWater,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { getAbilityRenderString } from '../../GameObjects/ability';
import { RootState } from '../../state/rootReducer';
import { PieceStatus, SquareContents, SquareStatus } from '../../types';
import BoardPiece from '../Piece/Piece';
import './Square.css';

interface Props {
  content: SquareContents;
  clickHandler: Function;
}

const Square = (props: Props): JSX.Element => {
  const activeAbility = useSelector((state: RootState) => state.game.activeAbility);
  const abilityRender = getAbilityRenderString(activeAbility);
  const squareStatuses = props.content.squareStatuses;
  return (
    <div
      className={
        `square ${props.content.inBounds ? 'active-square' : 'inactive-square'}` +
        `${(props.content.row + props.content.col) % 2 === 0 ? ' light-square' : ' dark-square'}` +
        ` ${props.content.inBounds ? abilityRender : ''}`
      }
      onClick={() => props.clickHandler(props.content.row, props.content.col)}
    >
      <div className={`icon-stack`}>
        {props.content ? <BoardPiece piece={props.content.piece} /> : null}
        {squareStatuses.includes(SquareStatus.HL) ? (
          <div className="icon-wrapper square-highlighted">
            <FontAwesomeIcon icon={faCircle} />
          </div>
        ) : null}
        {squareStatuses.includes(SquareStatus.HLC) ? (
          <div className="icon-wrapper square-highlighted">
            <FontAwesomeIcon icon={faCrown} />
          </div>
        ) : null}
        {squareStatuses.includes(SquareStatus.HLK) ? (
          <div className="icon-wrapper square-highlighted-kill">
            <FontAwesomeIcon icon={faSkull} />
          </div>
        ) : null}
        {squareStatuses.includes(SquareStatus.HL_POTENTIAL) ? (
          <div className="icon-wrapper square-highlighted-potential">
            <FontAwesomeIcon icon={faCircle} />
          </div>
        ) : null}
        {squareStatuses.includes(SquareStatus.EPV) ? (
          <div className={`icon-wrapper en-passant-vulnerable`}>
            <FontAwesomeIcon icon={faChessPawn} />
          </div>
        ) : null}
        {props.content.inBounds && squareStatuses.includes(SquareStatus.SEL) ? (
          <div className="square-selected"></div>
        ) : null}
        {props.content.inBounds && squareStatuses.includes(SquareStatus.RUNE) ? (
          <div className={`icon-wrapper board-rune`}>
            <FontAwesomeIcon icon={faBolt} />
          </div>
        ) : null}
        {props.content.inBounds && squareStatuses.includes(SquareStatus.AOE) ? (
          <div
            className={
              `square-aoe` +
              (squareStatuses.includes(SquareStatus.AOE_PSN) ? ' aoe-poison' : '') +
              (squareStatuses.includes(SquareStatus.AOE_B) ? ' aoe-bottom' : '') +
              (squareStatuses.includes(SquareStatus.AOE_L) ? ' aoe-left' : '') +
              (squareStatuses.includes(SquareStatus.AOE_T) ? ' aoe-top' : '') +
              (squareStatuses.includes(SquareStatus.AOE_R) ? ' aoe-right' : '') +
              (squareStatuses.includes(SquareStatus.AOE_BLOOD) ? ' aoe-blood' : '')
            }
          ></div>
        ) : null}
        {props.content.inBounds &&
        abilityRender === 'ability-cure' &&
        props.content.piece.statuses.includes(PieceStatus.PSN) ? (
          <div className={`icon-wrapper hover-icon`} style={{ color: 'rgba(255, 0, 0, 0.75)', fontSize: '2rem' }}>
            <FontAwesomeIcon icon={faHeart} />
          </div>
        ) : null}
        {props.content.inBounds &&
        abilityRender === 'ability-infect' &&
        squareStatuses.includes(SquareStatus.AOE_PSN) ? (
          <div className={`icon-wrapper hover-icon`} style={{ color: 'greenyellow', fontSize: '1.5rem' }}>
            <FontAwesomeIcon icon={faSkullCrossbones} />
          </div>
        ) : null}
        {props.content.inBounds &&
        abilityRender === 'ability-blood_sacrifice' &&
        squareStatuses.includes(SquareStatus.AOE_BLOOD) ? (
          <div className={`icon-wrapper hover-icon`} style={{ color: 'red', fontSize: '1.5rem' }}>
            <FontAwesomeIcon icon={faDroplet} />
          </div>
        ) : null}
        {squareStatuses.includes(SquareStatus.QUICK_KILL) ? (
          <div className="icon-wrapper square-highlighted-kill">
            <FontAwesomeIcon icon={faSkull} />
          </div>
        ) : null}
        {activeAbility === 'hemoport' && squareStatuses.includes(SquareStatus.BLOODIED) ? (
          <div className={`icon-wrapper hover-icon`} style={{ color: 'red', fontSize: '1.5rem' }}>
            <FontAwesomeIcon icon={faDroplet} />
          </div>
        ) : null}
        <div className="icon-wrapper">
          <div className="square-statuses">
            {props.content.inBounds && squareStatuses.includes(SquareStatus.BLOODIED) ? (
              <FontAwesomeIcon icon={faWater} className="blood" />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Square;
