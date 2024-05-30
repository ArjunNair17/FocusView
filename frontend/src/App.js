import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import logo from './logo.svg';
import './App.css';
import Button from '@mui/material/Button';
import Page1 from './page_1'; 
import Page2 from './page_2'; 
import { Page3 } from './page_3';
import  SignIn from './signin';
import Stack from '@mui/material/Stack';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page1 />} /> {/* Default route */}
        <Route path="/page_1" element={<Page1 />} />
        <Route path="/page_2" element={<Page2 />} />
        <Route path="/page_3" element={<Page3 />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
