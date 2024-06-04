import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import {Typography, Box } from '@mui/material';
import Logo from './logo.png';
import AppName from './appname.png';
import { useNavigate } from 'react-router-dom'
import { auth } from '../config/firebase'
import { onAuthStateChanged } from 'firebase/auth'


function BeginSession() {
	const [loggedIn, setLoggedIn] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setLoggedIn(true)
            } else {
                setLoggedIn(false)
				navigate('/login')
            }
        })
    }, [])

	if (!loggedIn)
	{
		navigate('/login')
	} else {
		return (
			<div className="App">
				<header className="App-header">
          <img  src={Logo} style={{marginBottom: '15px' }} alt="Logo"/>
		  	<Typography variant="h4" style={{ color: '#FFFFFF', fontSize: '2.8rem' }}>
                Focus View
        	</Typography>
			<Button variant="contained" color="inherit" style={{borderRadius: 20,  marginTop: '10px', marginBottom: '20px' }}>
            	<a href='/calibration' style={{ textDecoration: 'none', color: 'inherit',fontSize: '14px' }}>Begin Session</a>
         	</Button>
				</header>
			</div>
		);
	}
}
export default BeginSession;