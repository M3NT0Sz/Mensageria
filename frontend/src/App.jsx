import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Passenger from './pages/Passenger';
import Driver from './pages/Driver';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/passenger" element={<Passenger />} />
        <Route path="/driver" element={<Driver />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;