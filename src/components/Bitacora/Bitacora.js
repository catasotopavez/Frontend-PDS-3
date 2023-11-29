import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api_url } from '../../GlobalVariables';
import './Bitacora.css'; // Import a CSS file for your styles

const Bitacora = () => {
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);

  const [lockerStations, setLockerStations] = useState([]);
  const [lockerStation, setLockerStation] = useState('');
  const [lockers, setLockers] = useState([]);
  const [locker, setLocker] = useState('');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1200); // Update isPC when the window is resized
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Fetch locker stations when the component mounts
    axios.get(api_url + 'locker-stations/')
      .then(response => {
        const sortedLockerStations = response.data.sort((a, b) => a.name.localeCompare(b.name));
        setLockerStations(sortedLockerStations);
      })
      .catch(error => {
        console.error('Error fetching locker stations:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch lockers based on the selected station
    if (lockerStation) {
      axios.get(api_url + `lockers/`)
        .then(response => {
          const filteredLockers = response.data.filter(locker => locker.station === parseInt(lockerStation));
          const sortedLockers = filteredLockers.sort((a, b) => {
            const nameA = typeof a.nickname === 'string' ? a.nickname.toLowerCase() : a.nickname.toString();
            const nameB = typeof b.nickname === 'string' ? b.nickname.toLowerCase() : b.nickname.toString();
            return nameA.localeCompare(nameB);
          });
          
  
          setLockers(sortedLockers);
        })
        .catch(error => {
          console.error('Error fetching lockers:', error);
        });
    } else {
      setLockers([]); // Reset lockers when no station is selected
    }
  }, [lockerStation]);

 


  const handleGoBack= () => {
    navigate(-1);
  };


  const handleStationChange = (e) => {
    const station = e.target.value;
    setLockerStation(station);
    // Reset locker when station changes
    setLocker('');
  };

  const handleLockerChange = (e) => {
    const selectedLocker = e.target.value;
    setLocker(selectedLocker);
  };

  const handleBitacora = async () => {
    console.log("station:", lockerStation, " ,  locker:", locker);
    navigate(`/bitacora/locker-station/${lockerStation}/locker/${locker}`);
  };

  return (
    <div>
      <h1> Bitacora</h1>

      {isMobile && (
          <p className='text-style'>This is only visible in a screen of more than 1200 pixels</p>
      )}
      {!isMobile && (

        <form className="bitacora-form">
            <div className="form-group">
            <label htmlFor="bitacora_station">Locker Station:</label>
            <select
                value={lockerStation}
                onChange={handleStationChange}
                name="bitacora_station"
                className="select-box"
            >
                <option value="">Select Locker Station</option>
                {lockerStations.map(station => (
                <option key={station.id} value={station.id}>
                    {station.name}
                </option>
                ))}
            </select>
            </div>

            <div className="form-group">
            <label htmlFor="bitacora_locker">Locker:</label>
            <select
                value={locker}
                onChange={handleLockerChange}
                name="bitacora_locker"
                disabled={!lockerStation}
                className="select-box"
            >
                <option value="">Select Locker</option>
                {lockers.map(locker => (
                <option key={locker.id} value={locker.id}>
                    {locker.nickname}
                </option>
                ))}
            </select>
            </div>

            <div className='center-button'>
            <button
                type="button"
                className="button-submit-search"
                onClick={handleBitacora}
                disabled={lockerStation.trim() === '' || locker.trim() === ''}
            >
                Search
            </button>
            </div>
        </form>
      )}

    <div className="goback-button-container">
        <button className="goback-button" onClick={handleGoBack}>
            Go back
        </button>
    </div>

    </div>
  );
};

export default Bitacora;
