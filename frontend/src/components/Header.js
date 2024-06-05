import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase';
import pic from './FocusViewBackground.jpg';
// import { makeStyles } from '@mui/styles';

import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';


const Header = () => {
    const navigate = useNavigate()
    const [loggedIn, setLoggedIn] = useState(false)


    const signoff = async () => {
        try {
            await signOut(auth);
            navigate('/login')
        } catch (err) {
            console.log(err)
        }
    }

    const login = () => {
        window.location.href = '/login';
    }

    const register = () => {
        window.location.href = '/register';
    }

    const home = () => {
        window.location.href = '/begin_session';
    }

    // const useStyles = makeStyles((theme) => ({
    //     transparentAppBar: {
    //       backgroundColor: 'transparent', // Set background color to transparent
    //       boxShadow: 'none', // Remove box shadow
    //     },
    //   }));

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setLoggedIn(true)
        } else {
            setLoggedIn(false)
        }
    })


    // const classes = useStyles();

    return (
        <nav className='flex flex-row gap-x-2 w-full z-20 fixed top-0 left-0 h-12 border-b place-content-center items-center bg-gray-200'>
            {
                loggedIn
                    ?
                    <>
                        <AppBar position="static" sx={{ backgroundImage: `url(${pic})`, backgroundSize: 'cover', boxShadow: 'none' }}>
                            <Toolbar>
                                {/* <Typography variant="Times New Roman" component="div" sx={{ flexGrow: 1, justifyContent:'left'}}>
                            FocusView
                            </Typography> */}
                                {/* <Button color="inherit" component={Link} to="/stats">Stats</Button> */}
                                <Button color="inherit" onClick={home} >Home</Button>
                                <Button color="inherit" onClick={signoff} >Logout</Button>
                            </Toolbar>
                        </AppBar>
                        {/* // <button onClick={signoff} className='text-sm text-blue-600 underline'>Logout</button> */}
                    </>
                    :
                    <>

                        <AppBar position="static" sx={{ backgroundImage: `url(${pic})`, backgroundSize: 'cover', boxShadow: 'none' }}>
                            <Toolbar>
                                {/* <Typography variant="Times New Roman" component="div" sx={{ flexGrow: 1, justifyContent:'left'}}>
                            FocusView
                            </Typography> */}
                                {/* <Button color="inherit" component={Link} to="/stats">Stats</Button> */}
                                <Button color="inherit" onClick={login}>Login
                                </Button>

                                <Button color="inherit" onClick={register}>Register
                                </Button>
                            </Toolbar>
                        </AppBar>

                    </>
            }

        </nav>
    );
}
 

export default Header;