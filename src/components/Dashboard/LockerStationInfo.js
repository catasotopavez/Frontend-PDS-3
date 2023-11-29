import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api_url } from '../../GlobalVariables';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import a CSS file for your styles
import { useParams } from 'react-router-dom';

const LockerStationInfo = () => {
  const { id } = useParams();
  const [usageData, setUsageData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(api_url + 'lockers/')
      .then(response => {
        // console.log(response);
        if (response.data.length === 0) {
          setError("There aren't any lockers in this stations.");
        } else {
            const filteredData = response.data.filter(item => item.station === parseInt(id));

            // console.log(filteredData);
            setUsageData(filteredData);

            fetchHistoryData();
        }
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching data. Please try again later.');
        setLoading(false);
        console.error('Error fetching data:', error);
      });
  }, []);


  const fetchHistoryData = async () => {
    try {
      const reservationStates = await axios.get(api_url + "reservations/");
      // const confirmedStates = await axios.get(api_url + "confirmed-states/");
      // const loadedStates = await axios.get(api_url + "loaded-states/");
      // const deliveredStates = await axios.get(api_url + "delivered-states/");
      // const cancelledStates = await axios.get(api_url + "cancelled-states/");

      // Filter history data for the specific locker
      const filterHistoryData = (historyData) => {
        return historyData.filter(item => item.locker_station === parseInt(id));
      };

      const filteredReservationStates = filterHistoryData(reservationStates.data);
      // const filteredConfirmedStates = filterHistoryData(confirmedStates.data);
      // const filteredLoadedStates = filterHistoryData(loadedStates.data);
      // const filteredDeliveredStates = filterHistoryData(deliveredStates.data);
      // const filteredCancelledStates = filterHistoryData(cancelledStates.data);

      // const combinedHistoryData = [
      //   ...filteredConfirmedStates,
      //   ...filteredLoadedStates,
      //   ...filteredDeliveredStates,
      //   ...filteredCancelledStates,
      // ];
      // console.log(combinedHistoryData);
      // setHistoryData(combinedHistoryData);

      // console.log(filteredReservationStates);
      setHistoryData(filteredReservationStates);

    } catch (error) {
      setError('Error fetching history data. Please try again later.');
      console.error('Error fetching history data:', error);
    }
  };


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1200); // Update isPC when the window is resized
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate the index of the first and last item to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = usageData.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleGoBack= () => {
    navigate(-1);
  };

  return (
    <div>
      <h1>Locker Station</h1>

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


            {currentItems.length > 0 ? (
              currentItems.map(item => (
                <tr key={item.id}>
                  <td>
                    <span className="underline-link" onClick={() => navigate(`/locker-station/${id}/locker/${item.id}`)}>
                        {item.nickname}
                    </span>
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
                      (item2) =>
                        item2.locker === parseInt(item.id) &&
                        item2.locker_station === parseInt(id) &&
                        item2.state === 'reserved' &&
                        new Date(item2.reservation_date).getTime() >=
                          new Date().getTime() + 5 * 24 * 60 * 60 * 1000
                    ) ? (
                      <span style={{ color: 'red' }}>● (Yes)</span>
                    ) : (
                      <span style={{ color: 'green' }}>● (No)</span>
                    )}
                  </td>

                  <td>
                    {historyData.some(
                      (item2) =>
                        item2.locker === parseInt(item.id) &&
                        item2.locker_station === parseInt(id) &&
                        item2.state === 'loaded' &&
                        new Date(item2.reservation_date).getTime() >=
                          new Date().getTime() + 5 * 24 * 60 * 60 * 1000
                    ) ? (
                      <span style={{ color: 'red' }}>● (Yes)</span>
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

          
          {usageData.length > itemsPerPage && (
            <div className="button-container-2">
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
                disabled={indexOfLastItem >= usageData.length}
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

export default LockerStationInfo;
