import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api_url } from '../../GlobalVariables';
import { useParams } from 'react-router-dom';


const AfterLoad = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operatorData, setOperatorData] = useState({});
  const [lockerData, setLockerData] = useState({});
  const [lockerStationData, setLockerStationData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    axios.get(api_url + 'reservations/')
      .then(response => {
        console.log(response);
        if (response.data.length === 0) {
          setError("There aren't any available packages.");
        } else {
          const selectedReservation = response.data.find(item => item.id === parseInt(id));
          setData(selectedReservation);

          // Fetch client data
          axios.get(api_url + `operators/${selectedReservation.operator}/`)
            .then(operatorResponse => {
              setOperatorData(operatorResponse.data);
            })
            .catch(operatorError => {
              console.error('Error fetching client data:', operatorError);
              setError('Error fetching data. Please try again later.');
              setLoading(false);
            });

          // Fetch locker data
          axios.get(api_url + `lockers/${selectedReservation.locker}/`)
            .then(lockerResponse => {
              setLockerData(lockerResponse.data);
            })
            .catch(lockerError => {
              console.error('Error fetching locker data:', lockerError);
              setError('Error fetching data. Please try again later.');
              setLoading(false);
            });

          // Fetch locker station data
          axios.get(api_url + `locker-stations/${selectedReservation.locker_station}/`)
            .then(lockerStationResponse => {
              setLockerStationData(lockerStationResponse.data);
            })
            .catch(lockerStationError => {
              console.error('Error fetching locker station data:', lockerStationError);
              setError('Error fetching data. Please try again later.');
              setLoading(false);
            });
        }
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching data. Please try again later.');
        setLoading(false);
        console.error('Error fetching data:', error);
      });
  }, [id]);

  return (
    <div>
      <h1>Package Info: </h1>
      {loading && (
        <p>Loading...</p>
      )}
      {error && (
        <p>{error}</p>
      )}
      {!loading && !error && (
        <div>
          {
            <div className="reservation-message" key={data.id}>
              <p>
                Muchas gracias {operatorData.name} {operatorData.last_name} por depositar el paquete en el lugar informado en el correo ( locker '{lockerData.nickname}' de la estación ubicada en {lockerStationData.address},{lockerStationData.city}).
              </p>
              <p> Ahora notificaremos al cliente para que puede ir a retirarlo. </p>
              <p>Muchas gracias por preferirnos, y esperamos que sigas trabagando con nosotros.</p>
            </div>
          }
        </div>
      )}
    </div>
  );
};

export default AfterLoad;
