import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../App.css'; 
import Divider from '@mui/material/Divider';

// authentication imports
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, googleProvider } from '../config/firebase'
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from 'firebase/auth'

function Copyright(props) {
	return (
		<Typography variant="body2" color="text.secondary" align="center" {...props}>
			{'Copyright © '}
			<Link color="inherit" href="https://mui.com/">
				FocusView
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

const signUpBoxStyle = {

};

const horizontalLine = {
	display: 'block',
	width: '100%',
	height: '1px',
}

export default function Login() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loggedIn, setLoggedIn] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")

	const navigate = useNavigate();
	async function handleFormSubmit(e) {
		e.preventDefault()
		try {
			await signInWithEmailAndPassword(auth, email, password)
			setLoggedIn(true)
			navigate('/')
		} catch (error) {
			console.log(error)
			setErrorMessage(error.message)
		}
	}

	const signInWithGoogle = async () => {
		try {
			await signInWithPopup(auth, googleProvider)
			setLoggedIn(true)
		} catch (error) {
			console.error(error)
			setErrorMessage(error.message)
		}
	}

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setLoggedIn(true)
            } else {
                setLoggedIn(false)
            }
        })
    }, [])

    if (loggedIn)
    {
        navigate('/')
    } 
    else 
    {
        return (
            <ThemeProvider theme={defaultTheme}>
                <div className="App-header"> {/* Apply the class here */}
                    <Container component="main" >
                    <CssBaseline />
                    <Box
                        sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.3)', // Black color with 50% opacity
                        padding: '40px',
                        borderRadius: '10px',
                        width: '500px',  // Set the width to 100%
                        height: '100%', // Set the height to 100%
                        // minWidth: '500px', // Minimum height for the box
                        }}
                    >
                    <Typography component="h1" variant="h4" sx={{ color: 'white', fontWeight: 'bold', alignSelf: 'flex-start' }}>
                        Welcome back.<br />
                        Login to your account
                    </Typography>
                    <Box component="form" onSubmit={handleFormSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="email address"
                            name="email"
                            autoComplete="email"
                            onChange={(e) => setEmail(e.target.value)}
                            autoFocus
                            sx={{ 
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '40px',
                                    '& fieldset': {
                                    borderColor: 'white',
                                    borderWidth: '2px',
                                    },
                                    '&:hover fieldset': {
                                    borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                    borderColor: 'white',
                                    },
                                    '& .MuiOutlinedInput-input': {
                                    color: 'white',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'white',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'white',
                                }, 
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ 
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '40px',
                                    '& fieldset': {
                                    borderColor: 'white',
                                    borderWidth: '2px',
                                    },
                                    '&:hover fieldset': {
                                    borderColor: 'white',
                                    },
                                    '&.Mui-focused fieldset': {
                                    borderColor: 'white',
                                    },
                                    '& .MuiOutlinedInput-input': {
                                    color: 'white',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'white',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'white',
                                }, 
                            }}
                        />
						<Typography sx={{ color: 'white', fontWeight: 'normal', alignSelf: 'flex-start' }}>
							{ errorMessage }
						</Typography>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, borderRadius: '40px', backgroundColor: 'black' }}
                        >
                            Login
                        </Button>
                        <Divider sx={{ borderColor: 'white' }}>
                        <Typography variant="body2" sx={{ fontSize: '15px' }}>or</Typography>
                        </Divider>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ 
                                mt: 3, 
                                mb: 2, 
                                borderRadius: '40px', 
                                backgroundColor: 'transparent', 
                                textTransform: 'lowercase',
                                border: '2px solid white', // Added border property
                                color: 'white' // Ensure text color is white
                            }}
                            onClick={signInWithGoogle}
                        >
                            Sign in with Google
                        </Button>
                        <Link
                            href="./Register"
                            variant="body2"
                            sx={{
                                display: 'block',
                                color: 'white',
                                textAlign: 'center',
                                marginTop: 2 // Optional: Add some margin to the top if needed
                            }}
                            >
                            {"Don't have an account? Sign up"}
                        </Link>
                        </Box>
                    </Box>
                    </Container>
                </div>
            </ThemeProvider>
        );
    }
}