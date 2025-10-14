import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Layout from './components/Layout'; 
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LobbiesPage from './pages/LobbiesPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Route for the full-screen homepage */}
          <Route path="/" element={<HomePage />} />
          
          {/* Routes that use the standard layout with padding */}
          <Route element={<Layout />}>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/lobbies" element={<LobbiesPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;