import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
    const { currentUser } = useAuth()
    return (
        <div className='text-2x1 font-bold pt-14'>
            Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.
        </div>
    );
}
 
export default Home;