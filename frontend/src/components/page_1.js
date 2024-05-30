import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
// import Stack from '@mui/material/Stack';



function Page1() {
    return (
      <div className="App">
        <header className="App-header">
          <Button variant="contained" color="inherit">
            {/* <Link to="/page_2" style={{ textDecoration: 'none', color: 'inherit' }}>Begin Session</Link> */}
            <a href='/page_2' style={{ textDecoration: 'none', color: 'inherit' }}>Begin Session</a>
          </Button>
        </header>
      </div>
    );
  }

export default Page1;