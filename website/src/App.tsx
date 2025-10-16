import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Docs from './pages/Docs';
import Examples from './pages/Examples';
import Community from './pages/Community';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="/community" element={<Community />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;