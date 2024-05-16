import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';




function Page2() {
    return (
      <div className="App">
        <header className="App-header">
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
            
            <Button variant="contained" color="primary">
              <Link to="/page_3" style={{ textDecoration: 'none', color: 'inherit' }}>Begin</Link>
            </Button>
          </div>
          
        </header>
      </div>
    );
  }

export default Page2;

