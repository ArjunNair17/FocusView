import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Login from './components/accounts/Login';
import Register from './components/accounts/Register';
import { AuthProvider } from './contexts/AuthContext';

function App() {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route exact path="/register" element={<Register />}/>
					<Route exact path="/login" element={<Login />}/>
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
