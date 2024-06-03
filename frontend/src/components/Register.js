import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, googleProvider } from '../config/firebase'
import { createUserWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from 'firebase/auth'
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';

const Register = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmpassword, setConfirmPassword] = useState("")
    const [loggedIn, setLoggedIn] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")

    const navigate = useNavigate();

    async function handleFormSubmit(e) {
        e.preventDefault()

        if (confirmpassword === password) {
            try {
                await createUserWithEmailAndPassword(auth, email, password)
                setLoggedIn(true)
                navigate('/Login')
            } catch (err) {
                console.log(err)
				setErrorMessage(err.message)
            }
        } else {
			setErrorMessage("Passwords do not match!")
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
        return (
            <div>
                Welcome back { auth.currentUser.displayName }!
            </div>
        )
    } else  {
        return (
            <div className="App-header">
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
                        Sign up
                    </Typography>
					<Box component="form" onSubmit={handleFormSubmit} noValidate sx={{ mt: 1 }}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email-address"
							label="email address"
							name="email"
                            type="email"
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
                        <TextField
							margin="normal"
							required
							fullWidth
							name="confirmpassword"
							label="confirm password"
							type="password"
							id="confirmpassword"
							autoComplete="current-password"
							onChange={(e) => setConfirmPassword(e.target.value)}
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
						<Typography sx={{ color: 'white', fontWeight: 'normal', alignSelf: 'flex-start'}}>
							{ errorMessage }
						</Typography>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2, borderRadius: '40px', backgroundColor: 'black' }}
						>
							Sign up
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
							Sign up with Google
						</Button>
                        <Link
                            href="./Login"
                            variant="body2"
                            sx={{
                                display: 'block',
                                color: 'white',
                                textAlign: 'center',
                                marginTop: 2 // Optional: Add some margin to the top if needed
                            }}
                            >
                            {"Already have an account? Sign in"}
                        </Link>
						</Box>
					</Box>
					</Container>
                {/* <div>Register</div>
                <form className="form" onSubmit={handleFormSubmit}>
                    <div className="inputs">
                        <div>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 rounded-t-md bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
                            onChange={(e) => {
                                setEmail(e.target.value)
                                console.log("email input changed")
                            }}
                        />
                        </div>
                        <div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 rounded-t-md bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        </div>
                        <div>
                        <input
                            id="confirmpassword"
                            name="confirmpassword"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 rounded-t-md bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm"
                            placeholder="Confirm Password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        </div>
                    </div>
                    <div>
                        <button
                        type="submit"
                        >
                        Login
                        </button>
                    </div>
                    <div>
                        <button onClick={signInWithGoogle}>Sign in with Google</button>
                    </div>
                    <div>
                        <div>
                        <a href="/login">Already have an account? Login</a>
                        </div>
                    </div>
                </form> */}
            </div>
        );
    }
}
 
export default Register;