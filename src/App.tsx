import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Roster from './components/Roster';
import Standings from './components/Standings';
import Stats from './components/Stats';
import Gameday from './components/Gameday';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<div>Welcome to the Florida Marlins App!</div>} />
        <Route path="/roster" element={<Roster />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/gameday" element={<Gameday />} />
      </Routes>
    </Router>
  );
}

export default App;
