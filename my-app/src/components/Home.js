import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [isPC, setIsPC] = useState(window.innerWidth > 1199); // Set a threshold width for PC

  const handleDash = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    const handleResize = () => {
      setIsPC(window.innerWidth > 1199); // Update isPC when the window is resized
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Run the effect only once on mount

  return (
    <>
      <div className="text-style">
        <h1>Welcome!</h1>
        Please select one of the options below.
      </div>

      {isPC && (
        <>
          <div className="text-style">
          Or you can check the dashboard
          <br></br>
          (only on pc)
          </div>

          <button onClick={handleDash} className="button-style-dash">
            Dashboard
          </button>
        </>
      )}
    </>
  );
};

export default Home;
