import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import  SignIn from './components/signin';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Page1 from './components/page_1'; 
import Page2 from './components/page_2'; 
import { Page3 } from './components/page_3';


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
          <Route path="/signin" element={<SignIn />} />
					<Route exact path="/register" element={<Register />} />
				</Routes>
			</Router>
	);
}

export default App;
