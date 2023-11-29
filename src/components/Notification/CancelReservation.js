import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api_url } from '../../GlobalVariables';

import { useParams } from 'react-router-dom';

const CancelReservation = () => {
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id} = useParams();

  useEffect(() => {
    axios.get(api_url + 'reservations/')
      .then(response => {
        console.log(response.data);
        if (response.data.length === 0){
          setError("There aren't any available packages.")
        }
        else{
          // console.log(id);
          const selectedReservation = response.data.find(item => item.id === parseInt(id));
          // console.log(selectedReservation);
          setData(selectedReservation);
        }
        setLoading(false);
        
      })
      .catch(error => {
        setError('Error fetching data. Please try again later.');
        setLoading(false);
        console.error('Error fetching data:', error);
      });
  }, []);

  console.log("data",data);
  return (
    <div >
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
             Has cancelado exitosamente la reserva asociada al código '{data.reservation_code}'.
           </p>
           <p>Esperamos que tengas un buen día.</p>
         </div>
           }
       </div>
      )}
    </div>
    
  );
};

export default CancelReservation;
