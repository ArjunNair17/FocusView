import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField'; // Import TextField from Material-UI
// import Webcam from "react-webcam";
import Popup from 'reactjs-popup';
import { useEffect, useRef, useState } from 'react';

import 'reactjs-popup/dist/index.css';

function Calibration() {
  // State variables for each input field
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef(null);
  const socketRef = useRef(null);



  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const cleanupVideoStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  // Function to handle changes in each input field
  const handleHoursChange = (event) => {
    setHours(event.target.value);
  };

  const handleMinutesChange = (event) => {
    setMinutes(event.target.value);
  };

  const handleSecondsChange = (event) => {
    setSeconds(event.target.value);
  };

  // Function to handle submit button click
  const handleSubmit = () => {
    cleanupVideoStream();
    localStorage.setItem('hours', hours)
    localStorage.setItem('minutes', minutes)
    localStorage.setItem('seconds', seconds)
    // window.hours = hours;
    // window.minutes = minutes;
    // window.seconds = seconds;
    // console.log("Hours, minutes, seconds", window.hours, window.minutes, window.seconds); // Debugging
    // handleDisconnect();
  };

  const videoConstraints = {
    width: 535, // Adjust the width to your desired size
    height: 300, // Adjust the height to your desired size
    facingMode: 'user',
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      })
      .catch(error => {
        console.error('Error accessing webcam:', error);
      });

  
    return () => {
        cleanupVideoStream();
    };
    }
  , []);
  

 



  return (
    <div className="App">
      {/* Render the WebcamCapture component */}
     
      <header className="App-header">
        <div style={{ marginTop: '20px' }}>
             <video ref={videoRef} width="640" height="480" autoPlay />
        </div>
          <button onClick={openModal}>Trigger</button>
      <Popup
        open={isOpen}
        modal
        onClose={closeModal}
        contentStyle={{
          width: '623px',
          padding: '30px',
          borderRadius: '15px',
          height: '505px',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div style={{ marginTop: '10px' }}>Recalibrating...</div>
        <div style={{ marginTop: '30px' }}>
          {/* <video ref={videoRef} width="640" height="480" autoPlay /> */}
        </div>
        <div style={{ marginTop: '42px' }}>
        <Button variant="contained" color="primary" onClick={closeModal}>
          Cancel
        </Button>
        </div>
      </Popup>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          id="hours-input"
          label="Hours"
          variant="outlined"
          value={hours}
          onChange={handleHoursChange}
        />
        <TextField
          id="minutes-input"
          label="Minutes"
          variant="outlined"
          value={minutes}
          onChange={handleMinutesChange}
        />
        <TextField
          id="seconds-input"
          label="Seconds"
          variant="outlined"
          value={seconds}
          onChange={handleSecondsChange}
        />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <FormGroup row>
            <FormControlLabel control={<Checkbox />} label="Posture" />
            <FormControlLabel control={<Checkbox />} label="Phone Use" />
            <FormControlLabel control={<Checkbox />} label="Skin Biting" />
            <FormControlLabel control={<Checkbox />} label="Nail Picking" />
          </FormGroup>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '300px' }}>
          <Button variant="contained" color="inherit">
            <a href='/' style={{ textDecoration: 'none', color: 'inherit' }}>cancel</a>
            {/* <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>cancel</Link> */}
          </Button>
          
          <Button variant="contained" color="inherit" onClick={handleSubmit}>
            
            <a href='/session' style={{ textDecoration: 'none', color: 'inherit' }}>begin</a>
            {/* <Link to="/session" style={{ textDecoration: 'none', color: 'inherit' }}>Begin</Link> */}
          </Button>

            {/* <Button onClick={handleDisconnect}>
              Disconnect
            </Button> */}
        </div>

        
      </header>
    </div>
  );
}

export default Calibration;