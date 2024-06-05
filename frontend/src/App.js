import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import  Login from './components/Login';
import Header from './components/Header';
import Register from './components/Register';
import BeginSession from './components/BeginSession'; 
import Calibration from './components/Calibration'; 
import { Session } from './components/Session';
import SessionSummary from './components/SessionSummary';
import UserStats from './components/UserStats';

function App() {
   return (
	<div className='App'>
			<Router>
				<Header />
				<Routes>
					<Route path="/" element={<BeginSession />} /> {/* Default route */}
					<Route path="/begin_session" element={<BeginSession />} />
					<Route path="/calibration" element={<Calibration />} />
					<Route path="/session" element={<Session />} />
					<Route path="/session_summary" element={<SessionSummary />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path='/user' element={<UserStats />} />
				</Routes>
			</Router>
	</div>
	);
}

export default App;
