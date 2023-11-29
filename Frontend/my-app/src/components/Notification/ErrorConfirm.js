import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api_url } from '../../GlobalVariables';
import { useParams } from 'react-router-dom';


const ErrorConfirm = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operatorData, setOperatorData] = useState({});
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

          // Fetch operator data
          axios.get(api_url + `operators/${selectedReservation.operator}/`)
            .then(operatorResponse => {
              setOperatorData(operatorResponse.data);
            })
            .catch(operatorError => {
              console.error('Error fetching client data:', operatorError);
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
                Muchas gracias {operatorData.name} {operatorData.last_name} por informar errores en las dimensiones del paquete.
              </p>

              <p> 
                Procederemos a informar a la ecommerce sobre el error ocurrido.
              </p>


              <p>Muchas gracias por preferirnos, y esperamos que sigas trabagando con nosotros.</p>
            </div>
          }
        </div>
      )}
    </div>
  );
};
export default ErrorConfirm;
