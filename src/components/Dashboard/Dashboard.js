import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api_url } from '../../GlobalVariables';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import a CSS file for your styles

const Dashboard = () => {
  const [usageData, setUsageData] = useState([]);
  const [reservedData, setReservedData] = useState([]);
  const [averageReservationLoadTime, setAverageReservationLoadTime] = useState({});
  const [averageReservationLoadTimeRetrieve, setAverageReservationLoadTimeRetrieve] = useState({});
  const [reservationsCount, setReservationsCount] = useState({});
  const [totalReservations, setTotalReservations] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1200); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(api_url + 'locker-stations/')
      .then(response => {
        // console.log(response);
        if (response.data.length === 0) {
          setError("There aren't any locker stations.");
        } else {
          setUsageData(response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching data. Please try again later.');
        setLoading(false);
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    calculateAverageTimes();
    calculateAverageTimes_retrieve();
  }, [reservedData]); // Run the effect whenever reservedData changes

  const calculateAverageTimes = () => {
    const avgTimes = {};
  
    reservedData.forEach(reservation => {
      const stationId = reservation.locker_station;
  
      if (reservation.reservation_date && reservation.loading_date) {
        const reservationDate = new Date(reservation.reservation_date);
        const loadingDate = new Date(reservation.loading_date);
        const timeDifference = loadingDate - reservationDate;
        const hoursDifference = timeDifference / (1000 * 60 * 60);
  
        // Ensure the value is not less than 0
        avgTimes[stationId] = Math.max((avgTimes[stationId] || 0) + hoursDifference, 0);
      }
    });
  
    // Calculate average time for each locker station
    Object.keys(avgTimes).forEach(stationId => {
      avgTimes[stationId] /= reservationsCount[stationId] || 1;
    });
  
    setAverageReservationLoadTime(avgTimes);
  };
  
  const calculateAverageTimes_retrieve = () => {
    const avgTimes = {};
  
    reservedData.forEach(reservation => {
      const stationId = reservation.locker_station;
  
      if (reservation.delivered_date && reservation.loading_date) {
        const loadingDate = new Date(reservation.loading_date);
        const deliveringDate = new Date(reservation.delivered_date);
        const timeDifference = deliveringDate - loadingDate;
        const hoursDifference = timeDifference / (1000 * 60 * 60);
  
        // Ensure the value is not less than 0
        avgTimes[stationId] = Math.max((avgTimes[stationId] || 0) + hoursDifference, 0);
      }
    });
  
    // Calculate average time for each locker station
    Object.keys(avgTimes).forEach(stationId => {
      avgTimes[stationId] /= reservationsCount[stationId] || 1;
    });
  
    setAverageReservationLoadTimeRetrieve(avgTimes);
  };



  useEffect(() => {
    fetchReservationsCount();
  }, []); // Run the effect only once on mount

  const fetchReservationsCount = async () => {
    try {
      const reservationsResponse = await axios.get(api_url + 'reservations/');
      const counts = {};
      let total = 0;

      reservationsResponse.data.forEach(reservation => {
        const stationId = reservation.locker_station;
        counts[stationId] = (counts[stationId] || 0) + 1;
        total += 1;
      });

      setReservedData(reservationsResponse.data);
      setReservationsCount(counts);
      setTotalReservations(total);
    } catch (error) {
      setError('Error fetching reservations data. Please try again later.');
      console.error('Error fetching reservations data:', error);
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
    navigate("/");
  };

  const calculateUsagePercentage = (stationId) => {
    const count = reservationsCount[stationId] || 0;
    return totalReservations > 0 ? ((count / totalReservations) * 100).toFixed(1) : 0;
  };

  return (
    <div>
      <h1>Dashboard</h1>

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
          <div className="dashboard-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th> Station </th>
                  <th> Location </th>
                  <th> N° lockers </th>
                  <th> Status </th>
                  <th> Usage (%)</th>
                  <th> Avg. reserved-load time </th>
                  <th> Avg. load-retrieve time </th>
                </tr>
              </thead>
              <tbody>

              {currentItems.length > 0 ? (
                currentItems.map(item => (
                  <tr key={item.id}>
                    <td>
                    <span className="underline-link" onClick={() => navigate(`/locker-station/${item.id}`)}>
                      {item.name}
                    </span>

                      </td>
                    <td>{item.address}, {item.city}</td>
                    <td>{item.num_lockers}</td>
                    <td>
                      {item.state === 'A' ? (
                        <span style={{ color: 'green' }}>●</span>
                      ) : (
                        <span style={{ color: 'red' }}>●</span>
                      )}
                    </td>

                    <td>{calculateUsagePercentage(item.id)}%</td>

                    <td>{averageReservationLoadTime[item.id]?.toFixed(2) || '--- '} hours</td>
                    
                    <td>{averageReservationLoadTimeRetrieve[item.id]?.toFixed(2) || '--- '} hours</td>

                  </tr>
                ))
              ) : (
                <tr style={{ backgroundColor: '#F5C6FD' , color: 'black' }}>
                  <td colSpan="7"> No data available</td>
                </tr>
              )}

              </tbody>
            </table>

            
            
          </div>
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
            Go Home
        </button>
    </div>
    </div>
  );
};

export default Dashboard;
