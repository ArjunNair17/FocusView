import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField'; // Import TextField from Material-UI

function Page2() {
  // State variables for each input field
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  

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
    window.hours = hours
    window.minutes = minutes
    window.seconds = seconds
    console.log("Hours, minutes, seconds", window.hours, window.minutes, window.seconds); // Debugging
  };

  return (
    <div className="App">
      <header className="App-header">
        
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
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <FormGroup row>
            <FormControlLabel control={<Checkbox />} label="Posture" />
            <FormControlLabel control={<Checkbox />} label="Phone Use" />
            <FormControlLabel control={<Checkbox />} label="Skin Biting" />
            <FormControlLabel control={<Checkbox />} label="Nail Picking" />
          </FormGroup>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' , width: '300px'}}>
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
