import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Logo from './logo.png';
import AppName from './appname.png';
import { useNavigate } from 'react-router-dom'
import { auth, googleProvider } from '../config/firebase'
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from 'firebase/auth'


function Page1() {
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
          <img  src={Logo} style={{marginBottom: '20px' }} alt="Logo"/ >
          <img  src={AppName} style={{marginBottom: '20px' }} alt="Logo"/>
					<Button variant="contained" color="inherit" style={{borderRadius: 20, marginBottom: '20px' }}>
            <a href='/page_2' style={{ textDecoration: 'none', color: 'inherit' }}>Begin Session</a>
          </Button>
				</header>
			</div>
		);
	}
}
export default Page1;