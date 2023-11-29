import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Options from './components/Options';
import Load from './components/Load';
import Retrieve from './components/Retrieve';
import Confirmation from './components/Confirmation';
import AfterLoad from './components/Notification/AfterLoad';
import AfterConfirm from './components/Notification/AfterConfirm';
import AfterRetrieve from './components/Notification/AfterRetrieve';
import Home from './components/Home';
import CancelReservation from './components/Notification/CancelReservation';
import ErrorConfirm from './components/Notification/ErrorConfirm';
import Cancel from './components/Cancel';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import LockerStationInfo from './components/Dashboard/LockerStationInfo';
import LockerInfo from './components/Dashboard/LockerInfo';
import Bitacora from './components/Bitacora/Bitacora';
import BitacoraShow from './components/Bitacora/BitacoraShow';

const App = () => {
  return (
    <div className='image_background'>
      <div className="overlay"></div>
      <Router>
        <div className="blackborder">
          <div className='wheat-box'>
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/load" element={<Load />} />
              <Route path="/retrieve" element={<Retrieve />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/afterload/:id" element={<AfterLoad />} />
              <Route path="/afterconfirm/:id" element={<AfterConfirm />} />
              <Route path="/afterretrieve/:id" element={<AfterRetrieve />} />
              <Route path="/cancelreservation/:id" element={<CancelReservation />} />
              <Route path="/errorconfirm/:id" element={<ErrorConfirm />} />
              <Route path="/cancel" element={<Cancel />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/locker-station/:id" element={<LockerStationInfo />} />
              <Route path="/locker-station/:id_station/locker/:id_locker" element={<LockerInfo />} />
              <Route path="/bitacora" element={<Bitacora />} />
              <Route path="/bitacora/locker-station/:id_station/locker/:id_locker" element={<BitacoraShow />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>

          {/* Bottom Bar */}
          <Options className="bottom-bar"/>
        </div>
      </Router>
    </div>
  );
};

export default App;
