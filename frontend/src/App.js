import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import  Login from './components/Login';
import Header from './components/Header';
import Register from './components/Register';
import BeginSession from './components/BeginSession'; 
import Calibration from './components/Calibration'; 
import { Session } from './components/Session';
import SessionSummary from './components/SessionSummary';

function App() {
   return (
			<Router>
				<Header />
				<Routes>
					<Route path="/" element={<BeginSession />} /> {/* Default route */}
					<Route path="/begin_session" element={<BeginSession />} />
					<Route path="/calibration" element={<Calibration />} />
					<Route path="/session" element={<Session />} />
					<Route path="/session_summary" element={<SessionSummary />} />
					<Route exact path="/login" element={<Login />} />
					<Route exact path="/register" element={<Register />} />
				</Routes>
			</Router>
	);
}

export default App;
