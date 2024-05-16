import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';


function Page1() {
    return (
      <div className="App">
        <header className="App-header">
          <Button variant="contained" color="primary">
            <Link to="/page_2" style={{ textDecoration: 'none', color: 'inherit' }}>Begin Session</Link>
          </Button>
        </header>
      </div>
    );
  }

export default Page1;