import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { api_url } from '../GlobalVariables';

const Cancel = () => {
  const navigate = useNavigate();
  const [rut, setRut] = useState('');
  const [code, setCode] = useState('');
  const [rutError, setRutError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  

  const validateRut = (rut) => {
    const rutRegex = /^[0-9Kk]+$/;
    return rutRegex.test(rut);
  };

  const validateCode = (code) => {
    return code.length === 8;
  };

  const handleRutChange = (e) => {
    const rut = e.target.value;
    setRut(rut);
    setRutError(validateRut(rut) ? '' : 'Please write a valid RUT');
  };

  const handleCodeChange = (e) => {
    const code = e.target.value;
    setCode(code);
    setCodeError(validateCode(code) ? '' : 'Code must be 8 characters long');
  };

  const handleCancel = async () => {
  try {
    if (rut.trim() === '' || !validateRut(rut)) {
      setRutError('Invalid email format. Please enter a valid email.');
      return;
    }

    if (code.trim() === '' || !validateCode(code)) {
      setCodeError('Code must be 8 characters long');
      return;
    }

    // Fetch clients
    const clientsResponse = await axios.get(api_url + 'clients/');
    const filteredData = clientsResponse.data.find(item => item.rut === String(rut));
    // console.log(filteredData);

    // Fetch reservations
    const reservationsResponse = await axios.get(api_url + 'reservations/');
    const reservationData = reservationsResponse.data.find(
      item => item.reservation_code === parseInt(code) && item.client === filteredData.id
    );

    // Log here to verify the correct reservationData
    // console.log('reservationData:', reservationData);


    console.log('Cancel package', { rut, code });
    console.log('reservationId', { reservationData });

    // POST or navigate to the desired route
    try {
      const response = await axios.post(api_url + 'canceled-reservation/', {
        reservation_code: code,
      });
      console.log(response.data);  
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }

    navigate(`/cancelreservation/${reservationData.id}`);
    // navigate('/cancelreservation');
  } catch (error) {
    console.error('Error fetching data:', error);
    setErrorMessage('Rut or Code invalid');
  }
};

  
  

  return (
    <div >
      <h1>Cancel Package</h1>
      <form>
        <label>
          Rut:
          <div style={{fontSize: '9px'}}>ej: 12987654K </div>
          <input
            type="text"
            value={rut}
            onChange={handleRutChange}
            name="cancel_rut"
          />
          {rutError && <div style={{ color: 'red', fontSize: '10px'}}>{rutError}</div>}
        </label>
        <br />
        <label>
          Code:
          <input
            type="password"
            value={code}
            onChange={handleCodeChange}
            name="cancel_code"
          />
          {codeError && <div style={{ color: 'red', fontSize: '10px'}}>{codeError}</div>}
        </label>

        {errorMessage && (
          <div style={{color: 'white',  backgroundColor: '#F34242', fontSize: '14px', padding: '10px', textAlign: 'center', borderRadius: '5px', margin: '10px 0', }}>
            {errorMessage}
          </div>
        )}

        <br />
        <div className='center-button'>
          <button 
            type="button" 
            className="button-submit-error" 
            onClick={handleCancel} 
            disabled={rut.trim() === '' || code.trim() === '' || rutError !== '' || codeError !== ''}
            >
              Cancel Package
          </button>
        </div>
      </form>

    </div>
    
  );
};

export default Cancel;
