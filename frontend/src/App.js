import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import  Login from './components/Login';
import Header from './components/Header';
import Register from './components/Register';
import Page1 from './components/page_1'; 
import Page2 from './components/page_2'; 
import { Page3 } from './components/page_3';
import Page4 from './components/page_4';

function App() {
   return (
			<Router>
				<Header />
				<Routes>
					<Route path="/" element={<Page1 />} /> {/* Default route */}
					<Route path="/page_1" element={<Page1 />} />
					<Route path="/page_2" element={<Page2 />} />
					<Route path="/page_3" element={<Page3 />} />
					<Route path="/page_4" element={<Page4 />} />
					<Route exact path="/login" element={<Login />} />
					<Route exact path="/register" element={<Register />} />
				</Routes>
			</Router>
	);
}

export default App;
