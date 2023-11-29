import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Options = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPC, setIsPC] = useState(window.innerWidth > 1199); // Set a threshold width for PC

  useEffect(() => {
    const handleResize = () => {
      setIsPC(window.innerWidth > 1199); // Update isPC when the window is resized
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLoad = () => {
    navigate('/load');
  };

  // const handleConfirmation = () => {
  //   navigate('/confirmation');
  // };

  const handleRetrieve = () => {
    navigate('/retrieve');
  };

  const handleCancel = () => {
    navigate('/cancel');
  };

  const handleHome = () => {
    navigate('/');
  };
  
  const getButtonColor = (path) => {
    if (path === "/cancel"){
      return location.pathname === path ? '#d23100' : '#007bff';
    }
    else{
      if (path === "/"){
        return location.pathname === path ? '#ecc08d' : '#007bff';
      }
      else{
        return location.pathname === path ? '#A4DA87' : '#007bff';
      }
    }
    
  };



  if (location.pathname === "/confirmation"){
    return(
      <>
        {!isPC && (
        <div className='button-container-confirm'>
          <button style={{ backgroundColor: getButtonColor('/load') }} onClick={handleLoad}>
            Load
          </button>
          <button style={{ backgroundColor: getButtonColor('/retrieve') }} onClick={handleRetrieve}>
            Retrieve
          </button>
          <button style={{ backgroundColor: getButtonColor('/cancel') }} onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
      {isPC && (
        <div className='button-container-pc-confirm'>
          <button style={{ backgroundColor: getButtonColor('/') }} onClick={handleHome}>
            Home
          </button>
          <button style={{ backgroundColor: getButtonColor('/load') }} onClick={handleLoad}>
            Load
          </button>
          <button style={{ backgroundColor: getButtonColor('/retrieve') }} onClick={handleRetrieve}>
            Retrieve
          </button>
          <button style={{ backgroundColor: getButtonColor('/cancel') }} onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
    </>
    );
}
else{
  return (
    <>
      {!isPC && (
        <div className='button-container'>
          {/* <button style={{ backgroundColor: getButtonColor('/confirmation') }} onClick={handleConfirmation}>
            Confirmation
          </button> */}
          <button style={{ backgroundColor: getButtonColor('/load') }} onClick={handleLoad}>
            Load
          </button>
          <button style={{ backgroundColor: getButtonColor('/retrieve') }} onClick={handleRetrieve}>
            Retrieve
          </button>
          <button style={{ backgroundColor: getButtonColor('/cancel') }} onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
       {isPC && (
        <div className='button-container-pc'>
          <button style={{ backgroundColor: getButtonColor('/') }} onClick={handleHome}>
            Home
          </button>
  
          {/* <button style={{ backgroundColor: getButtonColor('/confirmation') }} onClick={handleConfirmation}>
            Confirmation
          </button> */}
          <button style={{ backgroundColor: getButtonColor('/load') }} onClick={handleLoad}>
            Load
          </button>
          <button style={{ backgroundColor: getButtonColor('/retrieve') }} onClick={handleRetrieve}>
            Retrieve
          </button>
          <button style={{ backgroundColor: getButtonColor('/cancel') }} onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
    </>
  );
}

};

export default Options;
