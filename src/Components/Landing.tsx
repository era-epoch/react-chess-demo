import React from 'react';
import './Landing.css';
import {
  faChessBishop,
  faChessKing,
  faChessKnight,
  faChessPawn,
  faChessQueen,
  faChessRook,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addAlert, AlertType, getAlertID, removeAlert } from '../state/slices/UISlice/slice';

const footerOrder: IconDefinition[] = [
  faChessPawn,
  faChessRook,
  faChessKnight,
  faChessBishop,
  faChessKing,
  faChessQueen,
  faChessBishop,
  faChessKnight,
  faChessRook,
  faChessPawn,
];

// const footerPieces = [faChessBishop, faChessKing, faChessKnight, faChessPawn, faChessQueen, faChessRook];
// const footerOrder: IconDefinition[] = [];
// for (let i = 0; i < 20; i++) {
//   footerOrder.push(footerPieces[Math.floor(Math.random() * footerPieces.length)]);
// }

const Landing = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onPlayLocal = () => {
    navigate('/play');
  };
  const onPlayOnline = () => {
    const alert = {
      type: AlertType.error,
      content: 'Online play is currently a work-in-progress. Check back soon!',
      id: getAlertID(),
    };
    dispatch(addAlert(alert));
    setTimeout(() => {
      dispatch(removeAlert(alert));
    }, 5000);
  };
  return (
    <div className="landing">
      <div className="title">mod-chess</div>
      <div className="menu">
        <div
          className="border-gradient"
          style={{ '--color-back': 'rgb(141, 23, 23)' } as React.CSSProperties}
          onClick={onPlayLocal}
        >
          <div className="menu-option">
            <p>Play Locally</p>
          </div>
        </div>
        <div
          className="border-gradient"
          style={{ '--color-back': 'rgb(37, 65, 156)' } as React.CSSProperties}
          onClick={onPlayOnline}
        >
          <div className="menu-option">
            <p>Play Online</p>
          </div>
        </div>
      </div>
      <div className="landing-footer">
        {footerOrder.map((icon) => {
          return (
            <div className="landing-footer-icon">
              <FontAwesomeIcon icon={icon} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Landing;
