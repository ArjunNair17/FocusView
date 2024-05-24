import './App.css';
import {BrowserRouter as Router, Routes, Route,Link} from "react-router-dom"
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
// import Auth from './components/Auth';
import logo from './logo.svg';
import './App.css';
import Button from '@mui/material/Button';
import Page1 from './page_1'; 
import Page2 from './page_2'; 
import { Page3 } from './page_3';
import Stack from '@mui/material/Stack';



function App() {
	return (
			<Router>
				<Header />
				<Routes>
   
      <Route path="/" element={<Page1 />} /> {/* Default route */}
          <Route path="/page_1" element={<Page1 />} />
          <Route path="/page_2" element={<Page2 />} />
          <Route path="/page_3" element={<Page3 />} />
					<Route exact path="/login" element={<Login />} />
					<Route exact path="/register" element={<Register />} />
				</Routes>
			</Router>
	);
}

export default App;
