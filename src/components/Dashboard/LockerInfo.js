import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api_url } from '../../GlobalVariables';
import { useNavigate } from 'react-router-dom';
import './LockerInfo.css'; // Import a CSS file for your styles
import { useParams } from 'react-router-dom';

const LockerInfo = () => {
  const { id_station, id_locker } = useParams();
  const [usageData, setUsageData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [clientsData, setClientsData] = useState([]);
  const [operatorsData, setOperatorsData] = useState([]);
  const [ecommerceData, setEcommerceData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1200); 

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

 

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch lockers data
    axios.get(api_url + 'lockers/')
      .then(response => {
        if (response.data.length === 0) {
          setError("There aren't any lockers in this station.");
          setLoading(false);
        } else {
          const filteredData = response.data.filter(item => item.id === parseInt(id_locker));
          setUsageData(filteredData);
  
          
  
          fetchHistoryData();
          fetchClientsAndOperators();
          
        }
        
      })
      .catch(error => {
        setError('Error fetching data. Please try again later.');
        setLoading(false);
        console.error('Error fetching data:', error);
      });
  }, [id_locker]);

// Fetch and update historyData
  const fetchHistoryData = async () => {
    try {
      const reservationStates = await axios.get(api_url + "reservations/");
      // const confirmedStates = await axios.get(api_url + "confirmed-states/");
      // const loadedStates = await axios.get(api_url + "loaded-states/");
      // const deliveredStates = await axios.get(api_url + "delivered-states/");
      // const cancelledStates = await axios.get(api_url + "cancelled-states/");

      // Filter history data for the specific locker
      const filterHistoryData = (historyData) => {
        return historyData.filter(item => item.locker === parseInt(id_locker) && item.locker_station === parseInt(id_station));
      };

      const filteredReservationStates = filterHistoryData(reservationStates.data);
      setHistoryData(filteredReservationStates);

    } catch (error) {
      setError('Error fetching history data. Please try again later.');
      console.error('Error fetching history data:', error);
    }
  };

  const fetchClientsAndOperators = async () => {
    try {
      const clientsResponse = await axios.get(api_url + "clients/");
      const operatorsResponse = await axios.get(api_url + "operators/");
      const ecommerceResponse = await axios.get(api_url + "ecommerce/");

      setClientsData(clientsResponse.data);
      setOperatorsData(operatorsResponse.data);
      setEcommerceData(ecommerceResponse.data);
      setLoading(false);

    } catch (error) {
      setError('Error fetching clients and operators data. Please try again later.');
      console.error('Error fetching clients and operators data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1200); // Update isPC when the window is resized
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleGoBack= () => {
    navigate(-1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = historyData.slice(indexOfFirstItem, indexOfLastItem);
  // console.log("usage",usageData);
  return (
    <div>
      <h1> Locker</h1>

      {loading && (
        <p className='text-style'>Loading...</p>
      )}
      {error && (
        <p className='text-style'>{error}</p>
      )}

      { !loading && isMobile && (
          <p className='text-style'>This is only visible in a screen of more than 1200 pixels</p>
      )}

      {!loading && !error && !isMobile && (
        <>
        <h3> Current state </h3>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Nickname</th>
                <th>Size</th>
                <th>State</th>
                <th> Open ?</th>
                <th> Empty ? </th>
                <th>Pending reservation</th>
                <th>Forget package</th>
              </tr>
            </thead>
            <tbody>

            {usageData.length > 0 ? (
               usageData.map(item => (
                <tr key={item.id}>
                  <td>
                        {item.nickname}
                  </td>
                  <td>{item.width}x{item["length"]}x{item.height}</td>
                  <td>
                        {(() => {
                             switch (item.state) {
                              case 0:
                                  return 'Available';
                              case 1:
                                  return 'Reserved';
                              case 2:
                                  return 'Confirmed';
                              case 3:
                                  return 'Loaded';
                              case 4:
                                  return 'Used';
                              case 5:
                                  return 'Unloading';
                                  
                              case "Available":
                                return "Available";

                              case "Reserved":
                                return "Reserved";

                              case "Confirmed":
                                return "Confirmed";
  
                              case "Loading":
                                return "Loading";
  
                              case "Used":
                                return "Used";

                              case "Not used":
                                return "Error Loading";

                              case "Unloading":
                                return "Unloading";

                              case "Not Delivered":
                                return "Error Retrieving";

                              case "Completed":
                                return "Completed";
  
                              default:
                                  return 'Unknown State';
                            }
                        })()}
                  </td>
                  
                  <td style={{ color: item.is_open ? 'red' : 'black' }}>
                    {item.is_open ? 'Open' : 'Closed'}
                  </td>

                  <td style={{ color: item.is_open ? 'red' : 'black' }}>
                    {item.is_empty ? 'Used' : 'Empty'}
                  </td>

                  <td>
                    {historyData.some(
                      (item) =>
                        item.locker === parseInt(id_locker) &&
                        item.locker_station === parseInt(id_station) &&
                        item.state === 'reserved' &&
                        new Date(item.reservation_date).getTime() >=
                          new Date().getTime() + 5 * 24 * 60 * 60 * 1000
                    ) ? (
                      <span style={{ color: 'red' }}>● (Expired)</span>
                    ) : (
                      <span style={{ color: 'green' }}>● (No)</span>
                    )}
                  </td>

                  <td>
                    {historyData.some(
                      (item) =>
                        item.locker === parseInt(id_locker) &&
                        item.locker_station === parseInt(id_station) &&
                        item.state === 'used' &&
                        new Date(item.reservation_date).getTime() >=
                          new Date().getTime() + 5 * 24 * 60 * 60 * 1000
                    ) ? (
                      <span style={{ color: 'red' }}>● (Expired)</span>
                    ) : (
                      <span style={{ color: 'green' }}>● (No)</span>
                    )}
                  </td>

                </tr>
              ))
            ) : (
              <tr style={{ backgroundColor: '#F5C6FD' , color: 'black' }}>
                <td colSpan="7"> No data available</td>
              </tr>
            )}
             
            </tbody>
          </table>
          
          <h3> Historical </h3>


          <table className="history-table">
            <thead>
              <tr>
                <th> Reservation Id</th>
                <th> Ecommerce </th>
                <th>State</th>
                <th> Client </th>
                <th> Operator </th>
                <th> Date Reserved</th>
                <th> Date Confirmated </th>
                <th> Date Loaded </th>
                <th> Date Retrieved  </th>
                <th> Date Cancelled  </th>
              </tr>
            </thead>
            <tbody>
            {currentItems.length > 0 ? (
              currentItems.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>

                  <td> 
                  {  ecommerceData.find(ecommerce => ecommerce.id === item.ecommerce) ? (
                        // Find the ecommerce data based on the ecommerce_id
                        `${ecommerceData.find(ecommerce => ecommerce.id === item.ecommerce).name}`
                      ) : (
                        '--'
                      )}
                  </td>

                  <td style={{ color: item.state === 'cancelled' ? 'red' : (item.state === 'delivered' ? 'green' : 'inherit') }}>
                    {item.state || 'N/A'}
                  </td>


                  <td>
                    {clientsData.find(client => client.id === item.client) ? 
                      `${clientsData.find(client => client.id === item.client).name || 'N/A'} ${clientsData.find(client => client.id === item.client).last_name || 'N/A'}` : 
                      'N/A'
                    }
                  </td>
                  <td>
                    {operatorsData.find(operator => operator.id === item.operator) ? 
                      `${operatorsData.find(operator => operator.id === item.operator).name || 'N/A'} ${operatorsData.find(operator => operator.id === item.operator).last_name || 'N/A'}` : 
                      'N/A'
                    }
                  </td>
                  <td>
                    {item.reservation_date ? new Date(item.reservation_date).toLocaleDateString('en-GB') : '--'}
                  </td>

                  <td>
                    {item.confirmation_date ? new Date(item.confirmation_date).toLocaleDateString('en-GB') : '--'}
                  </td>

                  <td>
                    {item.loading_date ? new Date(item.loading_date).toLocaleDateString('en-GB') : '--'}
                  </td>

                  <td>
                    {item.delivered_date ? new Date(item.delivered_date).toLocaleDateString('en-GB') : '--'}
                  </td>
                  
                  <td>
                    {item.cancelled_date ? new Date(item.cancelled_date).toLocaleDateString('en-GB') : '--'}
                  </td>

                </tr>
              ))
            )  : (
              <tr style={{ backgroundColor: '#F5C6FD' , color: 'black' }}>
                <td colSpan="10"> No data available</td>
              </tr>
            )}
           
            </tbody>
          </table>


        {historyData.length > itemsPerPage && (
          <div className="button-container-3">
              <button
                className="pagination-button"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className="pagination-button"
                onClick={handleNextPage}
                disabled={indexOfLastItem >= historyData.length}
              >
                Next
              </button>
            </div>
          )}

        </>
      )}
    <div className="goback-button-container">
        <button className="goback-button" onClick={handleGoBack}>
            Go back
        </button>
    </div>


    </div>
  );
};

export default LockerInfo;
