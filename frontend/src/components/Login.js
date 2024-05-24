import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, googleProvider } from '../config/firebase'
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from 'firebase/auth'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loggedIn, setLoggedIn] = useState(false)

    const navigate = useNavigate();
    async function handleFormSubmit(e) {
        e.preventDefault()
        try {
            await signInWithEmailAndPassword(auth, email, password)
            setLoggedIn(true)
            navigate('/')
        } catch (err) {
            console.log(err)
        }
    }

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
            setLoggedIn(true)
        } catch (error) {
            console.error(error)
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
            <div>
                <div>Login</div>
                <form className="form" onSubmit={handleFormSubmit}>
                    <div className="inputs">
                        <div>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
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
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        </div>
                    </div>
                    <div>
                        <button
                        type="submit"
                        >
                        Register Account
                        </button>
                    </div>
                    <div>
                        <button onClick={signInWithGoogle}>Sign in with Google</button>
                    </div>
                    <div>
                        <div>
                            <a href="/register">Don't have an account? Register</a>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
 
export default Login;