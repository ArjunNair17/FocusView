import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField'; // Import TextField from Material-UI
import Webcam from "react-webcam";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

function Page2() {
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
    window.hours = hours;
    window.minutes = minutes;
    window.seconds = seconds;
    console.log("Hours, minutes, seconds", window.hours, window.minutes, window.seconds); // Debugging
  };

  const videoConstraints = {
    width: 535, // Adjust the width to your desired size
    height: 300, // Adjust the height to your desired size
    facingMode: 'user',
  };

  useEffect(() => {
    socketRef.current = io('http://127.0.0.1:5000', {
      transports: ['websocket'],
    });

    socketRef.current.on('response', (data) => {
        console.log(data);
    });

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp8' });

        mediaRecorder.ondataavailable = async (event) => {
          if (event.data.size > 0) {
            const blob = event.data;
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const videoElement = videoRef.current;
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
              const reader = new FileReader();
              reader.onload = () => {
                const buffer = new Uint8Array(reader.result);
                socketRef.current.emit('videoData', buffer);
              };
              reader.readAsArrayBuffer(blob);
            }, 'image/jpeg');
          }
        };

        mediaRecorder.start(100);
      })
      .catch(error => {
        console.error('Error accessing webcam:', error);
      });

    return () => {
      // Clean up
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);



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
           <video ref={videoRef} width="640" height="480" autoPlay />
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
          <Button variant="contained" color="primary">
            <Link to="/page_3" style={{ textDecoration: 'none', color: 'inherit' }}>cancel</Link>
          </Button>
          
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            <Link to="/page_3" style={{ textDecoration: 'none', color: 'inherit' }}>Begin</Link>
          </Button>
        </div>

        
      </header>
    </div>
  );
}

export default Page2;