import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { uid } from 'react-uid';
import './App.css';
import Base from './Components/Base/Base';
import { RootState } from './state/rootReducer';
import { Alert, removeAlert } from './state/slices/ui/slice';

const App = (): JSX.Element => {
  const alerts = useSelector((state: RootState) => state.ui.alerts);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(wsConnect(`http://${window.location.hostname}:5000`));
  //   return () => {
  //     dispatch(wsDisconnect(`http://${window.location.hostname}:5000`));
  //   };
  // }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Base />} />
        </Routes>
      </BrowserRouter>
      <div className="alert-container">
        {alerts.map((alert: Alert) => {
          return (
            <div key={uid(alert)} className={`alert ${alert.type}`}>
              <div className="alert-content">{alert.content}</div>
              <div className="close-alert-button" onClick={() => dispatch(removeAlert(alert))}>
                <FontAwesomeIcon icon={faXmark} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
