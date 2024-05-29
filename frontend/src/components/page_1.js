import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
// import Stack from '@mui/material/Stack';
import Logo from './logo.png';
import AppName from './appname.png';



function Page1() {
    return (
      <div className="App">
        <header className="App-header">
          <img  src={Logo} style={{marginBottom: '20px' }} alt="Logo"/ >
          <img  src={AppName} style={{marginBottom: '20px' }} alt="Logo"/>
          <Button variant="contained" color="inherit" style={{borderRadius: 20, marginBottom: '20px' }}>
            {/* <Link to="/page_2" style={{ textDecoration: 'none', color: 'inherit' }}>Begin Session</Link> */}
            <a href='/page_2' style={{ textDecoration: 'none', color: 'inherit' }}>Begin Session</a>
          </Button>
        </header>
      </div>
    );
  }

export default Page1;