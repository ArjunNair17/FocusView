import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
// import Auth from './components/Auth';


function App() {
	return (
			<Router>
				<Header />
				<Routes>
					<Route exact path="/login" element={<Login />} />
					<Route exact path="/register" element={<Register />} />
				</Routes>
			</Router>
	);
}

export default App;
