import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Login from './components/accounts/Login';
import Register from './components/accounts/Register';

function App() {
	return (
		<div className="router">
			<Router>
				<Routes>
					<Route exact path="/register" element={<Register />}/>
					<Route exact path="/login" element={<Login />}/>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
