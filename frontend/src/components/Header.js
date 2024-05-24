import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase';

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

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setLoggedIn(true)
        } else {
            setLoggedIn(false)
        }
    })

    return ( 
        <nav className='flex flex-row gap-x-2 w-full z-20 fixed top-0 left-0 h-12 border-b place-content-center items-center bg-gray-200'>
            {
                loggedIn
                    ?
                    <>
                        <button onClick={signoff} className='text-sm text-blue-600 underline'>Logout</button>
                    </>
                    :
                    <>
                        <Link className='text-sm text-blue-600 underline' to={'/login'}>Login</Link>
                        <Link className='text-sm text-blue-600 underline' to={'/register'}>Register New Account</Link>
                    </>
            }

        </nav>
    );
}
 
export default Header;