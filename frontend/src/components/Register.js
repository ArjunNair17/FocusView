import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, googleProvider } from '../config/firebase'
import { createUserWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from 'firebase/auth'

const Register = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmpassword, setConfirmPassword] = useState("")
    const [loggedIn, setLoggedIn] = useState(false)

    const navigate = useNavigate();

    async function handleFormSubmit(e) {
        e.preventDefault()

        // if (confirmpassword === password) {
        //     try {
        //         await createUserWithEmailAndPassword(auth, email, password)
        //         setLoggedIn(true)
        //         navigate('/')
        //     } catch (err) {
        //         console.log(err)
        //     }
        // } else {
        //     console.log("Passwords do not match!")
        // }
    }

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
            setLoggedIn(true)
        } catch (error) {
            console.error(error)
        }
    }

    onAuthStateChanged(auth, (user) => {
        if(user) {
            setLoggedIn(true)
        } else {
            setLoggedIn(false)
        }
    })
    
    if (loggedIn)
    {
        return (
            <div>
                Welcome back { auth.currentUser.displayName }!
            </div>
        )
    } else  {
        return (
            <div>
                <div>Register</div>
                {/* <form className="form" onSubmit={handleFormSubmit}>
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
                            onChange={(e) => setEmail(e.target.value)}
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
                        <Link
                            to="/login"
                        >
                            Already have an account? Login
                        </Link>
                        </div>
                    </div>
                </form> */}
            </div>
        );
    }
}
 
export default Register;